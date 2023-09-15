#!/usr/bin/env tsx

const args = process.argv.slice(2);

switch (args[0]) {
  case "g":
  case "generate":
    await import("./generate.mjs").then(
      async (m) => await m.runGenerateCommand()
    );
    break;
  case "v":
  case "validate":
    await import("./validate.mjs").then(async (m) => m.runValidateCommand());
    break;
  default:
    console.log(`Supported commands:
      generate, g
      validate, v`);
}
