import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// const extendedConfig = compat.extends("next/core-web-vitals", "next/typescript");

// console.log(JSON.stringify(extendedConfig, null, 2));

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript")
];

export default eslintConfig;
