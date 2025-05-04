import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";

const bannerText = `/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author ? pkg.author : pkg.contributors}
 * Released under the ${pkg.license} License
 + This file is auto-generated. Do not edit.
 */`;

export default [
  {
    input: "./src/frontend/Frontend.ts",
    external: ["logger"],
    plugins: [
      typescript({ module: "ESNext" }),
      nodeResolve(),
      commonjs(),
      terser(),
    ],
    output: {
      file: `./${pkg.main}`,
      format: "iife",
      globals: {
        logger: "Log",
      },
      banner: bannerText,
    },
  },
  {
    input: "./src/backend/Backend.ts",
    external: ["node_helper", "logger", "axios", "cheerio"],
    plugins: [typescript({ module: "ESNext" }), nodeResolve(), terser()],
    output: {
      interop: "auto",
      file: "./node_helper.js",
      format: "cjs",
      banner: bannerText,
    },
  },
];
