import {  MdAst,MdAstType, RowType, MdTextAst } from "./../types/ast.d";
export type ParseContext = {
	source: string;
	originalSource: string;
};

export function createParseContext(source: string): ParseContext {
	const context = {
		source,
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
	const pattern = /[ \t\r\n\f]/;

	while (!isEnd(context)) {
		let node: MdAst | undefined;
		const parent = ancestors[ancestors.length - 1];

		if (pattern.test(context.source[0])) {
			// if (/[\r\n\f]/.test(context.source[0])) {

			// }

			advanceBy(context, 1);
			continue;
		} else if (context.source[0] === "#") {
			node = parseTitle(context, ancestors);
		}

		if (!node) {
			node = parseText(context, ancestors);
		}

		// if (parent && typeof node !== "undefined") {
		// 	parent.children.push(node);
		// }
		// if (node) {
		// 	ancestors.pop();
		// }
		if (node) {
			parent.children.push(node);
		}
		// advanceBy(context, 1)
	}
}

export function parseTitle(context: ParseContext, ancestors: MdAst[]) {
	let titleLevel = 0;
	let value = "";
	while (context.source[0] === "#") {
		titleLevel++;
		advanceBy(context, 1);
	}
	if (context.source[0] === " ") {
		advanceBy(context, 1);
		value = parseTitleValue(context);
	}

	return {
		type: ("Title" + titleLevel) as MdAstType,
		rowType: RowType.Block,
		value: value,
		children: [],
	};
}

function parseTitleValue(context: ParseContext): string {
	// 标题后面所有字符都当成普通字符处理
	let pattern = /[\r\n\f]/;
	let value = "";
	while (!pattern.test(context.source[0])) {
		value += context.source[0];
		advanceBy(context, 1);
	}

	return value;
}

function advanceBy(context: ParseContext, length: number) {
	context.source = context.source.slice(length);
}

function isEnd(context: ParseContext) {
	return context.source.length === 0;
}

function createRootAst(): MdAst {
	return {
		type: "Root",
		rowType: RowType.Root,
		children: [],
	};
}

function parseText(context: ParseContext, ancestors: MdAst[]): MdAst {
	const textAst: MdTextAst = {
		type: "Text",
		rowType: RowType.Block,
		children: [],
	};

	parseTextChild(context, textAst);

	// advanceBy(context, (text && text[0].length) || 0);
	return textAst;
}

function parseTextChild(context: ParseContext, parent: MdTextAst) {
	while (!/[\r\n\f]/.test(context.source[0]) && !isEnd(context)) {
		if (context.source[0] === "*") {
			parseStressText(context, parent);
		} else if (context.source[0] === "`") {
			parseInlineCode(context, parent);
		} else {
			parsePlainText(context, parent);
		}
	}
}

// 解析 *
function parseStressText(context: ParseContext, parent: MdTextAst) {
	const pattern = /^([*]{1,3})([^*\r\n\f]+)([*]{1,3})/;
	const matchText = context.source.match(pattern);
	// **、***等情况，此时不当作强调语句处理
	if (!matchText) {
		return parsePlainText(context, parent);
	}
	let [matchSource, leftStar, value, rightStar] = matchText;
	if (leftStar.length > rightStar.length) {
		const len = Math.abs(leftStar.length - rightStar.length);
		parsePlainText(context, parent, len);
		leftStar = leftStar.slice(len);
	} else if (leftStar.length < rightStar.length) {
		rightStar = rightStar.slice(0, leftStar.length);
	}

	let type: MdAstType = "Bold";
	switch (leftStar.length) {
		case 1:
			type = "Italic";
			break;
		case 2:
			type = "Bold";
			break;
		case 3:
			type = "BoldAndItalic";
			break;
	}

	const stressAst: MdAst = {
		type,
		rowType: RowType.Inline,
		value,
		children: [],
	};
	parent.children.push(stressAst);
	advanceBy(context, leftStar.length + rightStar.length + value.length);
	return stressAst;
}
function parseInlineCode(context: ParseContext, parent: MdTextAst) {
	const pattern = /^[\`][^*\r\n\f]+[\`]/;
	const matchText = context.source.match(pattern);
	if (!matchText) {
		throw new Error("matchText异常");
	}
	const codeAst: MdAst = {
		rowType: RowType.Inline,
		type: "Code",
		children: [],
		value: (matchText && matchText[0]) || "",
	};
	parent.children.push(codeAst);
	advanceBy(context, matchText[0].length);
	return codeAst;
}
function parsePlainText(
	context: ParseContext,
	parent: MdTextAst,
	length?: number
) {
	if (isEnd(context)) {
		return;
	}

	const pattern = /^[^\r\n\f`*]+/;
	const matchText =
		length == null
			? context.source.match(pattern)
			: context.source.slice(0, length);
	if (!matchText) {
		throw new Error("matchText异常");
	}
	const plainTextAst: MdAst = {
		rowType: RowType.Inline,
		type: "Text",
		value: (matchText && matchText[0]) || "",
		children: [],
	};
	parent.children.push(plainTextAst);
	advanceBy(context, matchText[0].length);
	return plainTextAst;
}
