import {
	TransformContext,
	ParseContext,
	TransformPluginFn,
	GenerateContext,
} from "./src/types/index.d";
import { HtmlAst, MdAst } from "./src/types/ast.d";
import { createGenerateContext, generate } from "./src/generate/generate.js";
import { createParseContext, parse } from "./src/parse/parse.js";
import {
	createTransformContext,
	transform,
} from "./src/transform/transform.js";

export class MarkdownParse {
	parseContext: ParseContext | undefined;
	transformContext: TransformContext | undefined;
	generateContext: GenerateContext | undefined;
	customTransformPlugin: { [name: string]: TransformPluginFn } | undefined;

	parse(source: string) {
		this.parseContext = createParseContext(source);
		return parse(this.parseContext);
	}
	transform(ast: MdAst) {
		this.transformContext = createTransformContext(ast);
		this.mergeTransformContext();
		return transform(this.transformContext);
	}
	generate(ast: HtmlAst) {
		this.generateContext = createGenerateContext(ast);
		const { source: value, root: rootNode } = generate(
			this.generateContext
		);

		return {
			rootNode,
			value,
		};
	}

	setTransformPlugin(name: string, callback: TransformPluginFn) {
		if (!this.customTransformPlugin) {
			this.customTransformPlugin = {};
		}
		this.customTransformPlugin[name] = callback;
	}
	private mergeTransformContext() {
		if (!this.transformContext) {
			return;
		}
		if (this.customTransformPlugin) {
			const plugins = this.transformContext?.transformPlugins || {};
			this.transformContext.transformPlugins = {
				...plugins,
				...this.customTransformPlugin,
			};
		}
	}
}

const markdownParse = new MarkdownParse();
export default markdownParse;
