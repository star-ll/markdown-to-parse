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

	// 两个p标签不能嵌套
	const tagName = context.parentMdAst.rowType === RowType.Root ? "p" : "div";

	const ast: ElementAst = {
		nodeName: tagName,
		tagName,
		attrs: [],
		childNodes: [],
	};
	context.parent.childNodes[context.childIndex] = ast;
}
