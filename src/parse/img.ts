import { ParseContext } from "./../types/index.d";
import { MdAst, RowType } from "../types/ast";
import { advanceBy } from "./parse.js";

export function parseImage(context: ParseContext, ancestors: MdAst[]) {
	// Image State
	const pattern = /^\!\[(.*)\]\((.+)\)/;
	const [matchText, name, url] = pattern.exec(context.source) || [];
	advanceBy(context, matchText?.length || 0);
	const imageAst: MdAst = {
		type: "Image",
		rowType: RowType.Block,
		children: [],
		meta: {
			name,
			url,
		},
	};
	return imageAst;
}
