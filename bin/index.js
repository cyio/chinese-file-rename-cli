#! /usr/bin/env node

"use strict"
require("shelljs/global");
const shell = require("shelljs");
const fs = require('fs');
const path = require('path');

// helper
const hasChinese = text => /.*[\u4e00-\u9fa5]+.*$/.test(text)
const translate = text => exec(`trans -b -t en ${text}`).stdout

const filepaths = process.argv.slice(2)
for(let i = 0; i < filepaths.length; i++) {
  const filepath = filepaths[i]
  if (!hasChinese(filepath)) continue
  const filedir = path.dirname(filepath)

  const filename = path.basename(filepath)
    .replace('(', '')
    .replace(')', '')
  const newFilename = translate(filename)
    .replace('\n', '') // 翻译完后有多余字符
    .replace(/\s/g, '-') // 空格 => -
    .replace(/\-+/g, '-') // --- => -
    .toLowerCase()
  const newFilepath = path.join(filedir, newFilename)
  mv(filepath, newFilepath)
  console.log({ filepath }, { newFilepath })
}
