export type TitleType =
	| "Title1"
	| "Title2"
	| "Title3"
	| "Title4"
	| "Title5"
	| "Title6";

export type MdAstType =
	| "Root"
	| "Text"
	| "Bold"
	| "Italic"
	| "BoldAndItalic"
	| "Underline"
	| "Code"
	| "CodeBlock"
	| "Quote"
	| "OrderedList"
	| "OrderedListItem"
	| "UnorderedList"
	| "UnorderedListItem"
	| "Image"
	| "Link"
	| "SeparateLine"
	| "DeleteLine"
	| TitleType;

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
	meta?: { [name: string]: any };
}

export type MdTextAst = Omit<MdAst, "value">;

// HTML AST

export type ElementAst = {
	nodeName: string;
	tagName: string;
	attrs: any[];
	childNodes: (ElementAst | TextAst)[];
	isSelfClose?: boolean;
};

export type TextAst = {
	nodeName: "#text";
	value: string;
};

export type HtmlAst = ElementAst | TextAst;
