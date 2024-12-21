import isMac from "./isMac";

const getModifierKey = () => (isMac() ? "⌘" : "Ctrl");

export default getModifierKey;
