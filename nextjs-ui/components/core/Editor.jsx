import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-twilight";

const defaultContents = `# Write your scenario here and press Run to run it!
config:
  # Replace this with your API's base URL:
  target: "https://superrepl.com"
scenarios:
  - flow:
    - get:
        url: "/"
        expect:
          statusCode: 200
    - get:
        url: "/dinosaurs"
        expect:
          # no dinosaurs expected
          statusCode: 404
`;

function onChange(newValue) {
  console.log("change", newValue);
}

const Editor = () => {
  return (<AceEditor
    mode="yaml"
    theme="twilight"
    onChange={onChange}
    width="100%"
    name="editor"
    tabSize={2}
    fontSize={14}
    value={defaultContents}
    editorProps={{ $blockScrolling: false }}
  />)
};

export default Editor;
