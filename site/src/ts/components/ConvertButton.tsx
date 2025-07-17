import React, { useEffect } from "react";
import { Button } from "react-bootstrap";

import getModifierKey from "../utils/getModifierKey";

interface ConvertButtonProps {
  className?: string;
  disabled?: boolean;
  onConvert: () => void;
}

const ConvertButton = ({
  className,
  disabled,
  onConvert,
}: ConvertButtonProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        onConvert();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onConvert]);

  return (
    <Button
      variant="primary"
      className={className}
      disabled={disabled}
      onClick={onConvert}
    >
      <i className="bi bi-arrow-repeat me-2"></i>
      {`Convert (${getModifierKey()}+Enter)`}
    </Button>
  );
};

export default ConvertButton;
