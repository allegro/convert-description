import BrowserDOMParser from "../libs/BrowserDOMParser";

function resolveParseToDOM(parseToDOM) {
  if (typeof parseToDOM === "undefined") {
    return resolveParser();
  } else if (typeof parseToDOM !== "function") {
    throw new Error("parseToDOM must be a function");
  }
  return (html, callback) => callback(parseToDOM(html));
}

function resolveParser() {
  if (typeof window == "undefined") {
    throw new Error(
      "For the Node.js environment provide the parseToDOM function",
    );
  } else {
    const parser = new BrowserDOMParser();
    return (html, callback) => {
      try {
        return callback(parser.parseFromString(html));
      } finally {
        parser.cleanup();
      }
    };
  }
}

export default resolveParseToDOM;
