import React from "react";
import { Col, Row } from "react-bootstrap";

import Description, { ItemType } from "../types/Description";

interface DescriptionPreviewProps {
  value: Description;
}

const DescriptionPreview = ({ value }: DescriptionPreviewProps) => (
  <div className="description-container">
    {value && (
      <div className="description">
        {value.sections.map((section, sectionIndex) => (
          <Row key={sectionIndex} className="g-0 section">
            {section.items.map((item, itemIndex) => (
              <Col key={itemIndex}>
                {item.type === ItemType.TEXT ? (
                  <div
                    className="item text-item"
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  ></div>
                ) : (
                  <div className="item image-item">
                    <img src={item.url} alt="image" />
                  </div>
                )}
              </Col>
            ))}
          </Row>
        ))}
      </div>
    )}
  </div>
);

export default DescriptionPreview;
