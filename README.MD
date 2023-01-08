# markdown_parse

## Introduce

一款支持将markdown解析成AST、并生成HTML文件的工具。

工作原理是利用**有限状态自动机**解析(parse)markdown语法为Markdown AST，通过转换(transform)将Markdown AST转换成HTML AST，之后渲染(generate)成HTML文件。

## HighLight

代码块高亮功能借助[highlight.js](https://highlightjs.org/)实现，你需要引入`highlight.js`到你的项目中。

```typescript
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css' // 在highlight.js/styles/下选择喜欢的样式

const ast = await markdownParse.parse(e.currentTarget.value)
const htmlAst = markdownParse.transform(ast, {
    highlight: (code, language) => {
        if (hljs.getLanguage(language)) {
            return hljs.highlight(code, { language }).value
        }
        return code
   }
})
const html = markdownParse.generate(htmlAst).value
```

## feature

- [x] 斜体、粗体、斜体and粗体
- [x] 标题
- [x] 普通文本
- [x] 引用
- [x] 有序列表与无序列表
- [x] 代码块和代码高亮
- [ ] 图片和链接
- [ ] 删除线和分割线
- [ ] 任务列表
- [ ] 转义语句
- [ ] 异常处理机制
- [ ] 表格
- [ ] html语句
- [ ] toc目录  
- [ ] XSS防护