import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import copy from "rollup-plugin-copy";
import replace from "@rollup/plugin-replace";
import terser from "@rollup/plugin-terser";
import postcss from "rollup-plugin-postcss";
import path from "path";
const isWatching = process.env.ROLLUP_WATCH;

export default [
  {
    input: "src/index.ts",
    plugins: [
      typescript({ tsconfig: "tsconfig.buildPanel.json" }),
      json(),
      // resolve(),
      // babel({
      //     exclude: "node_modules/**",
      //     presets: ["@babel/env", "@babel/preset-react"],
      // }),
      // commonjs(),
    ],
    output: [
      { file: "dist/index.js", format: "cjs" },
      { file: "dist/index.mjs", format: "es" },
    ],
  },
  {
    input: "src/react-app/index.tsx",
    output: {
      file: "dist/react-app/bundle.js",
      format: "umd",
      sourcemap: true,
      name: "trpc-panel",
    },
    plugins: [
      postcss({
        extract: path.resolve("dist/react-app/index.css"),
      }),
      nodeResolve({
        extensions: [".js", ".ts", ".tsx", "ts"],
      }),
      typescript({ tsconfig: "tsconfig.buildReactApp.json" }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
        preventAssignment: false,
      }),
      babel({
        presets: [
          [
            "@babel/preset-react",
            {
              development: isWatching,
            },
          ],
        ],
      }),
      commonjs(),
      copy({
        targets: [
          {
            src: "src/react-app/index.html",
            dest: "dist/react-app",
          },
        ],
      }),
      !isWatching && terser(),
    ],
  },
];
