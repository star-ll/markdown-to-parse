import { ElementAst } from './ast.d';
import { HtmlAst, MdAst } from "./ast.js";

export type Context = {
	source: string;
	originalSource: string;
	
};

export type TransformContext = {
	// mdAst
	mdAst: MdAst;
	parentMdAst: MdAst;
	// HtmlAst
	rootAst: HtmlAst
	parent: ElementAst;
	childIndex: number;
	transformPlugins: {[fnName: string]: ((node: MdAst , context: TransformContext) => void)};
};


export type GenerateContext = {
	root: HtmlAst;
	parent: HtmlAst;
	currentNode: HtmlAst;
	source: string;
}