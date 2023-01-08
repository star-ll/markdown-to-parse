import { ElementAst, MdAst, RowType, TextAst } from "./../../types/ast.d";
import { TransformContext } from "../../types";

export function transformInlineCode(node: MdAst, context: TransformContext) {
	if (node.type !== "Code" || node.rowType !== RowType.Inline) {
		return;
	}

	const ast: ElementAst = {
		nodeName: "code",
		tagName: "code",
		attrs: [],
		childNodes: [
			{
				nodeName: "#text",
				value: node.value || "",
			},
		],
	};

	context.parent.childNodes[context.childIndex] = ast;
}

export function transformCodeBlock(node: MdAst, context: TransformContext) {
	if (node.type !== "CodeBlock" || node.rowType !== RowType.Block) {
		return;
	}

	let code = node.value || "";
	if (context.highlight) {
		code = context.highlight(code, node.meta?.language || "");
	}

	const ast: ElementAst = {
		nodeName: "pre",
		tagName: "pre",
		attrs: [],
		childNodes: [],
	};
	const codeAst: ElementAst = {
		nodeName: "code",
		tagName: "code",
		attrs: [],
		childNodes: [],
	};
	const codeTextAst: TextAst = {
		nodeName: "#text",
		value: code,
	};

	if (context.highlight) {
		ast.attrs.push({ class: "hljs" });
	}

	codeAst.childNodes.push(codeTextAst);
	ast.childNodes.push(codeAst);

	context.parent.childNodes[context.childIndex] = ast;
}
