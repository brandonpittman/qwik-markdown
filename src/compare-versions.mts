import { compareVersions } from "compare-versions";
import { devDependencies } from "../package.json";

const REQVERSION = "1.2.8";

export const isValidVersion = () => {
  const qwikVersion = devDependencies["@builder.io/qwik"];
  return compareVersions(qwikVersion, REQVERSION) >= 0;
};
