import ReactMarkdown from "react-markdown";
import Score from "./Score";
import uniqid from "uniqid";

const formatABCMarkdown = (abc) => {
  return `\`\`\`abc\n${abc}\n\`\`\``;
}

export default function Preview({ value, onEvent, isPlaying, setValue, chords }) {
  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match && match[1] === "abc" ? (
        <Score
          id={uniqid()}
          notation={children}
          onEvent={onEvent}
          isPlaying={isPlaying}
          setValue={setValue}
          chords={chords}
        />
      ) : (
        <code className={className} {...props} />
      );
    }
  };

  return (
    <ReactMarkdown className="preview" components={components}>
      {formatABCMarkdown(value.replace(/\n$/, "").replace(/\n+/g, '\n').trim())}
    </ReactMarkdown>
  );
}
