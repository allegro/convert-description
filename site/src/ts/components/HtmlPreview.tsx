import React, { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";

interface HtmlPreviewProps {
  value: string;
}

const HtmlPreview = ({ value }: HtmlPreviewProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const [previousValue, setPreviousValue] = useState("");

  useEffect(() => {
    if (previousValue !== value) {
      setIsLoading(true);
      setPreviousValue(value);
    }
  }, [value]);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      const listener = () => {
        setIsLoading(false);
      };
      iframe.addEventListener("load", listener);
      return () => {
        iframe.removeEventListener("load", listener);
      };
    }
  }, []);

  return (
    <div className="position-relative">
      {isLoading && (
        <Spinner
          animation="border"
          role="status"
          className="position-absolute top-50 start-50"
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      )}
      <iframe
        ref={iframeRef}
        className="description-container"
        srcDoc={`<style>html,body{overflow-x:hidden;} img {max-width: 100%;}</style>${value}`}
        sandbox="allow-scripts"
      />
    </div>
  );
};

export default HtmlPreview;
