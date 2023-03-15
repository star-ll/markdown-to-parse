// import hljs from "highlight.js";

import 'highlight.js/styles/atom-one-dark-reasonable.css'
import hljs from 'highlight.js'

import { template } from './templateText.js'
import markdownParse from '../dist/index.js'

import '../styles/index.css'

const userInputEl = document.querySelector('#userInput')
const parseResultEl = document.querySelector('#parseResult')

async function handle (value) {
  const ast = await markdownParse.parse(value)
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

async function onChange (e) {
  if (e.key === 'Enter') {
    handle(e.currentTarget.value)
  }
}
userInputEl.addEventListener('keyup', onChange)

userInputEl.textContent = template
handle(userInputEl.textContent)
