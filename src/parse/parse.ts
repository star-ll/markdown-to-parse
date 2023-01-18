import { ParseContext } from "./../types/index.d";
import { MdAst, RowType } from "./../types/ast.d";
import { parseImage } from "./img.js";
import { parseText, parseTitle } from "./text.js";
import { errorHandler } from "../errorHandler/index.js";
import { parseCodeBlock } from "./codeBlock.js";

export function createParseContext(source: string): ParseContext {
	const context = {
		source: source.replace(/\r\n/g, "\n"),
		originalSource: source.replace(/\r\n/g, "\n"),
		errorHandler: errorHandler(),
		loc: {
			startOffset: 0,
			endOffset: source.length - 1,
		},
	};
	return context;
}

export async function parse(context: ParseContext) {
	const root = createRootAst();
	try {
		await parseMarkdown(context, [root]);
		return root;
	} catch (err) {
		if (typeof err === "string") {
			err = new Error(err);
		}
		
		context.errorHandler.push(
			err as Error,
			JSON.parse(JSON.stringify(context))
		);
	}
	context.errorHandler.emitError("解析阶段出现异常");
}

export async function parseMarkdown(context: ParseContext, ancestors: MdAst[]) {
	const pattern = /^[\r\n\f]/;

	const escapeLoop = context.errorHandler.escapeLoop();

	while (!isEnd(context)) {
		let node: MdAst | undefined;
		const parent = ancestors[ancestors.length - 1];

		if (/^\n\n/.test(context.source)) {
			advanceBy(context, 2);
			loc(context, context.originalSource.length - context.source.length);
			continue;
		}

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
			if (/^\-{3}\n/.test(context.source)) {
				node = parseSeparateLine(context, ancestors);
			} else {
				node = parseUnOrderedList(context, ancestors);
			}
		} else if (/^\`{3}/.test(context.source)) {
			node = parseCodeBlock(context, ancestors);
		} else if (context.source[0] === "!") {
			if (/^\!\[/.test(context.source)) {
				node = parseImage(context, ancestors);
			}
		}

		if (!node) {
			node = parseText(context, ancestors);
		}

		if (node) {
			parent.children.push(node);
		}

		// 避免出现死循环
		await escapeLoop.compare(context.source);
	}
}

export function advanceBy(context: ParseContext, length: number) {
	context.source = context.source.slice(length);
}

function loc(context: ParseContext, startIndex: number, endIndex?: number) {
	// context.loc.startOffset += context.source.length;
	// context.loc.endOffset =
	// 	endLength != null
	// 		? context.loc.startOffset + endLength
	// 		: context.loc.startOffset +
	// 		  (context.source.match(/\n\n/)?.index || context.source.length);

	context.loc.startOffset = startIndex;
	context.loc.endOffset =
		endIndex ||
		(context.source.indexOf("\n\n") > -1
			? startIndex + context.source.indexOf("\n\n")
			: context.originalSource.length - 1);
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

	const len = context.originalSource.length - context.source.length;
	loc(context, len, len + source.length);
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

	const len = context.originalSource.length - context.source.length;
	loc(context, len, len + source.length);
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

	const len = context.originalSource.length - context.source.length;
	loc(context, len, len + source.length);
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

function parseSeparateLine(context: ParseContext, ancestors: MdAst[]) {
	const pattern = /^\-{3}\n/;

	const matchText = context.source.match(pattern);
	if (!matchText) {
		return;
	}

	advanceBy(context, matchText[0].length);

	const separateLineAst: MdAst = {
		type: "SeparateLine",
		rowType: RowType.Block,
		children: [],
	};

	return separateLineAst;
}
