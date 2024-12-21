import { Action, createActions, handleActions } from "redux-actions";
import React, { useReducer } from "react";
import { ButtonToolbar, Col, Container, Row } from "react-bootstrap";
import ConvertButton from "./components/ConvertButton";

import ConvertedDescriptionPanel from "./components/ConvertedDescriptionPanel";
import HtmlDescriptionPanel from "./components/HtmlDescriptionPanel";
import PasteFromClipboardButton from "./components/PasteFromClipboardButton";
import Description from "./types/Description";
import convert from "./utils/convert";

interface State {
  htmlDescription: string;
  htmlDescriptionToConvert: string;
  convertedDescription: Description | null;
}

const defaultState: State = {
  htmlDescription: "",
  htmlDescriptionToConvert: "",
  convertedDescription: null,
};

const { setHtmlDescription, convertHtmlDescription } = createActions({
  SET_HTML_DESCRIPTION: (htmlDescription: string) => htmlDescription,
  CONVERT_HTML_DESCRIPTION: (htmlDescription: string | null) => htmlDescription,
});

const reducer = handleActions(
  {
    [setHtmlDescription.toString()]: (
      state: State,
      { payload: htmlDescription }: Action<string>,
    ) => ({
      ...state,
      htmlDescription,
    }),
    [convertHtmlDescription.toString()]: (
      state: State,
      { payload: htmlDescription }: Action<string | null>,
    ) => {
      const html = htmlDescription || state.htmlDescription;
      if (html === state.htmlDescriptionToConvert) {
        return state;
      }
      return {
        ...state,
        htmlDescription: html,
        htmlDescriptionToConvert: html,
        convertedDescription: convert(html),
      };
    },
  },
  defaultState,
);

const App = () => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  return (
    <Container fluid>
      <Row>
        <Col>
          <ButtonToolbar className="py-3 column-gap-3">
            <ConvertButton
              disabled={
                state.htmlDescription === "" ||
                state.htmlDescription === state.htmlDescriptionToConvert
              }
              onConvert={() => {
                dispatch(convertHtmlDescription(null));
              }}
            />
            <PasteFromClipboardButton
              onPaste={(value) => {
                dispatch(convertHtmlDescription(value));
              }}
            />
          </ButtonToolbar>
        </Col>
      </Row>
      <Row>
        <Col lg={6} className="mb-md-2">
          <HtmlDescriptionPanel
            value={state.htmlDescription}
            onChange={(value) => {
              dispatch(setHtmlDescription(value));
            }}
            onConvert={(text) => {
              dispatch(convertHtmlDescription(text));
            }}
          />
        </Col>
        <Col lg={6} className="mb-md-2">
          <ConvertedDescriptionPanel value={state.convertedDescription} />
        </Col>
      </Row>
    </Container>
  );
};

export default App;
