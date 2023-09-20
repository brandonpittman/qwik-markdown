import { compare } from "compare-versions";

const REQVERSION = "1.2.8";

export const isValidVersion = async () => {
  const pkg = await import(process.cwd() + "/package.json");
  const qwikVersion = pkg.devDependencies["@builder.io/qwik"].replace(
    /[^~]/,
    ""
  );
  return compare(qwikVersion, REQVERSION, ">=");
};
