import { ElementAst, MdAst } from "../../types/ast";
import { TransformContext } from "../../types";
import { transformPlainText } from "./text.js";

export function transformItalic(node: MdAst, context: TransformContext) {
	if (node.type !== "Italic") {
		return;
	}

	const ast: ElementAst = {
		nodeName: "em",
		tagName: "em",
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
		nodeName: "strong",
		tagName: "strong",
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
		nodeName: "strong",
		tagName: "strong",
		attrs: [],
		childNodes: [
			{
				nodeName: "em",
				tagName: "em",
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
