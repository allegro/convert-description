import React, { useEffect, useRef } from "react";
import AceEditor, { ICommand } from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/ext-language_tools";
import beautify from "ace-builds/src-noconflict/ext-beautify";
import "ace-builds/webpack-resolver";

interface TextFieldProps {
  language: string;
  placeholder?: string;
  readOnly?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  onPaste?: (value: string) => void;
}

const CodeField = ({
  language,
  placeholder,
  readOnly,
  value,
  onChange,
  onPaste,
}: TextFieldProps) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef?.current?.editor?.session) {
      beautify.beautify(editorRef.current.editor.session);
    }
  }, []);

  return (
    <div className="position-relative">
      <AceEditor
        className="description-container"
        commands={beautify.commands as ICommand[]}
        editorProps={{ $blockScrolling: true }}
        height=""
        mode={language}
        readOnly={readOnly}
        ref={editorRef}
        setOptions={{
          enableBasicAutocompletion: true,
          enableLiveAutocompletion: true,
          enableSnippets: true,
        }}
        theme="textmate"
        value={value}
        width=""
        wrapEnabled
        onChange={onChange}
        onPaste={onPaste}
      />
      {!value && (
        <div className="position-absolute top-50 start-50 translate-middle opacity-50">
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default CodeField;
