import { useState, useEffect, useRef } from "react";
import { Backdrop, CircularProgress, Divider, Paper } from "@mui/material";

import AISettingsModal from "./components/AISettingsModal";
import CandidateModal from "./components/CandidateModal";
import Editor from "./components/Editor";
import Navbar from "./components/Navbar";
import Preview from "./components/Preview";
import Toolbar from "./components/Toolbar";

import { 
  DEFAULT_VALUE, 
  DEFAULT_CHORDS, 
  PIANO,
  addFiller,
  addChords,
  formatChords,
  removeChords,
  addTCLines,
  addVLines,
  extractTCLines,
  extractVLines,
  formatABCGeneration,
  extractChords,
} from './utils';

import "./styles.css";

export default function App() {

  const [chords, setChords] = useState(DEFAULT_CHORDS);
  const [value, setValue] = useState(addChords(DEFAULT_VALUE, chords));
  const [metadata, setMetadata] = useState(extractTCLines(DEFAULT_VALUE)[0]);

  const [isPlaying, setPlaying] = useState(false);

  const [candidates, setCandidates] = useState([]);
  const [nSuggestions, setNSuggestions] = useState(3);
  const [temperature, setTemperature] = useState(0.9);

  const [backdropOpen, setBackdropOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEditorToggle = () => setEditorOpen(!editorOpen);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);
  const handleSettingsOpen = () => setSettingsOpen(true);
  const handleSettingsClose = () => setSettingsOpen(false);

  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function onEditorChange(value, event) {
    setValue(value);
    setChords(extractChords(value));
  }

  function onEvent(event) {
    if (!event) {
      return;
    }
    event.notes.forEach((n) => {
      PIANO.triggerAttackRelease(n.name, n.duration);
    });
    setPlaying(false);
  }

  const play = () => setPlaying(true);

  const handleSelectCandidate = (candidate) => {
    setValue(addTCLines(candidate, metadata));
    setChords(extractChords(candidate));
    setModalOpen(false);
    setCandidates([]);
  };

  const suggestMelody = () => {
    const v_extraction = extractVLines(value);
    const tc_extraction = extractTCLines(value);
    setMetadata(tc_extraction[0])
    const processedValue = formatABCGeneration(removeChords(v_extraction[1]));
    setBackdropOpen(true);
    fetch("/suggest_melody", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "abc": processedValue, "temperature": temperature, "n_suggestions": nSuggestions }),
    }).then((res) => res.json()).then((data) => {
      const formattedAbcs = data["abc"].map((abc) => addChords(addVLines(formatABCGeneration(abc), v_extraction[0]), chords));
      setCandidates(formattedAbcs);
      handleModalOpen();
      setBackdropOpen(false);
    })
  }
  
  const suggestHarmony = () => {
    const tc_extraction = extractTCLines(value);
    setMetadata(tc_extraction[0])
    setBackdropOpen(true);
    fetch("/suggest_harmony", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ "chords": formatChords(chords).join(" "), "temperature": temperature, "n_suggestions": nSuggestions }),
    }).then((res) => res.json()).then((data) => {
      const chords_suggestions = data['chords'].map((chord) => chord.split(" "));
      const extraction = extractVLines(tc_extraction[1]);
      const abc_chords_removed = addVLines(removeChords(extraction[1]), extraction[0]);
      const formattedAbcs = chords_suggestions.map((chords) => addChords(addFiller(abc_chords_removed, chords), chords));
      setCandidates(formattedAbcs);
      handleModalOpen();
      setBackdropOpen(false);
    })
  }

  return (
    <div className="App">
      <Navbar 
        value={value}
        setValue={setValue}
        play={play}
        handleSettingsOpen={handleSettingsOpen}
        suggestMelody={suggestMelody}
        suggestHarmony={suggestHarmony}
      />
      <Divider sx={{ borderColor: '#383b4a' }}/>
      <Toolbar 
        value={value}
        editorRef={editorRef}
        editorOpen={editorOpen}
        handleEditorToggle={handleEditorToggle}
      />
      <div className="align-wrapper">
        <Paper className="preview-wrapper">
          <Preview value={value} onEvent={onEvent} isPlaying={isPlaying} setValue={setValue} chords={chords}/>
        </Paper>
      </div>
      <Editor editorOpen={editorOpen} onEditorChange={onEditorChange} defaultValue={DEFAULT_VALUE} value={value} handleEditorDidMount={handleEditorDidMount} />
      <Backdrop
        sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
        open={backdropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <AISettingsModal 
        settingsOpen={settingsOpen}
        handleSettingsClose={handleSettingsClose}
        nSuggestions={nSuggestions}
        setNSuggestions={setNSuggestions}
        temperature={temperature}
        setTemperature={setTemperature}        
      />
      <CandidateModal
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
        candidates={candidates}
        onSelectCandidate={handleSelectCandidate}
      />
    </div>
  );
}
