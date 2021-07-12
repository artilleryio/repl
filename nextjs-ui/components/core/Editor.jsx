import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-twilight";

const Editor = ({ onChange, value }) => {
  return (<AceEditor
    mode="yaml"
    theme="twilight"
    onChange={onChange}
    width="100%"
    height="100%"
    name="editor"
    tabSize={2}
    fontSize={14}
    value={value}
    editorProps={{ $blockScrolling: false }}
  />)
};

export default Editor;
