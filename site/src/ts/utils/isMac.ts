const isMac = () => {
  return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent);
};

export default isMac;
