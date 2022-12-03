import { MdAst, ElementAst } from "./../../types/ast.d";
import { TransformContext } from "../../types";

export function transformUnorderedList(node: MdAst, context: TransformContext) {
	if (node.type !== "UnorderedList") {
		return;
	}

	const ast: ElementAst = {
		nodeName: "ul",
		tagName: "ul",
		attrs: [],
		childNodes: [],
	};

	context.parent.childNodes[context.childIndex] = ast;
}

export function transformUnorderedListItem(
	node: MdAst,
	context: TransformContext
) {
	if (node.type !== "UnorderedListItem") {
		return;
	}

	const ast: ElementAst = {
		nodeName: "li",
		tagName: "li",
		attrs: [],
		childNodes: [],
	};

	context.parent.childNodes[context.childIndex] = ast;
}
