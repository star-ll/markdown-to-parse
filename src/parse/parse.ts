import { MdAst, MdAstType, RowType, MdTextAst } from "./../types/ast.d";
import { parseImage } from "./img.js";
import { parseLink } from "./link.js";
import { parseText, parseTitle } from "./text.js";
export type ParseContext = {
	source: string;
	originalSource: string;
};

export function createParseContext(source: string): ParseContext {
	const context = {
		source: source.replace(/\r\n/g, "\n"),
		originalSource: source,
	};
	return context;
}

export function parse(md: string) {
	const context = createParseContext(md);
	const root = createRootAst();
	parseMarkdown(context, [root]);
	return root;
}

export function parseMarkdown(context: ParseContext, ancestors: MdAst[]) {
	const pattern = /^[\r\n\f]/;

	while (!isEnd(context)) {
		let node: MdAst | undefined;
		const parent = ancestors[ancestors.length - 1];

		if (pattern.test(context.source[0])) {
			advanceBy(context, 1);
			continue;
		} else if (context.source[0] === "#") {
			node = parseTitle(context, ancestors);
		} else if (context.source[0] === ">") {
			node = parseQuote(context, ancestors);
		} else if (/[0-9]/.test(context.source[0])) {
			node = parseOrderedList(context, ancestors);
		} else if (/\-/.test(context.source[0])) {
			node = parseUnOrderedList(context, ancestors);
		} else if (context.source[0] === "!") {
			if (/^\!\[/.test(context.source)) {
				node = parseImage(context, ancestors);
			}
		} else if (context.source[0] === "[") {
			if (/^\[.*\]\(.+\)/.test(context.source)) {
				node = parseLink(context, ancestors);
			}
		}

		if (!node) {
			node = parseText(context, ancestors);
		}

		if (node) {
			parent.children.push(node);
		}
	}
}

export function advanceBy(context: ParseContext, length: number) {
	context.source = context.source.slice(length);
}

export function isEnd(context: ParseContext) {
	return context.source.length === 0;
}
export function isNext(context: ParseContext) {
	return (
		/^\r\r/.test(context.source) ||
		/^\n\n/.test(context.source) ||
		/^\r\n\r\n/.test(context.source)
	);
}

function createRootAst(): MdAst {
	return {
		type: "Root",
		rowType: RowType.Root,
		children: [],
	};
}

function parseQuote(context: ParseContext, ancestors: MdAst[]) {
	const pattern = /^\>\s/;
	if (!pattern.test(context.source)) {
		// 不符合语法规则，当成普通文本处理
		return;
	}
	// Quote State
	const quoteAst: MdAst = {
		type: "Quote",
		rowType: RowType.Block,
		children: [],
	};
	ancestors.push(quoteAst);

	const source = /\>\s+(.[\r\n]?)*/.exec(context.source)?.[0] || "";
	advanceBy(context, source.length);
	const arr = source.replace(/\r/g, "\n").split("\n");
	arr.forEach((item, index) => {
		if (!/^\>\s+/.test(item)) {
			arr[index - 1] += item;
			arr[index] = "";
		}
	});
	const children = arr.filter((i) => !!i && !/^[\r\n\s\t]*$/.test(i));
	for (let i = 0; i < children.length; i++) {
		const textAst: MdAst = {
			type: "Text",
			rowType: RowType.Block,
			children: [],
		};
		ancestors.push(textAst);
		quoteAst.children.push(textAst);
		const matchOrder = /^\>\s+/.exec(children[i])?.[0] || "";
		parseMarkdown(
			{
				...context,
				source: children[i].slice(matchOrder.length),
			},
			ancestors
		);
		ancestors.pop();
	}

	ancestors.pop();

	return quoteAst;
}

export function parseOrderedList(context: ParseContext, ancestors: MdAst[]) {
	const pattern = /^([0-9]+)\.\s/;
	const matchText = pattern.exec(context.source);
	if (!matchText) {
		// 不符合语法规则，当成普通文本处理
		return;
	}
	// Ordered List State
	const orderedListAst: MdAst = {
		type: "OrderedList",
		rowType: RowType.Block,
		children: [],
		meta: {
			start: matchText[1],
		},
	};
	ancestors.push(orderedListAst);

	const source = /[0-9]\.\s+(.[\r\n]?)*/.exec(context.source)?.[0] || "";
	advanceBy(context, source.length);
	const arr = source.replace(/\r/g, "\n").split("\n");
	arr.forEach((item, index) => {
		if (!/^[0-9]+\.\s+/.test(item)) {
			arr[index - 1] += "\n" + item;
			arr[index] = "";
		}
	});
	const children = arr.filter((i) => !!i && !/^[\r\n\s\t]*$/.test(i));
	for (let i = 0; i < children.length; i++) {
		const orderedListItemAst: MdAst = {
			type: "OrderedListItem",
			rowType: RowType.Block,
			children: [],
		};
		ancestors.push(orderedListItemAst);
		orderedListAst.children.push(orderedListItemAst);
		const matchOrder = /^[0-9]+\.\s+/.exec(children[i])?.[0] || "";
		parseMarkdown(
			{
				...context,
				source: children[i].slice(matchOrder.length),
			},
			ancestors
		);
		ancestors.pop();
	}

	ancestors.pop();

	return orderedListAst;
}

export function parseUnOrderedList(context: ParseContext, ancestors: MdAst[]) {
	const pattern = /^\-\s/;
	if (!pattern.test(context.source)) {
		// 不符合语法规则，当成普通文本处理
		return;
	}
	// Ordered List State
	const unorderedListAst: MdAst = {
		type: "UnorderedList",
		rowType: RowType.Block,
		children: [],
	};
	ancestors.push(unorderedListAst);

	const source = /\-\s+(.[\r\n]?)*/.exec(context.source)?.[0] || "";
	advanceBy(context, source.length);
	const arr = source.replace(/\r/g, "\n").split("\n");
	arr.forEach((item, index) => {
		if (!/^\-\s+/.test(item)) {
			arr[index - 1] += "\n" + item;
			arr[index] = "";
		}
	});
	const children = arr.filter((i) => !!i && !/^[\r\n\s\t]*$/.test(i));
	for (let i = 0; i < children.length; i++) {
		const orderedListItemAst: MdAst = {
			type: "UnorderedListItem",
			rowType: RowType.Block,
			children: [],
		};
		ancestors.push(orderedListItemAst);
		unorderedListAst.children.push(orderedListItemAst);
		const matchOrder = /^\-\s+/.exec(children[i])?.[0] || "";
		parseMarkdown(
			{
				...context,
				source: children[i].slice(matchOrder.length),
			},
			ancestors
		);
		ancestors.pop();
	}

	ancestors.pop();

	return unorderedListAst;
}
