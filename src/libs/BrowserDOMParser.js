class BrowserDOMParser {
  cleanup() {
    this.frame.parentNode.removeChild(this.frame);
  }

  parseFromString(string) {
    const frame = document.createElement("iframe");
    frame.style.display = "none";
    document.body.appendChild(frame);

    const { body } = frame.contentWindow.document;
    body.innerHTML = string;

    this.frame = frame;

    return { window: frame.contentWindow };
  }
}

export default BrowserDOMParser;
