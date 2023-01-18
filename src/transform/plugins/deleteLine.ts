import { TransformContext } from "../../types/index";
import { MdAst, RowType, ElementAst } from "../../types/ast";

export function transformDeleteLine(node: MdAst, context: TransformContext) {
	if (node.type !== "DeleteLine" || node.rowType !== RowType.Inline) {
		return;
	}

	const ast: ElementAst = {
		nodeName: "s",
		tagName: "s",
		attrs: [],
		childNodes: [],
	};
	context.parent.childNodes[context.childIndex] = ast;
}
