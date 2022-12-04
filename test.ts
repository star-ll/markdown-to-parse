import fs from "fs";
import path from "path";
import { generate } from "./src/generate/generate.js";
import { parse } from "./src/parse/parse.js";
import { transform } from "./src/transform/transform.js";

const md = fs.readFileSync(path.resolve("./test/hello.md")).toString();

console.time("parse");
const ast = parse(md);
console.timeEnd("parse");

fs.writeFileSync(
	path.resolve("./test/hello.mdAst.json"),
	JSON.stringify(ast, undefined, 2)
);

console.time("transform");
const transformResult = transform(ast);
console.timeEnd("transform");

fs.writeFileSync(
	path.resolve("./test/hello.transform.json"),
	JSON.stringify(transformResult, undefined, 2)
);

console.time("generate");
const html = generate(transformResult);
console.timeEnd("generate");

// console.log(html);

fs.writeFileSync(path.resolve("./test/hello.html"), html);

export { parse, transform, generate };
