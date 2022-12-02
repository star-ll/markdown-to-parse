import { TransformContext } from "../../types";
import { ElementAst, MdAst, RowType, TextAst } from "../../types/ast";

export function transformPlainText(
	node: MdAst,
	context: TransformContext,
	isPlugin = true
) {
	if (
		(node.type !== "Text" || node.rowType !== RowType.Inline) &&
		isPlugin == true
	) {
		return;
	}

	const plainTextAst: TextAst = {
		nodeName: "#text",
		value: node.value || "",
	};

	context.parent.childNodes[context.childIndex] = plainTextAst;
}

export function transformTextBlock(node: MdAst, context: TransformContext) {
	if (node.type !== "Text" || node.rowType !== RowType.Block) {
		return;
	}

	const ast: ElementAst = {
		nodeName: "p",
		tagName: "p",
		attrs: [],
		childNodes: [],
	};
	context.parent.childNodes[context.childIndex] = ast;
}
