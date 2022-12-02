import { GenerateContext } from "../types";
import { HtmlAst } from "../types/ast";
import { handleAttrs } from "./attrs.js";

export function generate(ast: HtmlAst) {
	const context: GenerateContext = createGenerateContext(ast);
    baseGenerate(context);
    return context.source;
}

export function createGenerateContext(ast: HtmlAst): GenerateContext {
	return {
		root: ast,
		parent: ast,
		currentNode: ast,
		source: "",
	};
}

export function baseGenerate(context: GenerateContext) {
	const { parent, currentNode } = context;
	if ("value" in currentNode && currentNode.nodeName === "#text") {
		// text
		context.source += `${currentNode.value}`;
    } else {
        // element
		context.source += `<${currentNode.tagName}${handleAttrs(currentNode.attrs)}>`;
		for (let i = 0; i < currentNode.childNodes.length; i++) {
			const child = currentNode.childNodes[i];
            context.parent = currentNode;
            context.currentNode = child
            baseGenerate(context)
            context.parent = parent;
            context.currentNode = currentNode
		}
		context.source += `</${currentNode.tagName}>`;
	}
}
