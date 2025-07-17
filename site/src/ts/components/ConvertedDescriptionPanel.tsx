import React, { useMemo } from "react";
import { Tab, Tabs } from "react-bootstrap";

import Description from "../types/Description";
import TabCard from "./TabCard";
import CodeField from "./CodeField";
import DescriptionPreview from "./DescriptionPreview";

interface ConvertedDescriptionPanelProps {
  value: Description | null;
}

const ConvertedDescriptionPanel = ({
  value,
}: ConvertedDescriptionPanelProps) => {
  const stringifiedValue = useMemo(
    () => (value !== null ? JSON.stringify(value, null, 2) : ""),
    [value],
  );

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
            language="json"
            placeholder="The output of convertDescriptionToItems will be wrapped into two-column sections and displayed here"
            readOnly
            value={stringifiedValue}
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
          <DescriptionPreview value={value} />
        </TabCard>
      </Tab>
    </Tabs>
  );
};

export default ConvertedDescriptionPanel;
