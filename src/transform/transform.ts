import { errorHandler } from "../errorHandler/index.js";
import { TransformContext } from "../types";
import { ElementAst, HtmlAst, MdAst } from "../types/ast.d";
import { transformInlineCode, transformCodeBlock } from "./plugins/code.js";
import { transformImage } from "./plugins/image.js";
import { transformLink } from "./plugins/link.js";
import { transformSeparateLine } from "./plugins/separateLine.js";
import { transformDeleteLine } from "./plugins/deleteLine.js";
import {
	transformOrderedList,
	transformOrderedListItem,
} from "./plugins/orderedList.js";
import { transformQuote } from "./plugins/quote.js";
import {
	transformBold,
	transformBoldAndItalic,
	transformItalic,
} from "./plugins/stress.js";
import { transformPlainText, transformTextBlock } from "./plugins/text.js";
import { transformTitle } from "./plugins/title.js";
import {
	transformUnorderedList,
	transformUnorderedListItem,
} from "./plugins/unorderedList.js";

export function transform(context: TransformContext) {
	// const context: TransformContext = createTransformContext(ast);
	const root = context.mdAst;
	return baseTransform(root, context);
}

export function baseTransform(node: MdAst, context: TransformContext) {
	const { transformPlugins, parent } = context;
	for (const key of Object.keys(transformPlugins)) {
		const transformFn = transformPlugins[key];

		transformFn(node, context);
	}
	for (let i = 0; i < node.children.length; i++) {
		const child = node.children[i];

		if (node.type !== "Root") {
			context.parent = parent.childNodes[
				context.childIndex
			] as ElementAst;
		}

		baseTransform(child, {
			...context,
			childIndex: i,
			parentMdAst: node,
		});
		context.parent = parent;
	}
	return context.rootAst;
}

export function createTransformContext(ast: MdAst): TransformContext {
	const rootAst = createRootAst();
	return {
		// MdAst
		mdAst: ast,
		parentMdAst: ast,
		// HtmlAst
		rootAst,
		parent: rootAst,
		childIndex: 0,
		transformPlugins: {
			transformDeleteLine,
			transformSeparateLine,
			transformLink,
			transformImage,
			transformUnorderedList,
			transformUnorderedListItem,
			transformOrderedList,
			transformOrderedListItem,
			transformQuote,
			transformBold,
			transformItalic,
			transformBoldAndItalic,
			transformInlineCode,
			transformCodeBlock,
			transformTextBlock,
			transformTitle,
			transformPlainText,
		},
		errorHandler: errorHandler(),
	};
}

function createRootAst(): ElementAst {
	return {
		nodeName: "div",
		tagName: "div",
		childNodes: [],
		attrs: [],
	};
}
