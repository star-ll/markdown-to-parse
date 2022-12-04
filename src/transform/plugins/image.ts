import { TransformContext } from "./../../types/index.d";
import { MdAst, ElementAst } from "./../../types/ast.d";
export function transformImage(node: MdAst, context: TransformContext) {
	if (node.type !== "Image") {
		return;
	}

	const ast: ElementAst = {
		nodeName: "img",
		tagName: "img",
		attrs: [
			{
                src: node.meta?.url,
			},
		],
		childNodes: [],
	};
	if (node.meta?.name) {
        ast.attrs[0].alt = node.meta.name;
        ast.attrs[0].title = node.meta.name;
	}

	context.parent.childNodes[context.childIndex] = ast;
}
