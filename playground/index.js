// import hljs from "highlight.js";

import 'highlight.js/styles/atom-one-dark-reasonable.css'

import markdownParse from '../dist/index.js'
import hljs from 'highlight.js'

const userInputEl = document.querySelector('#userInput')
const parseResultEl = document.querySelector('#parseResult')
async function onChange (e) {
  if (e.key === 'Enter') {
    const ast = await markdownParse.parse(e.currentTarget.value)
    console.log('ast', ast)

    const htmlAst = markdownParse.transform(ast, {
      highlight: (code, lang) => {
        if (hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value
        }
        return code
      }
    })
    console.log('htmlAst', htmlAst)

    const html = markdownParse.generate(htmlAst).value
    console.log('html', html)

    parseResultEl.innerHTML = html
  }
}
userInputEl.addEventListener('keyup', onChange)
