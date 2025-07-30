#!/usr/bin/env node
const { JSDOM } = require("jsdom");

const { convertDescriptionToItems } = require("../dist/index.cjs.js");

const parseToDOM = (html) => new JSDOM(html);

const convertDescription = (inputStream, outputStream) => {
  let inputData = "";

  inputStream.on("data", (chunk) => {
    inputData += chunk;
  });

  inputStream.on("end", () => {
    outputStream.write(
      JSON.stringify(convertDescriptionToItems(inputData, { parseToDOM })),
    );
    outputStream.write("\n");
  });
};

convertDescription(process.stdin, process.stdout);
