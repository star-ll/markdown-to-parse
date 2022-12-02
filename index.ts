import fs from "fs";
import path from "path";
import { generate } from "./src/generate/generate.js";
import { parse } from "./src/parse/parse.js";
import { transform } from "./src/transform/transform.js";

const md = fs.readFileSync(path.resolve("./demo/hello.md")).toString();

const ast = parse(md);
fs.writeFileSync(
	path.resolve("./demo/hello.mdAst.json"),
	JSON.stringify(ast, undefined, 2)
);

const transformResult = transform(ast);

fs.writeFileSync(
	path.resolve("./demo/hello.transform.json"),
	JSON.stringify(transformResult, undefined, 2)
);

const html = generate(transformResult);

// console.log(html);

fs.writeFileSync(path.resolve("./demo/hello.html"), html);
