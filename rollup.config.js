import cleanup from "rollup-plugin-cleanup"
import terser from '@rollup/plugin-terser'
import { nodeResolve } from "@rollup/plugin-node-resolve"
import replace from '@rollup/plugin-replace'
import alias from '@rollup/plugin-alias'
import filesize from 'rollup-plugin-filesize'
import path from "path"

const fileList = [
  "script/content.js",
  "script/background.js",
  "script/options.js",
]
const dir = "./src"
const outputDir = `./dist`

const plugins = [
  cleanup({
    sourcemap: process.env.NODE_ENV === "development"
  }),
  nodeResolve({
    browser: true,
  }),
  replace({
    preventAssignment: true,
    values: {
      "process.env.NODE_ENV": `"${process.env.NODE_ENV}"`,
      "process.env.BROWSER": `"${process.env.BROWSER||""}"`,
      "process.env.MANIFEST_VERSION": `"${process.env.MANIFEST_VERSION||""}"`
    }
  }),
  alias({
    entries: {
      "@": path.join(".", dir, `script`)
    }
  }),
  filesize()
]

if(process.env.NODE_ENV === "production") {
  plugins.push(terser())
}

const exportList = fileList.map(name => {
  const plg = [...plugins]
  return {
    input: `${dir}/${name}`,
    output: [
      {
        file: `${outputDir}/${name}`,
        format: "iife",
        sourcemap: process.env.NODE_ENV === "development" ? "inline" : false
      }
    ],
    plugins: plg
  }
})

export default exportList
