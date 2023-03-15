export const template =
`# 欢迎使用 Markdown在线编辑器

**Markdown是一种轻量级的「标记语言」**

Markdown是一种可以使用普通文本编辑器编写的标记语言，通过简单的标记语法，它可以使普通文本内容具有一定的格式。它允许人们使用易读易写的纯文本格式编写文档，然后转换成格式丰富的HTML页面，Markdown文件的后缀名便是\`.md\`

![](https://s1.ax1x.com/2023/03/15/pp1O1tP.jpg)

## 功能列表演示

# 标题H1

## 标题H2

### 标题H3

#### 标题H4

##### 标题H5

###### 标题H5

### 字符效果、横线和引用等

### 横线

---

## 文字效果

~~删除线~~ 

*斜体字*     

**粗体** 

***粗斜体*** 

## 引用

> 引用文本 Blockquotes

引用的行内混合 Blockquotes

> 引用：引用内可以写其他类型的文本，例如：[普通链接](https://blog.yujin123.cn)、*斜体*、~~删除线~~ **等**。


> **注意**:
> 多行引用
> 多行引用

### 锚点与链接 Links
[普通链接](https://blog.yujin123.cn)
[普通链接带标题](https://blog.yujin123.cn "普通链接带标题")
直接链接：<https://www.wdphp.com>
[锚点链接][anchor-id]
[anchor-id]: https://blog.yujin123.cn
[mailto:test.test@gmail.com](mailto:test.test@gmail.com)
GFM a-tail link @pandao
邮箱地址自动链接 test.test@gmail.com  www@vip.qq.com

## 代码

### 多语言代码高亮 Codes

#### 行内代码 Inline code

执行命令：\`npm install markdown-to\`

#### JS代码
\`\`\`javascript
function test() {
\tconsole.log("Hello world!");
}
\`\`\`

#### HTML 代码 HTML codes
\`\`\`html
<!DOCTYPE html>
<html>
    <head>
        <mate charest="utf-8" />
        <meta name="keywords" content="Editor.md, Markdown, Editor" />
        <title>Hello world!</title>
        <style type="text/css">
            body{font-size:14px;color:#444;font-family: "Microsoft Yahei", Tahoma, "Hiragino Sans GB", Arial;background:#fff;}
            ul{list-style: none;}
            img{border:none;vertical-align: middle;}
        </style>
    </head>
    <body>
        <h1 class="text-xxl">Hello world!</h1>
        <p class="text-green">Plain text</p>
    </body>
</html>
\`\`\`

### 图片 Images

图片

![](https://s1.ax1x.com/2023/03/15/pp1O1tP.jpg)

图片加说明

![Markdown](https://s1.ax1x.com/2023/03/15/pp1O1tP.jpg)

---

### 列表 Lists

#### 无序列表（减号）Unordered Lists (-)

- 列表一
- 列表二
- 列表三

#### 无序列表（嵌套）Unordered Lists (-)
- 列表一
- 列表二
- - 列表二-1
- - 列表二-2
- - 列表二-3
- 列表三
- - 列表一
- - 列表二
- - 列表三

#### 有序列表 Ordered Lists (-)

1. 第一行
2. 第二行
3. 第三行

#### 有序列表（嵌套） Ordered Lists (-)

1. 列表1
1.    1. 列表1.1
2. 列表2
2.    1. 列表2.1
3. 列表3
3.    1. 列表

### END
`
