import { TransformContext } from "./../../types/index.d";
import { MdAst, ElementAst } from "./../../types/ast.d";
export function transformLink(node: MdAst, context: TransformContext) {
	if (node.type !== "Link") {
		return;
	}

	const ast: ElementAst = {
		nodeName: "a",
		tagName: "a",
		attrs: [
			{
				href: node.meta?.url,
			},
		],
		childNodes: [
			{
				nodeName: "#text",
				value: node.meta?.name || "",
			},
		],
	};

	context.parent.childNodes[context.childIndex] = ast;
}
