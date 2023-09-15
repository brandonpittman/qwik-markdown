import { globSync } from "glob";
import matter from "gray-matter";
import { parse, array, safeParse } from "valibot";
import { readFileSync } from "fs";

export const runValidateCommand = () => {
  const configFiles = globSync("src/routes/*/schema.ts", {
    ignore: "node_modules/**",
  });

  const mappedConfigFiles = configFiles.map((raw) => {
    const type = raw.split("src/routes/")[1].split("/")[0];
    return {
      raw,
      type,
    };
  });

  mappedConfigFiles.forEach((f) => {
    const contentFiles = globSync(`src/routes/${f.type}/**/*.{md,mdx}`);
    const dataMap = contentFiles.map((v) => matter(readFileSync(v)).data);

    import("../" + f.raw)
      .then(({ schema }) => {
        const validated = safeParse(array(schema), dataMap);
        if (!validated.success) {
          const dotPath = (issue) =>
            `${issue.message}: ` +
            issue.path
              .map((item) => item.key)
              .join(" - ")
              .replace(/(\d+)/, (v) => contentFiles[v])
              .replace("src/routes/", "")
              .replace(/\/index/, "")
              .replace(/\.mdx?/, "");

          console.log(validated.issues.map((i) => dotPath(i)));
        }
      })
      .catch((e: Error) => {
        if (
          e.message === "Cannot read properties of undefined (reading '_parse')"
        ) {
          console.error(
            `Module "${f.raw}" does not contain a "schema" export.`
          );
        } else {
          throw e;
        }
      });
  });
};
