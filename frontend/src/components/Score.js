import SheetMusic from "@slnsw/react-sheet-music";
import { useState, useEffect } from "react";

const getOneSemitoneUp = (note) => {
  const notes = ["C", "^C", "D", "^D", "E", "F", "^F", "G", "^G", "A", "^A", "B"];

  const components = note.split(/\s+/).filter((component) => component !== "");
  const note_w_accidentals_and_dur = components[components.length - 1];

  if (!note_w_accidentals_and_dur) {
    return note;
  }

  // accidental is ^. Octave is either ' or , (comma). Duration is a number. E.g. ^C'3 means accidental ^, octave ', note C, duration 3
  const accidentals = note_w_accidentals_and_dur.match(/\^+/g);
  const octave = note_w_accidentals_and_dur.match(/,|'/g);
  const duration = note_w_accidentals_and_dur.match(/\d+/g);
  const pure_note = note_w_accidentals_and_dur.replace(/,|\^|\d+/g, "");

  const noteIndex = notes.indexOf((accidentals ?? "") + pure_note);
  
  const new_pure_note = notes[(noteIndex + 1) % notes.length];
  // if new_pure_note is C, then we need to append a '
  let new_note = new_pure_note;
  if (new_pure_note === "C") {
    new_note = `${new_pure_note}'`;
  }

  // if there are octaves, add them to the new_note
  if (octave) {
    new_note = new_note + octave;
  }

  // if there is a duration, add it to the new_note
  if (duration) {
    new_note = new_note + duration;
  }
  // readd the first component of the note if it exists
  if (components.length > 1) {
    new_note = components[0] + " " + new_note;
  }

  return new_note;
}

const getOneSemitownDown = (note) => {
  const notes = ["C", "^C", "D", "^D", "E", "F", "^F", "G", "^G", "A", "^A", "B"];

  const components = note.split(/\s+/).filter((component) => component !== "");
  const note_w_accidentals_and_dur = components[components.length - 1];

  if (!note_w_accidentals_and_dur) {
    return note;
  }

  // accidental is ^. Octave is either ' or , (comma). Duration is a number. E.g. ^C'3 means accidental ^, octave ', note C, duration 3
  const accidentals = note_w_accidentals_and_dur.match(/\^+/g);
  const octave = note_w_accidentals_and_dur.match(/,|'/g);
  const duration = note_w_accidentals_and_dur.match(/\d+/g);
  const pure_note = note_w_accidentals_and_dur.replace(/,|\^|\d+/g, "");

  const noteIndex = notes.indexOf((accidentals ?? "") + pure_note);
  
  const new_pure_note = notes[(noteIndex - 1 + notes.length) % notes.length];
  // if new_pure_note is B, then we need to append a ,
  let new_note = new_pure_note;
  if (new_pure_note === "B") {
    new_note = `${new_pure_note},`;
  }

  // if there are octaves, add them to the new_note
  if (octave) {
    new_note = new_note + octave;
  }

  // if there is a duration, add it to the new_note
  if (duration) {
    new_note = new_note + duration;
  }
  // readd the first component of the note if it exists
  if (components.length > 1) {
    new_note = components[0] + " " + new_note;
  }

  return new_note;
}

const getOneOctaveUp = (note) => {
  const components = note.split(/\s+/).filter((component) => component !== "");
  const note_w_accidentals_and_dur = components[components.length - 1];

  if (!note_w_accidentals_and_dur) {
    return note;
  }

  // accidental is ^. Octave is either ' or , (comma). Duration is a number. E.g. ^C'3 means accidental ^, octave ', note C, duration 3
  const accidentals = note_w_accidentals_and_dur.match(/\^+/g);
  const octave = note_w_accidentals_and_dur.match(/,|'/g);
  const duration = note_w_accidentals_and_dur.match(/\d+/g);
  const pure_note = note_w_accidentals_and_dur.replace(/,|\^|\d+/g, "");

  return components.length > 1 
      ? `${components[0] ?? ""} ${accidentals ?? ""}${pure_note ?? ""}'${octave ?? ""}${duration ?? ""}` 
      : `${accidentals ?? ""}${pure_note ?? ""}'${octave ?? ""}${duration ?? ""}`;
}

const getOneOctaveDown = (note) => {
  const components = note.split(/\s+/).filter((component) => component !== "");
  const note_w_accidentals_and_dur = components[components.length - 1];

  if (!note_w_accidentals_and_dur) {
    return note;
  }

  // accidental is ^. Octave is either ' or , (comma). Duration is a number. E.g. ^C'3 means accidental ^, octave ', note C, duration 3
  const accidentals = note_w_accidentals_and_dur.match(/\^+/g);
  const octave = note_w_accidentals_and_dur.match(/,|'/g);
  const duration = note_w_accidentals_and_dur.match(/\d+/g);
  const pure_note = note_w_accidentals_and_dur.replace(/,|\^|\d+/g, "");

  return components.length > 1 
      ? `${components[0] ?? ""} ${accidentals ?? ""}${pure_note ?? ""},${octave ?? ""}${duration ?? ""}` 
      : `${accidentals ?? ""}${pure_note ?? ""},${octave ?? ""}${duration ?? ""}`;
}

const getNewNote = (note) => {
  const components = note.split(/\s+/).filter((component) => component !== "");
  const note_w_accidentals_and_dur = components[components.length - 1];

  if (!note_w_accidentals_and_dur) {
    return note;
  }

  // accidental is ^. Octave is either ' or , (comma). Duration is a number. E.g. ^C'3 means accidental ^, octave ', note C, duration 3
  const accidentals = note_w_accidentals_and_dur.match(/\^+/g);
  const octave = note_w_accidentals_and_dur.match(/,|'/g);
  const duration = note_w_accidentals_and_dur.match(/\d+/g);
  const pure_note = note_w_accidentals_and_dur.replace(/,|\^|\d+/g, "");

  return components.length > 1 
      ? `${components[0] ?? ""} ${accidentals ?? ""}${note}${octave ?? ""}${duration ?? ""}` 
      : `${accidentals ?? ""}${note}${octave ?? ""}${duration ?? ""}`;
}

export default function Score({ notation, id, onEvent, isPlaying, setValue, formatAbc, chords }) {
  const [startChar, setStartChar] = useState(0);
  const [endChar, setEndChar] = useState(0);
  const [selected, setSelected] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");

  document.addEventListener('keydown', function(event) {
    // if shift and arrowup is pressed, go one octave up
    if(event.key == 'ArrowUp' && event.shiftKey && selected) {
      const new_note = getOneOctaveUp(selectedNote);
      setSelectedNote(new_note);

      let new_notation = notation.slice(0, startChar) + new_note + " " + notation.slice(endChar);

      setEndChar(startChar + new_note.length);

      setValue(formatAbc(new_notation, chords));
    }
    // if shift and arrowdown is pressed, go one octave down
    else if(event.key == 'ArrowDown' && event.shiftKey && selected) {
      const new_note = getOneOctaveDown(selectedNote);
      setSelectedNote(new_note);

      let new_notation = notation.slice(0, startChar) + new_note + " " + notation.slice(endChar);

      setEndChar(startChar + new_note.length);

      setValue(formatAbc(new_notation, chords));
    }
    else if(event.key == "ArrowUp" && selected) {
      const new_note = getOneSemitoneUp(selectedNote);
      setSelectedNote(new_note);

      let new_notation = notation.slice(0, startChar) + new_note + " " + notation.slice(endChar);

      setEndChar(startChar + new_note.length);

      setValue(formatAbc(new_notation, chords));
    }
    else if(event.key == 'ArrowDown' && selected) {
      const new_note = getOneSemitownDown(selectedNote);
      setSelectedNote(new_note);

      let new_notation = notation.slice(0, startChar) + new_note + " " + notation.slice(endChar);

      setEndChar(startChar + new_note.length);

      setValue(formatAbc(new_notation, chords));
    }
    // if C, D, E, F, G, A, B, c, d, e, f, g, a, b is pressed, change the selected note to that note
    else if (event.key.match(/^[a-gA-G]$/) && event.key.length === 1 && selected) {
      const new_note = getNewNote(event.key.toUpperCase());
      setSelectedNote(new_note);

      let new_notation = notation.slice(0, startChar) + new_note + " " + notation.slice(endChar);

      setEndChar(startChar + new_note.length);

      setValue(formatAbc(new_notation, chords));
    }
  });

  const onClick = (event) => {
    const start_char = event.startChar;
    const end_char = event.endChar;

    setStartChar(start_char);
    setEndChar(end_char);
    setSelected(true);
    setSelectedNote(notation.slice(start_char, end_char));
  }
  return (
    <SheetMusic
      notation={notation}
      id={id}
      isPlaying={isPlaying}
      onEvent={onEvent}
      onClick={onClick}
      bpm={70}
    />
  );
}
