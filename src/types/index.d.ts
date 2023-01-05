import { ErrorHandler } from "./errors.d";
import { ElementAst } from "./ast.d";
import { HtmlAst, MdAst } from "./ast.js";

export type Context = {
	errorHandler: ErrorHandler;
};

export type TransformPluginFn = (node: MdAst, context: TransformContext) => void

export type ParseContext = {
	source: string;
	originalSource: string;
	loc: {
		startOffset: number;
		startRow: number;
		startCol: number;
	};
} & Context;

export type TransformContext = {
	// mdAst
	mdAst: MdAst;
	parentMdAst: MdAst;
	// HtmlAst
	rootAst: HtmlAst;
	parent: ElementAst;
	childIndex: number;
	transformPlugins: {
		[fnName: string]: TransformPluginFn;
	};
} & Context;

export type GenerateContext = {
	root: HtmlAst;
	parent: HtmlAst;
	currentNode: HtmlAst;
	source: string;
} & Context;
