import { ElementAst, MdAst, RowType } from "./../../types/ast.d";
import { TransformContext } from "../../types";

export function transformInlineCode(node: MdAst, context: TransformContext) {
	if (node.type !== "Code" || node.rowType !== RowType.Inline) {
		return;
	}

	const ast: ElementAst = {
		nodeName: "code",
		tagName: "code",
		attrs: [],
		childNodes: [
			{
				nodeName: "#text",
				value: node.value || "",
			},
		],
	};

	context.parent.childNodes[context.childIndex] = ast;
}

export function transformInCodeBlock(node: MdAst, context: TransformContext) {
	if (node.type !== "Code" || node.rowType !== RowType.Block) {
		return;
	}

	const ast: ElementAst = {
		nodeName: "p",
		tagName: "p",
		attrs: [
			{
				style: "border-left: 4px solid #c9c9c9;padding-left: 1rem;",
			},
		],
		childNodes: [],
	};

	context.parent.childNodes[context.childIndex] = ast;
}
