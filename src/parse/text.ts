import { ParseContext } from "./../types/index.d";
import { MdAst, MdAstType, MdTextAst, RowType } from "../types/ast";
import { advanceBy, isEnd } from "./parse.js";

export function parseTitle(context: ParseContext, ancestors: MdAst[]) {
  let titleLevel = 0;
  let value = "";
  while (context.source[0] === "#") {
    // Title Level State
    titleLevel++;
    advanceBy(context, 1);
  }
  if (context.source[0] === " ") {
    advanceBy(context, 1);
    value = parseTitleValue(context);
  }

  return {
    type: ("Title" + titleLevel) as MdAstType,
    rowType: RowType.Block,
    value: value,
    children: [],
  };
}

function parseTitleValue(context: ParseContext): string {
  // Title Value State
  // 标题后面所有字符都当成普通字符处理
  let pattern = /[\r\n\f]/;
  let value = "";
  while (!pattern.test(context.source[0])) {
    value += context.source[0];
    advanceBy(context, 1);
  }

  return value;
}

export function parseText(context: ParseContext, ancestors: MdAst[]): MdAst {
  // Text State
  const textAst: MdTextAst = {
    type: "Text",
    rowType: RowType.Block,
    children: [],
  };

  parseTextChild(context, textAst);

  return textAst;
}

async function parseTextChild(context: ParseContext, parent: MdTextAst) {
  const escapeLoop = context.errorHandler.escapeLoop();

  while (!/[\r\n\f]/.test(context.source[0]) && !isEnd(context)) {
    if (/^([*]{1,3})([^*\r\n\f]+)([*]{1,3})/.test(context.source)) {
      parseStressText(context, parent);
    } else if (/^[\`]([^*\r\n\f]+)[\`]/.test(context.source)) {
      parseInlineCode(context, parent);
    } else if (/^\[.*\]\(.+\)/.test(context.source)) {
      parseLink(context, parent);
    } else if (/^\~{2}(.+)\~{2}/.test(context.source)) {
      parseDeleteLine(context, parent);
    } else {
      parsePlainText(context, parent);
    }

    try {
      await escapeLoop.compare(context.source);
    } catch (reason) {
      context.errorHandler.push(
        new Error(reason as string),
        JSON.parse(JSON.stringify(context))
      );
      break;
    }
  }
}

// 解析 *
function parseStressText(context: ParseContext, parent: MdTextAst) {
  // Stress Text State
  const pattern = /^([*]{1,3})([^*\r\n\f]+)([*]{1,3})/;
  const matchText = context.source.match(pattern);
  // **、***等情况，此时不当作强调语句处理
  if (!matchText) {
    return parsePlainText(context, parent);
  }
  let [matchSource, leftStar, value, rightStar] = matchText;
  if (leftStar.length > rightStar.length) {
    const len = Math.abs(leftStar.length - rightStar.length);
    parsePlainText(context, parent, len);
    leftStar = leftStar.slice(len);
  } else if (leftStar.length < rightStar.length) {
    rightStar = rightStar.slice(0, leftStar.length);
  }

  let type: MdAstType = "Bold";
  switch (leftStar.length) {
    case 1:
      type = "Italic";
      break;
    case 2:
      type = "Bold";
      break;
    case 3:
      type = "BoldAndItalic";
      break;
  }

  const stressAst: MdAst = {
    type,
    rowType: RowType.Inline,
    value,
    children: [],
  };
  parent.children.push(stressAst);
  advanceBy(context, leftStar.length + rightStar.length + value.length);
  return stressAst;
}
function parseInlineCode(context: ParseContext, parent: MdTextAst) {
  // Inline Code State
  const pattern = /^[\`]([^*\r\n\f]+)[\`]/;
  const matchText = context.source.match(pattern);
  if (!matchText) {
    throw new Error("解析code异常");
  }
  const codeAst: MdAst = {
    rowType: RowType.Inline,
    type: "Code",
    children: [],
    value: (matchText && matchText[1]) || "",
  };
  parent.children.push(codeAst);
  advanceBy(context, matchText[0].length);
  return codeAst;
}
export function parsePlainText(
  context: ParseContext,
  parent: MdTextAst,
  length?: number
) {
  // Plain Text State
  if (isEnd(context)) {
    return;
  }

  const pattern = /^[^\r\n\f`*~\[\!]+/;
  let matchText =
    length == null
      ? context.source.match(pattern)?.[0]
      : context.source.slice(0, length);

  if (!matchText) {
    matchText = context.source.match(/.*[\n\r]/)?.[0];
  }

  const plainTextAst: MdAst = {
    rowType: RowType.Inline,
    type: "Text",
    value: matchText,
    children: [],
  };
  parent.children.push(plainTextAst);
  advanceBy(context, matchText?.length || 0);
  return plainTextAst;
}

export function parseLink(context: ParseContext, parent: MdAst) {
  // Link State
  const pattern = /^\[(.*)\]\((.+)\)/;
  const [matchText, name, url] = pattern.exec(context.source) || [];
  advanceBy(context, matchText?.length || 0);
  const linkAst: MdAst = {
    type: "Link",
    rowType: RowType.Inline,
    children: [],
    meta: {
      name,
      url,
    },
  };
  parent.children.push(linkAst);
}

export function parseDeleteLine(context: ParseContext, parent: MdAst) {
  const pattern = /^\~{2}(.+)\~{2}/;
  const [matchText, text] = pattern.exec(context.source) || [];

  if (!matchText) {
    throw new Error("解析deleteLine异常");
  }

  const deleteLineAst: MdAst = {
    type: "DeleteLine",
    rowType: RowType.Inline,
    children: [],
  };

  advanceBy(context, 2);
  parsePlainText(context, deleteLineAst, text.length);
  advanceBy(context, 2);

  parent.children.push(deleteLineAst);
}
