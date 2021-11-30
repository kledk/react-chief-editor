import { defineConfig } from "vite";
import path from "path";
import { ViteAliases } from "vite-aliases";
import typescript from "@rollup/plugin-typescript";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    build: {
      lib: {
        entry: path.resolve(__dirname, "src/index.ts"),
        name: "ChiefEditor",
        formats: ["es", "umd"],
        fileName: (format) => `chief-editor.${format}.js`,
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        external: ["react", "react-dom", "styled-components"],
        output: {
          // Provide global variables to use in the UMD build
          // for externalized deps
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
        },
      },
    },
    plugins: [
      ...(command === "serve"
        ? [react()]
        : [
            ViteAliases(),
            typescript({
              rootDir: path.resolve(__dirname, "src"),
              declaration: true,
              declarationDir: path.resolve(__dirname, "dist"),
              exclude: path.resolve("./node_modules/**"),
              sourceMap: true,
            }),
          ]),
    ],
  };
});
