import { useMemo, useReducer } from "react";
import { Action, createActions, handleActions } from "redux-actions";

import Description from "../types/Description";
import convertDescription from "../utils/convertDescription";

interface State {
  htmlDescription: string;
  lastConvertedHtmlDescription: string;
  convertedDescription: Description | null;
}

const defaultState: State = {
  htmlDescription: "",
  lastConvertedHtmlDescription: "",
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
      if (html === state.lastConvertedHtmlDescription) {
        return state;
      }
      return {
        ...state,
        htmlDescription: html,
        lastConvertedHtmlDescription: html,
        convertedDescription: html ? convertDescription(html) : null,
      };
    },
  },
  defaultState,
);

const useDescriptionState = () => {
  const [state, dispatch] = useReducer(reducer, defaultState);

  return useMemo(
    () => ({
      getHtmlDescription: () => state.htmlDescription,
      getConvertedDescription: () => state.convertedDescription,
      isHtmlDescriptionConverted: () =>
        state.htmlDescription === state.lastConvertedHtmlDescription,
      setHtmlDescription: (value: string) =>
        dispatch(setHtmlDescription(value)),
      convertHtmlDescription: (value: string | null) =>
        dispatch(convertHtmlDescription(value)),
    }),
    [state],
  );
};

export default useDescriptionState;
