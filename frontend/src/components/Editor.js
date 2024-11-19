import Editor from "@monaco-editor/react";
import Draggable from 'react-draggable';
import Paper from "@mui/material/Paper";

const options = {
  codeLens: false
};

export default function ABCEditor({ editorOpen, onEditorChange, value, handleEditorDidMount }) {
  return (
    <Draggable handle=".draggable-header">
      <Paper elevation={9} className="w-full editor" sx={{ color: "white", backgroundColor: "#404652", visibility: editorOpen ? 'visible' : 'hidden' }}>
        <div className="pt-2 pb-2 flex justify-center w-full draggable-header">
          <p>Editor (ABC-Notation)</p>
        </div>
        <Editor
          defaultLanguage="markdown"
          theme="vs-dark"
          value={value}
          options={options}
          onChange={onEditorChange}
          onMount={handleEditorDidMount}
        />
      </Paper>
    </Draggable>
  );
}
