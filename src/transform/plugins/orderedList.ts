import { MdAst, ElementAst } from "./../../types/ast.d";
import { TransformContext } from "../../types";

export function transformOrderedList(node: MdAst, context: TransformContext) {
	if (node.type !== "OrderedList") {
		return;
	}

	const ast: ElementAst = {
		nodeName: "ol",
		tagName: "ol",
		attrs: [],
		childNodes: [],
    };

	if (node.meta?.start != null) {
		ast.attrs.push({
			start: node.meta.start,
		});
	}
	context.parent.childNodes[context.childIndex] = ast;
}

export function transformOrderedListItem(
	node: MdAst,
	context: TransformContext
) {
	if (node.type !== "OrderedListItem") {
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
