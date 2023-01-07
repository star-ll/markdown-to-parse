import { MdAst, RowType } from "./../types/ast.d";
import { ParseContext } from "./../types/index.d";
import { advanceBy } from "./parse.js";
import { parsePlainText } from "./text.js";

export function parseCodeBlock(context: ParseContext, ancestors: MdAst[]) {
	// CodeBlock State
	const pattern = /^\`{3}([a-zA-Z]*)(.*\n*)*\`{3}/;
	const matchText = context.source.match(pattern);

	if (!matchText) {
		return;
	}

	const codeLanguage = matchText[1] || "plain";
	const codeText = matchText[2];

	const codeBlockAst: MdAst = {
		type: "CodeBlock",
		rowType: RowType.Block,
		children: [],
		meta: {
			language: codeLanguage,
		},
		value: codeText,
	};

	advanceBy(context, matchText[0].length);
	return codeBlockAst;
}
