import { execSync } from "child_process"
import fs from "fs"
import manifestBase from "../src/manifest.base.json" assert { type: "json" }
import manifestV2 from "../src/manifest.v2.json" assert { type: "json" }
import manifestV3 from "../src/manifest.v3.json" assert { type: "json" }
import manifestSafari from "../src/manifest.safari.json" assert { type: "json" }
import pkg from "../package.json" assert { type: "json" }

const env = process.env.NODE_ENV || "production"
const manifestVersion = process.env.MANIFEST_VERSION || 3
const browser = process.env.BROWSER || "chrome"

const isProduction = env === "production"

if(isProduction) {
  // clear dist folder
  execSync("rm -rf ./dist; mkdir ./dist")
}

// copy assets
const assetsPath = [
  "_locales",
  "icons",
  "assets",
  "style"
]

for (const path of assetsPath) {
  execSync(`cp ${isProduction?"-f":"-n"} -R src/${path} dist/${path}`, {stdio: 'inherit'})
}

// copy .html file
execSync(`cp ${isProduction?"-f":"-n"} -R src/*.html dist/`, {stdio: 'inherit'})

// build dist
execSync(`npx cross-env NODE_ENV=${env} MANIFEST_VERSION=${manifestVersion} BROWSER=${browser} rollup -c`, {stdio: 'inherit'})

// build manifest
let manifest = manifestBase
if(+manifestVersion === 3) {
  manifest = {...manifest, ...manifestV3}
}

if(+manifestVersion === 2) {
  manifest = {...manifest, ...manifestV2}
}

if(browser === "safari") {
  manifest = {...manifest, ...manifestSafari}
}

manifest.version = pkg.version

fs.writeFileSync("dist/manifest.json", JSON.stringify(manifest))