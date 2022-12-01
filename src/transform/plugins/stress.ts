import { ElementAst, MdAst } from "../../types/ast";
import { TransformContext } from "../../types";
import { transformPlainText } from "./text.js";

export function transformItalic(node: MdAst, context: TransformContext) {
	if (node.type !== "Italic") {
		return;
	}
	debugger;
	const ast: ElementAst = {
		nodeName: "i",
		tagName: "i",
		attrs: [],
		childNodes: [],
	};

	transformPlainText(node, { ...context, parent: ast, childIndex: 0 }, false);
	context.parent.childNodes[context.childIndex] = ast;
}

export function transformBold(node: MdAst, context: TransformContext) {
	if (node.type !== "Bold") {
		return;
	}

	const ast: ElementAst = {
		nodeName: "b",
		tagName: "b",
		attrs: [],
		childNodes: [],
	};
	transformPlainText(node, { ...context, parent: ast, childIndex: 0 }, false);
	context.parent.childNodes[context.childIndex] = ast;
}

export function transformBoldAndItalic(node: MdAst, context: TransformContext) {
	if (node.type !== "BoldAndItalic") {
		return;
	}

	const ast: ElementAst = {
		nodeName: "b",
		tagName: "b",
		attrs: [],
		childNodes: [
			{
				nodeName: "i",
				tagName: "i",
				attrs: [],
				childNodes: [
					{
						nodeName: "#text",
						value: node.value || "",
					},
				],
			},
		],
	};

	context.parent.childNodes[context.childIndex] = ast;
}
