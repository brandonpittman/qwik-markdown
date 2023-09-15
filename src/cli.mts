#!/usr/bin/env tsx

import { runGenerateCommand } from "./generate.mjs";
import { runValidateCommand } from "./validate.mjs";

const args = process.argv.slice(2);

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
    console.log(`Supported commands:
      generate, g
      validate, v`);
}
