import { TransformContext } from "./../../types/index.d";
import { MdAst, ElementAst } from "./../../types/ast.d";
export function transformQuote(node: MdAst, context: TransformContext) {
	if (node.type !== "Quote") {
		return;
	}

	const ast: ElementAst = {
		nodeName: "div",
		tagName: "div",
		attrs: [
			{
				style: "border-left: 4px solid #c9c9c9;padding-left: 1rem;",
			},
		],
		childNodes: [],
	};

	context.parent.childNodes[context.childIndex] = ast;
}
