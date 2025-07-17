import React from "react";
import { Tab, Tabs } from "react-bootstrap";

import getModifierKey from "../utils/getModifierKey";
import TabCard from "./TabCard";
import HtmlPreview from "./HtmlPreview";
import CodeField from "./CodeField";

interface HtmlDescriptionPanelProps {
  value: string;
  onChange: (value: string) => void;
  onConvert: (text: string) => void;
}

const HtmlDescriptionPanel = ({
  value,
  onChange,
  onConvert,
}: HtmlDescriptionPanelProps) => {
  const handlePaste = (text: string) => {
    if (value === "") {
      onConvert(text);
    }
  };
  return (
    <Tabs defaultActiveKey="source">
      <Tab
        eventKey="source"
        title={
          <>
            <i className="bi bi-code me-1"></i> Source
          </>
        }
      >
        <TabCard>
          <CodeField
            language="html"
            placeholder={`Paste from clipboard for automatic conversion or press ${getModifierKey()}+Enter after typing`}
            value={value}
            onChange={onChange}
            onPaste={handlePaste}
          />
        </TabCard>
      </Tab>
      <Tab
        eventKey="preview"
        title={
          <>
            <i className="bi bi-eye me-1"></i> Preview
          </>
        }
      >
        <TabCard>
          <HtmlPreview value={value} />
        </TabCard>
      </Tab>
    </Tabs>
  );
};

export default HtmlDescriptionPanel;
