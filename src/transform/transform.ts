import { TransformContext } from "../types";
import { ElementAst, HtmlAst, MdAst } from "../types/ast.d";
import { transformInlineCode } from "./plugins/code.js";
import { transformQuote } from "./plugins/quote.js";
import { transformBold, transformBoldAndItalic, transformItalic } from "./plugins/stress.js";
import { transformPlainText, transformTextBlock } from "./plugins/text.js";
import { transformTitle } from "./plugins/title.js";

export function transform(ast: MdAst) {
	const context = createTransformContext(ast);
	const root = context.mdAst;
	return baseTransform(root, context);
}

export function baseTransform(node: MdAst, context: TransformContext) {
	const { transformPlugins, parent } = context;
	for (let i = 0; i < transformPlugins.length; i++) {
		const transformFn = transformPlugins[i];

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
			parentMdAst: node
		});
		context.parent = parent;
	}
	return context.rootAst;
}

function createTransformContext(ast: MdAst): TransformContext {
	const rootAst = createRootAst();
	return {
		// MdAst
		mdAst: ast,
		parentMdAst: ast,
		// HtmlAst
		rootAst,
		parent: rootAst,
		childIndex: 0,
		transformPlugins: [
			transformQuote,
			transformBold,
			transformItalic,
			transformBoldAndItalic,
			transformInlineCode,
			transformTextBlock,
			transformTitle,
			transformPlainText,
		],
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
