import { ErrorHandler } from "./errors.d";
import { ElementAst } from "./ast.d";
import { HtmlAst, MdAst } from "./ast.js";

export type Context = {
	errorHandler: ErrorHandler;
};

export type TransformPluginFn = (
	node: MdAst,
	context: TransformContext
) => void;

export type Loc = {
	startOffset: number;
	endOffset: number;
	offset?: number;
	startRow?: number;
	endRow?: number;
};

export type ParseContext = {
	source: string;
	originalSource: string;
	loc: Loc;
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
} & Context &
	Partial<Config>;

export type GenerateContext = {
	root: HtmlAst;
	parent: HtmlAst;
	currentNode: HtmlAst;
	source: string;
} & Context;

export type Config = {
	highlight: (code: string, lang: string) => string;
};
