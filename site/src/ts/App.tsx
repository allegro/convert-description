import React from "react";
import { ButtonToolbar, Col, Container, Row, Navbar } from "react-bootstrap";

import ConvertButton from "./components/ConvertButton";
import ConvertedDescriptionPanel from "./components/ConvertedDescriptionPanel";
import HtmlDescriptionPanel from "./components/HtmlDescriptionPanel";
import PasteFromClipboardButton from "./components/PasteFromClipboardButton";
import useDescriptionState from "./hooks/useDescriptionState";

const App = () => {
  const {
    setHtmlDescription,
    convertHtmlDescription,
    getHtmlDescription,
    getConvertedDescription,
    isHtmlDescriptionConverted,
  } = useDescriptionState();

  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand>
            Live demo of @allegro/description-converter
          </Navbar.Brand>
          <a href="https://github.com/allegro/convert-description">
            <i className="bi bi-github fs-2 text-black"></i>
          </a>
        </Container>
      </Navbar>
      <Container fluid>
        <Row>
          <Col>
            <ButtonToolbar className="py-3 column-gap-3">
              <ConvertButton
                disabled={isHtmlDescriptionConverted()}
                onConvert={() => {
                  convertHtmlDescription(null);
                }}
              />
              <PasteFromClipboardButton
                onPaste={(value) => {
                  convertHtmlDescription(value);
                }}
              />
            </ButtonToolbar>
          </Col>
        </Row>
        <Row>
          <Col lg={6} className="mb-md-2">
            <HtmlDescriptionPanel
              value={getHtmlDescription()}
              onChange={(value) => {
                setHtmlDescription(value);
              }}
              onConvert={(text) => {
                convertHtmlDescription(text);
              }}
            />
          </Col>
          <Col lg={6} className="mb-md-2">
            <ConvertedDescriptionPanel value={getConvertedDescription()} />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default App;
