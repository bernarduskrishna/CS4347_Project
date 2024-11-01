import { useState, useEffect } from "react";

import * as Tone from "tone";

import Editor from "./Editor";
import Preview from "./components/Preview";
import Navbar from "./components/Navbar";
import { Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";

import "./styles.css";

const defaultValue = `X: 1
M: 4/4
K: C
V:1                             clef=treble staff=1
 C3 D E3 C | E2 C2 E4    |`

const defaultChords = ["CM", "CM"]

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

const formatAbc = (abc, chords = [], just_update_chords = false) => {
  if (just_update_chords) {
    abc = remove_chords(abc);
    let lines = abc.split("\n");
    let vIndex = lines.findIndex((line) => line.startsWith("V:1"));
    let vLine = lines[vIndex + 1];
    let newVLine = "";

    if (chords.length > 0) {
      newVLine += `"${chords[0]}" `;
      let i = 1;

      for (let j = 0; j < vLine.length; j++) {
        if (vLine[j] === "|") {
          newVLine += "|";
          if (i < chords.length) {
            newVLine += ` "${chords[i]}" `;
            i++;
          }
        } else {
          newVLine += vLine[j];
        }
      }

      lines[vIndex + 1] = newVLine;
      abc = lines.join("\n");
    }
    return abc;
  }

  // Remove existing chords in the abc
  abc = remove_chords(abc);
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

  // Change all occurrences of |] to |
  abc = abc.replace(/\|]/g, "|");

  // Using regex, remove all occurrences of %{any_number}
  abc = abc.replace(/%\d+/g, "");

  // From the first |, remove all subsequent occurrences of \n
  let firstBarIndex = abc.indexOf("|");
  abc = abc.slice(0, firstBarIndex + 1) + abc.slice(firstBarIndex + 1).replace(/\n/g, "");

  // Add the chords with "" around them, in every bar
  let lines = abc.split("\n");
  let vIndex = lines.findIndex((line) => line.startsWith("V:1"));
  let vLine = lines[vIndex + 1];
  let newVLine = "";

  if (chords.length > 0) {
    newVLine += `"${chords[0]}" `;
    let i = 1;

    for (let j = 0; j < vLine.length; j++) {
      if (vLine[j] === "|") {
        newVLine += "|";
        if (i < chords.length) {
          newVLine += ` "${chords[i]}" `;
          i++;
        }
      } else {
        newVLine += vLine[j];
      }
    }

    lines[vIndex + 1] = newVLine;
    abc = lines.join("\n");
  }

  // If there are 10 or more | characters, add \n after every 10th |
  let barCountAfter = 0;
  let newAbc = "";
  for (let i = 0; i < abc.length; i++) {
    if (abc[i] === "|") {
      barCountAfter++;
    }
    newAbc += abc[i];
    if (barCountAfter === 10) {
      barCountAfter = 0;
      newAbc += "\n";
    }
  }

  abc = newAbc;

  // If there are fewer than 10 | characters, add one | on the last line
  let barCount = 0;
  for (let i = 0; i < abc.length; i++) {
    if (abc[i] === "|") {
      barCount++;
    }
  }

  if (barCount < 10) {
    abc = abc + "\n|";
  }

  // Replace || with |
  abc = abc.replace(/\|\|/g, "|");

  // Replace consecutive spaces with a single space
  abc = abc.replace(/ +/g, " ");

  return `\n\`\`\`abc\n${abc}\n\`\`\``;
}

const remove_chords = (abc) => {
  // Just remove all "" enclosed strings
  return abc.replace(/".*?"/g, "");
}

export default function App() {
  const [chords, setChords] = useState(defaultChords);

  const [value, setValue] = useState(formatAbc(defaultValue, chords));
  const [isPlaying, setPlaying] = useState(false);
  const [candidates, setCandidates] = useState([]);

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const suggestMelody = () => {
    fetch("/suggest_melody", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "abc": remove_chords(value) }),
    }).then((res) => res.json()).then((data) => {
      const formattedAbcs = data["abc"].map((abc) => formatAbc(abc, chords));
      setCandidates(formattedAbcs);
      handleOpen();
    })
  }

  const update_chords = () => {
    // extract chords from the value. chords are those characters that are enclosed in double quotes
    let newChords = [];
    let chord = "";
    let inChord = false;

    for (let i = 0; i < value.length; i++) {
      if (value[i] === '"') {
        if (inChord) {
          newChords.push(chord);
          chord = "";
          inChord = false;
        } else {
          inChord = true;
        }
      } else if (inChord) {
        chord += value[i];
      }
    }
    setChords(newChords);
  }

  const suggestHarmony = () => {
    fetch("/suggest_harmony", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "chords": chords.join(" ") }),
    }).then((res) => res.json()).then((data) => {
      const chords_suggestions = data['chords'].map((chord) => chord.split(" "));
      const formattedAbcs = chords_suggestions.map((chords) => formatAbc(value, chords, true));
      setCandidates(formattedAbcs);
      handleOpen();
    })
  }

  function onEditorChange(value, event) {
    setValue(value);
    // Extract chords from the value. Chords will be those characters that are enclosed in double quotes
    let newChords = [];
    let chord = "";
    let inChord = false;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === '"') {
        if (inChord) {
          newChords.push(chord);
          chord = "";
          inChord = false;
        } else {
          inChord = true;
        }
      } else if (inChord) {
        chord += value[i];
      }
    }
    setChords(newChords);
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
    setValue(candidate);
    setOpen(false);
    setCandidates([]);
  };

  useEffect(() => {
    update_chords();
  }, [value]);

  return (
    <div className="App">
      <Navbar play={play} suggestMelody={suggestMelody} setValue={setValue} formatAbc={formatAbc} suggestHarmony={suggestHarmony}/>
      <div className="preview-wrapper">
        <Preview value={value} onEvent={onEvent} isPlaying={isPlaying} setValue={setValue} formatAbc={formatAbc} chords={chords}/>
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
