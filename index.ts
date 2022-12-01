import fs from "fs"
import path from "path"
import { parse } from "./src/parse/parse.js";
import { transform } from "./src/transform/transform.js";

const md = fs.readFileSync(path.resolve("./demo/hello.md")).toString();

const ast = parse(md)
console.log(ast.children[1]);

const transformResult = transform(ast)
// @ts-ignore
console.log(transformResult.childNodes[1]);



