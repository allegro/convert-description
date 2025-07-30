import registerDOM from "jsdom-global";

export default (callback) => {
  if (typeof callback !== "undefined") {
    const unregisterDOM = registerDOM();
    try {
      return callback(registerDOM);
    } finally {
      unregisterDOM();
    }
  } else {
    return registerDOM();
  }
};
