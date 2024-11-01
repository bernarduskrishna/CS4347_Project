import ReactMarkdown from "react-markdown";
import Score from "./Score";
import uniqid from "uniqid";

export default function Preview({ value, onEvent, isPlaying, setValue, formatAbc, chords }) {
  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match && match[1] === "abc" ? (
        <Score
          id={uniqid()}
          notation={`${children}`.replace(/\n$/, "")}
          onEvent={onEvent}
          isPlaying={isPlaying}
          setValue={setValue}
          formatAbc={formatAbc}
          chords={chords}
        />
      ) : (
        <code className={className} {...props} />
      );
    }
  };

  return (
    <ReactMarkdown className="preview" components={components}>
      {value}
    </ReactMarkdown>
  );
}
