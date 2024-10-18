import { useState, useEffect } from "react";

import * as Tone from "tone";

import Editor from "./Editor";
import Preview from "./Preview";

import "./styles.css";

const defaultValue = `
\`\`\`abc
X: 1
M: 4/4
K: C
V:1                             clef=treble staff=1
C3 D E3 C | E2 C2E4     |
V:2                             clef=bass staff=1
[C,E,G,]8 |[C,E,G,]8    |
\`\`\``;

const piano = new Tone.Sampler({
	urls: {
		C4: "C4.mp3",
		"D#4": "Ds4.mp3",
		"F#4": "Fs4.mp3",
		A4: "A4.mp3",
	},
	release: 1,
	baseUrl: "https://tonejs.github.io/audio/salamander/",
}).toDestination();

const extractHarmony = (value) => {
  const lines = value.split("\n");
  const harmonyIndex = lines.findIndex((line) => line.startsWith("V:2"));
  return lines[harmonyIndex + 1];
}

const extractMelody = (value) => {
  const lines = value.split("\n");
  const melodyIndex = lines.findIndex((line) => line.startsWith("V:1"));
  return lines[melodyIndex + 1];
}

const suggestHarmony = (melody, harmony) => {
  fetch("/suggest_harmony", {
    method: "POST",
    body: JSON.stringify({ melody, harmony }),
  }).then((res) => res.json()).then((data) => {
    console.log(data);
  })
  // TODO: Implement harmony suggestion
  return harmony;
}

const suggestMelody = (melody, harmony) => {
  // TODO: Implement melody suggestion
  return melody;
}

export default function App() {
  const [value, setValue] = useState(defaultValue);
  const [isPlaying, setPlaying] = useState(false);
  function onEditorChange(value, event) {
    setValue(value);
  }
  useEffect(() => {
    setPlaying(false);
  }, [value]);

  const harmony = extractHarmony(value);
  const melody = extractMelody(value);

  function onEvent(event) {
    if (!event) {
      return;
    }
    event.notes.forEach((n) => {
      piano.triggerAttackRelease(n.name, n.duration);
    });
  }

  function play() {
    setPlaying(!isPlaying);
  }

  return (
    <div className="App">
      <div className="preview-wrapper">
        <header className="buttons-wrapper">
          <button onClick={play}>Play</button>
          <button onClick={() => suggestMelody(melody, harmony)}> Suggest Melody </button>
          <button onClick={() => suggestHarmony(melody, harmony)}> Suggest Harmony </button>
        </header>
        <Preview value={value} onEvent={onEvent} isPlaying={isPlaying} />
      </div>
      <Editor onEditorChange={onEditorChange} defaultValue={defaultValue} />
    </div>
  );
}
