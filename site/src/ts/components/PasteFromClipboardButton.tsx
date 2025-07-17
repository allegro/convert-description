import React from "react";
import { Button } from "react-bootstrap";

interface HtmlSourceSelectorProps {
  onPaste: (html: string) => void;
}

const PasteFromClipboardButton = ({ onPaste }: HtmlSourceSelectorProps) => {
  const handlePasteFromClipboard = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      onPaste(clipboardText);
    } catch (err) {
      alert("Failed to read from clipboard. Please check browser permissions.");
    }
  };

  return (
    <Button variant="primary" onClick={handlePasteFromClipboard}>
      <i className="bi bi-clipboard me-2"></i>
      Paste From Clipboard
    </Button>
  );
};

export default PasteFromClipboardButton;
