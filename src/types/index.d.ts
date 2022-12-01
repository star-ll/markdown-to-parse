import { ElementAst } from './ast.d';
import { HtmlAst, MdAst } from "./ast.js";

export type Context = {
	source: string;
	originalSource: string;
	0;
};

export type TransformContext = {
	// mdAst
	mdAst: MdAst;
	parentMdAst: MdAst;
	// HtmlAst
	rootAst: HtmlAst
	parent: ElementAst;
	childIndex: number;
	transformPlugins: ((node: MdAst , context: TransformContext) => void)[];
};
