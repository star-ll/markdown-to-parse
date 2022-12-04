import { MdAst, MdAstType, MdTextAst, RowType } from "../types/ast";
import { advanceBy, ParseContext } from "./parse.js";

export function parseImage(context: ParseContext, ancestors: MdAst[]) {
	// Image State
	const pattern = /^\!\[(.*)\]\((.+)\)/;
	const [matchText, name, url] = pattern.exec(context.source) || [];
	advanceBy(context, matchText?.length || 0);
	const ImageAst: MdAst = {
		type: "Image",
		rowType: RowType.Block,
		children: [],
		meta: {
			name,
			url,
		},
	};
	return ImageAst;
}
