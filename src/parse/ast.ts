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

export enum RowType {
	Root,
	Block,
	Inline,
}

export interface MdAst {
	type: MdAstType;
	rowType: RowType;
	value?: string;
	children: MdAst[];
}

export type TextAst = Omit<MdAst, "value">;
