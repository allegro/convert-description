const BLANK_REG_EXP = /^\s*$/;

function isBlankText(text) {
  return BLANK_REG_EXP.test(text);
}

export default isBlankText;
