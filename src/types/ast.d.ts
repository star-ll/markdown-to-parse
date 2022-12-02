export type MdAstType =
	| "Root"
	| "Title1"
	| "Title2"
	| "Title3"
	| "Title4"
	| "Title5"
	| "Title6"
	| "Text"
	| "Bold"
	| "Italic"
	| "BoldAndItalic"
	| "Underline"
	| "Code"
	| "Quote";

export const enum RowType {
	Root,
	Block,
	Inline,
}

// export type TransformMdAst = MdAst | ElementAst | TextAst;
// export type TransformMdAstChildren = MdAst[] | ElementAst[] | TextAst[];

export interface MdAst {
	type: MdAstType;
	rowType: RowType;
	value?: string;
	children: MdAst[];
}

export type MdTextAst = Omit<MdAst, "value">;

// HTML AST

export type ElementAst = {
	nodeName: string;
	tagName: string;
	attrs: any[];
	childNodes: (ElementAst | TextAst)[];
};

export type TextAst = {
	nodeName: "#text";
	value: string;
};

export type HtmlAst = ElementAst | TextAst;
