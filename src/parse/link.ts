import { MdAst,  RowType } from "../types/ast";
import { advanceBy, ParseContext } from "./parse.js";

export function parseLink(context: ParseContext, ancestors: MdAst[]) {
	// Link State
	const pattern = /^\[(.*)\]\((.+)\)/;
	const [matchText, name, url] = pattern.exec(context.source) || [];
	advanceBy(context, matchText?.length || 0);
	const linkAst: MdAst = {
		type: "Link",
		rowType: RowType.Inline,
		children: [],
		meta: {
			name,
			url,
		},
	};
	return linkAst;
}
