import Editor from "@monaco-editor/react";

const options = {
  codeLens: false
};

export default function Editor2({ onEditorChange, defaultValue, value }) {
  return (
    <div className="editor">
      <Editor
        defaultLanguage="markdown"
        theme="vs-dark"
        options={options}
        defaultValue={defaultValue}
        onChange={onEditorChange}
        value={value}
      />
    </div>
  );
}
