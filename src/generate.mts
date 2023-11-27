import { execSync } from "node:child_process";
import { globSync } from "glob";
import {
  intro,
  outro,
  text,
  select,
  cancel,
  isCancel,
  confirm,
} from "@clack/prompts";
import { regex, safeParse, string, minLength, getFallback } from "valibot";
import { existsSync, writeFileSync } from "node:fs";
import clipboard from "clipboardy";

const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

const handleCancel = (valueToCheck: unknown, message = "Goodbye!") => {
  if (isCancel(valueToCheck)) {
    cancel(message);
    process.exit(0);
  }
};

const validSlug = /^[a-z0-9]+(-[a-z0-9]+)*\.(mdx?)$/g;

type Resource = { raw: string; type: string };

export const runGenerateCommand = async () => {
  console.clear();
  intro("Create new resource");

  const configFiles = globSync("src/routes/*/schema.ts", {
    ignore: "node_modules/**",
  });

  if (!configFiles.length) {
    cancel("No schema.ts files found under '/routes'.");
    process.exit(1);
  }

  const mappedConfigFiles = configFiles.map((raw) => {
    const type = raw.split("src/routes/")[1].split("/")[0];
    return {
      raw,
      type,
    };
  });

  const resource = (await select({
    message: "Pick a resource type.",
    options: mappedConfigFiles.map((v) => ({
      value: v,
      label: capitalizeFirstLetter(v.type),
    })),
  })) as Resource;

  handleCancel(resource);

  const { schema } = await import(process.cwd() + "/" + resource.raw);

  if (schema.type !== "object") {
    throw new Error("Schema must be an object schema.");
  }

  const entries = Object.entries(schema.entries);

  const metadata: Record<
    string,
    { type: "boolean" | "string" | "enum"; value?: string | Symbol }
  > = {};

  const filename = await text({
    message: "Enter a filename",
    validate(value) {
      const validated = safeParse(
        string([
          minLength(1, "Filename cannot be empty"),
          regex(validSlug, "Invalid filename or extension"),
        ]),
        value
      );

      if (validated.success) {
        const writePath = `${process.cwd()}/routes/${resource.type}/${
          value.split(".")[0]
        }/index.md`;

        const pathExists = existsSync(writePath);

        if (pathExists) {
          return "Path already exists";
        }
        return;
      } else {
        return validated.issues[0].message;
      }
    },
  });

  handleCancel(filename);

  const writePath = `${process.cwd()}/src/routes/${resource.type}/${
    (filename as string).split(".")[0]
  }/index.md`;

  for (const [key, subSchema] of entries as [
    [string, { schema: any; default?: any; wrapped?: any }]
  ]) {
    const isOptional = subSchema.schema === "optional";
    const initialValue = subSchema.default;
    const parsedSchema =
      subSchema.schema === "optional" ? subSchema.wrapped : subSchema;

    metadata[key] = { type: parsedSchema.schema };

    switch ((parsedSchema as any).schema) {
      case "boolean":
        metadata[key].value = await select({
          message: capitalizeFirstLetter(key) + "?",
          initialValue: initialValue ? "true" : "false",
          options: [
            { value: "true", label: "True" },
            { value: "false", label: "False" },
          ],
        });

        break;
      case "enum":
        metadata[key].value = await select({
          message: capitalizeFirstLetter(key) + "?",
          initialValue,
          options: parsedSchema.enum.map((v: string) => ({
            value: v,
            label: v,
          })),
        });
        break;
      default:
        metadata[key].value = await text({
          message: capitalizeFirstLetter(key) + "?",
          initialValue: initialValue || getFallback(parsedSchema),
          validate(value) {
            if (isOptional) return;
            const validated = safeParse(parsedSchema, value);
            if (validated.success) {
              return;
            } else {
              return validated.issues.at(0)?.message;
            }
          },
        });
    }

    handleCancel(metadata[key].value);
  }

  const command = execSync(
    `npm run qwik new /${resource.type}/${filename as string}`
  );

  console.log(command.toString());

  const output = `---
${Object.entries(metadata)
  .filter(([, v]) => v.value != null)
  .map(([k, v]) => `${k}: ${v.type === "string" ? `"${v.value}"` : v.value}`)
  .join("\n")}
---`;

  writeFileSync(writePath, output);

  const shouldCopy = await confirm({
    message: "Copy new file path to clipboard?",
  });

  if (shouldCopy === true) {
    clipboard.writeSync(writePath);
  }

  outro("All done!");
};
