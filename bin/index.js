#!/usr/bin/env node
const { JSDOM } = require("jsdom");

const { convertDescriptionToItems } = require("../dist/umd.js");

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
  });
};

convertDescription(process.stdin, process.stdout);
