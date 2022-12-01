import fs from "fs"
import path from "path"
import { parse } from "./src/parse/parse.js";

const md = fs.readFileSync(path.resolve("./demo/hello.md")).toString();

const result = parse(md)

console.log(result);
