import commonjs from "rollup-plugin-commonjs";
// import purgeCss from '@fullhuman/postcss-purgecss';
import livereload from "rollup-plugin-livereload";
import postcss from "rollup-plugin-postcss";
import resolve from "rollup-plugin-node-resolve";
import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";
import svelte_preprocess_postcss from "svelte-preprocess-postcss";
import builtins from "rollup-plugin-node-builtins";
import globals from "rollup-plugin-node-globals";
import copy from "rollup-plugin-copy-assets";
import replace from "rollup-plugin-replace";
import { generateSW } from "rollup-plugin-workbox";

import json from "@rollup/plugin-json";

const production = !process.env.ROLLUP_WATCH;
export default {
  input: "src/main.js",
  output: {
    format: "iife",
    sourcemap: true,
    name: "app",
    file: "dist/main.js"
  },

  plugins: [
    svelte({
      dev: !production,
      preprocess: {
        style: svelte_preprocess_postcss()
      },
      css: css => {
        css.write("dist/components.css");
      }
    }),
    generateSW({
      swDest: "dist/service-worker.js",
      skipWaiting: true,
      globDirectory: "dist",
      runtimeCaching: [
        {
          urlPattern: "/main.js",
          handler: "StaleWhileRevalidate"
        },
        {
          urlPattern: "/main.css",
          handler: "StaleWhileRevalidate"
        },
        {
          urlPattern: "/components.css",
          handler: "StaleWhileRevalidate"
        },
        {
          urlPattern: "/^https://fonts.googleapis.com/",
          handler: "StaleWhileRevalidate"
        }
      ]
    }),
    replace({
      "process.env.NODE_ENV": JSON.stringify("production")
    }),
    resolve(),
    commonjs(),
    globals(),
    builtins(),
    copy({
      assets: ["src/assets"]
    }),
    postcss({
      extract: true
    }),
    !production && livereload("dist"),
    production && terser(),
    json()
  ]
  // watch: {
  //    clearScreen: false,
  // },
};
