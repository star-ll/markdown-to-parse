import { TransformContext } from "../../types/index";
import { MdAst, RowType, ElementAst } from "./../../types/ast.d";

export function transformSeparateLine(node: MdAst, context: TransformContext) {
	if (node.type !== "SeparateLine" || node.rowType !== RowType.Block) {
		return;
	}

	const ast: ElementAst = {
		nodeName: "hr",
		tagName: "hr",
		isSelfClose: true,
		attrs: [],
		childNodes: [],
	};
	context.parent.childNodes[context.childIndex] = ast;
}
