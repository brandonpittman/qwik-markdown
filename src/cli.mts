#!/usr/bin/env tsx

import { intro, note, outro } from "@clack/prompts";
import { runGenerateCommand } from "./generate.mjs";
import { runValidateCommand } from "./validate.mjs";
import { isValidVersion } from "./compare-versions.mjs";
import pc from "picocolors";

if (!(await isValidVersion())) {
  console.error(
    pc.bold(pc.red("Qwik Markdown requires Qwik 1.2.8 or greater."))
  );
  process.exit(1);
}

const args = process.argv.slice(2);

const SPACE_TO_HINT = 18;
const COMMANDS = [
  {
    value: "generate",
    label: "generate, g",
    hint: "Generate a Markdown route",
    showInHelp: true,
  },
  {
    value: "validate",
    label: "validate, v",
    hint: "Validate Markdown route schemas",
    showInHelp: true,
  },
];

switch (args[0]) {
  case "g":
  case "generate":
    runGenerateCommand();
    break;
  case "v":
  case "validate":
    runValidateCommand();
    break;
  default:
    console.clear();
    intro("Qwik Markdown");
    note(
      COMMANDS.filter((cmd) => cmd.showInHelp)
        .map(
          (cmd) =>
            `qwik-markdown ${pc.cyan(cmd.label)}` +
            " ".repeat(Math.max(SPACE_TO_HINT - cmd.label.length, 2)) +
            pc.dim(cmd.hint)
        )
        .join("\n"),
      "Available commands"
    );
    outro(
      "Visit https://github.com/brandonpittman/qwik-markdown for more information."
    );
}
