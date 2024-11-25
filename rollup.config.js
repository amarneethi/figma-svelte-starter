import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import html from "@rollup/plugin-html";
import css from "rollup-plugin-css-only";

// Helper to inline the CSS and JS into the HTML
function createHtmlTemplate({ files }) {
  const scripts = (files.js || [])
    .map(
      ({ fileName }) =>
        `<script>${require("fs").readFileSync(
          `public/build/${fileName}`,
          "utf8"
        )}</script>`
    )
    .join("\n");

  const styles = (files.css || [])
    .map(
      ({ fileName }) =>
        `<style>${require("fs").readFileSync(
          `public/build/${fileName}`,
          "utf8"
        )}</style>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Figma Plugin</title>
    ${styles}
  </head>
  <body>
    ${scripts}
  </body>
</html>`;
}

export default [
  // Bundling configuration
  {
    input: "src/main.js",
    output: {
      format: "iife",
      name: "app",
      file: "public/build/main.js",
    },
    plugins: [
      svelte({
        compilerOptions: {
          dev: false, // Disable for production
        },
      }),
      css({ output: "main.css" }),
      resolve({
        browser: true,
        dedupe: ["svelte"],
      }),
      commonjs(),
      terser(), // Minify JS
      html({
        fileName: "index.html", // Generate index.html in "public/"
        template: createHtmlTemplate,
      }),
    ],
  },
];
