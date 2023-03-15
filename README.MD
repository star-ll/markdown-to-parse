# markdown_parse

## Introduce

**一款支持将 markdown 解析成 AST、并生成 HTML 文件的工具。**

工作原理是利用**有限状态自动机**解析(*parse*)markdown 语法为 Markdown AST，通过转换(*transform*)将 Markdown AST 转换成 HTML AST，之后渲染(*generate*)成 HTML 文件。

- 🎉 全面拥抱 Typescript。
- ✨ 方便使用和扩展。
- 👏 完善的插件机制。
- 🎈 支持代码高亮。
- 🔔 提供异常处理机制。

## Demo

```shell
npm run playground
```

## Contribution

clone 仓库，然后执行以下语句

```shell
npm i // 安装依赖
npm run build:dev  // 以watch模式启动
npm run playground // 打开playground进行测试
```

## HighLight

代码块高亮功能借助[highlight.js](https://highlightjs.org/)实现，你需要引入`highlight.js`到你的项目中。

```typescript
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css"; // 在highlight.js/styles/下选择喜欢的样式

const ast = await markdownParse.parse(e.currentTarget.value);
const htmlAst = markdownParse.transform(ast, {
  highlight: (code, language) => {
    if (hljs.getLanguage(language)) {
      return hljs.highlight(code, { language }).value;
    }
    return code;
  },
});
const html = markdownParse.generate(htmlAst).value;
```

## feature

- [x] 斜体、粗体、斜体 and 粗体
- [x] 标题
- [x] 普通文本
- [x] 引用
- [x] 有序列表与无序列表
- [x] 代码块和代码高亮
- [x] 图片和链接
- [x] 删除线和分割线
- [ ] 任务列表
- [ ] 转义语句
- [x] 异常处理机制
- [x] playground
- [ ] 表格
- [ ] toc 目录
- [ ] html 语句
- [ ] XSS 防护
- [ ] 单元测试

## Skills

Typescript、ES6、Webpack、Babel...

你可能需要了解的一些基本概念：

- AST
- 正则表达式
- 有限状态自动机
