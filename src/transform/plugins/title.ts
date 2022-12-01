import { ElementAst, MdAst, MdAstType } from "./../../types/ast.d";
import { TransformContext } from "./../../types/index.d";
import { transformPlainText } from "./text.js";

type TitleType = Extract<
	MdAstType,
	"Title1" | "Title2" | "Title3" | "Title4" | "Title5" | "'Title6'"
>;

const titleMaps = {
	Title1: "h1",
	Title2: "h2",
	Title3: "h3",
	Title4: "h4",
	Title5: "h5",
	Title6: "h6",
};
const titleTypes = Object.keys(titleMaps);

export function transformTitle(node: MdAst, context: TransformContext) {
	if (!titleTypes.includes(node.type)) {
		return;
	}
	const { childIndex, parent } = context;
	const nodeName = titleMaps[node.type as TitleType];
	const ast: ElementAst = {
		nodeName,
		tagName: nodeName,
		attrs: [],
		childNodes: [],
	};
	
	context.parent = ast;
	context.childIndex = 0
	transformPlainText(node, context,false);
	context.parent = parent;
	context.childIndex = childIndex

	parent.childNodes[childIndex] = ast;
}
