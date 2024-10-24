import { useState, useEffect } from "react";

import * as Tone from "tone";

import Editor from "./Editor";
import Preview from "./components/Preview";
import Navbar from "./components/Navbar";
import { Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";

import "./styles.css";

const defaultValue = `
\`\`\`abc
X: 1
M: 4/4
K: C
V:1                             clef=treble staff=1
C3 D E3 C | E2 C2 E4    |
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

// Assuming Preview is already a defined component that renders a candidate
const CandidateModal = ({ candidates, open, onClose, onSelectCandidate }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg" // This makes the modal quite large
      PaperProps={{ style: { minHeight: "80vh" } }} // Customize to make the height large enough
    >
      <DialogTitle>Select a Candidate</DialogTitle>
      <DialogContent>
        <div className="candidates">
          {candidates.map((candidate, index) => (
            <div
              key={index}
              className="candidate"
              style={{ marginBottom: "16px", cursor: "pointer" }} // Spacing between candidates and pointer for selectability
              onClick={() => onSelectCandidate(candidate)} // Call the function when a candidate is clicked
            >
              <Typography variant="h6" component="div">
                Candidate {index + 1}
              </Typography>
              <Preview value={candidate} onEvent={() => {}} isPlaying={false}/>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const formatAbc = (abc) => {
  // Firstly, remove all lines that start with T: or C: or w:
  abc = abc.split("\n").filter((line) => {
    return !line.startsWith("T:") && !line.startsWith("C:") && !line.startsWith("w:");
  }).join("\n");
  // If last line is empty line, remove it
  if (abc[abc.length - 1] === "\n") {
    abc = abc.slice(0, -1);
  }
  // If there are multiple V: lines, remove all but the first one
  let vCount = 0;

  abc = abc.split("\n").filter((line) => {
    if (line.startsWith("V:")) {
      if (vCount === 0) {
        vCount++;
        return true;
      }
      return false;
    }
    return true;
  }
  ).join("\n");

  return `\n\`\`\`abc\n${abc}\n\`\`\``;
}

export default function App() {
  const [value, setValue] = useState(defaultValue);
  const [isPlaying, setPlaying] = useState(false);
  const [candidates, setCandidates] = useState([]);

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const suggestContinuation = () => {
    fetch("/suggest_melody", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "abc": value }),
    }).then((res) => res.json()).then((data) => {
      const formattedAbcs = data["abc"].map((abc) => formatAbc(abc));
      setCandidates(formattedAbcs);
      handleOpen();
    })
  }

  function onEditorChange(value, event) {
    setValue(value);
  }

  function onEvent(event) {
    if (!event) {
      return;
    }
    event.notes.forEach((n) => {
      piano.triggerAttackRelease(n.name, n.duration);
    });
  }

  function play() {
    setPlaying(true);
  }

  const handleSelectCandidate = (candidate) => {
    console.log("Selected Candidate:", candidate);
    setValue(candidate);
    // Perform any action with the selected candidate here
    setOpen(false);
    setCandidates([]);
  };

  return (
    <div className="App">
      <Navbar play={play} suggestContinuation={suggestContinuation} setValue={setValue} formatAbc={formatAbc}/>
      <div className="preview-wrapper">
        <Preview value={value} onEvent={onEvent} isPlaying={isPlaying} />
      </div>
      <Editor onEditorChange={onEditorChange} defaultValue={defaultValue} value={value} />
      <CandidateModal
        candidates={candidates}
        open={open}
        onClose={handleClose}
        onSelectCandidate={handleSelectCandidate}
      />
    </div>
  );
}
