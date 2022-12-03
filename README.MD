# markdown_parse

## Introduce

一款支持将markdown解析成AST、并生成HTML文件的工具。

工作原理是利用**有限状态自动机**解析markdown语法为Markdown AST，通过转换将Markdown AST转换成HTML AST，之后渲染成HTML文件。

## feature

- [x] 斜体、粗体、斜体and粗体
- [x] 标题
- [x] 普通文本
- [x] 引用
- [x] 有序列表与无序列表
- [ ] 图片和链接
- [ ] 删除线和分割线
- [ ] 任务列表
- [ ] 转义语句
- [ ] 表格
- [ ] html语句
- [ ] toc目录  
- [ ] XSS防护