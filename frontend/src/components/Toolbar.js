"use client";

import * as React from 'react';
import { Box, Button, IconButton } from "@mui/material";

import crotchet from '../resources/crotchet_w.png';
import dot from '../resources/dot_w.png';
import minim from '../resources/minim_w.png';
import quaver from '../resources/quaver_w.png';
import rest from '../resources/rest_w.png';
import semibreve from '../resources/semibreve_w.png';

const NOTES = [
  { name: 'quaver', file: quaver, duration: 1 },
  { name: 'crotchet', file: crotchet, duration: 2 },
  { name: 'minim', file: minim, duration: 4 },
  { name: 'semibreve', file: semibreve, duration: 8 },
  { name: 'dot', file: dot, duration: '' },
  { name: 'rest', file: rest, duration: '' },
];

const Toolbar = ({ editorRef, editorOpen, handleEditorToggle }) => {

  const [dotActive, setDotActive] = React.useState(false);
  const [restActive, setRestActive] = React.useState(false);

  const toHighlight = (note) => (note.name === 'dot' && dotActive) || (note.name === 'rest' && restActive)

  function insertTextAtCursor(newNote) {
    const editor = editorRef.current;
    if (editor) {
      const position = editor.getPosition();
  
      // Add text to the position
      editor.executeEdits("", [{ range: {
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      }, text: " " + newNote }]);
    }
  }
  
  const addNote = (inputNote) => {
    if (inputNote.name === 'dot') {
      setDotActive(!dotActive);
    } else if (inputNote.name === 'rest') {
      setRestActive(!restActive);
    } else {
      const noteChar = restActive ? 'z' : 'C';
      const noteLength = dotActive ? Math.floor(inputNote.duration * 1.5) : inputNote.duration;
      const newNote = noteChar + noteLength.toString();
      insertTextAtCursor(newNote);
    }
  }

  return (
    <nav className="fixed relative top-0 flex justify-between items-center pl-4 bg-gray-700">
      <div className="flex space-x-4 text-white text-xl">
        <Box className='addNoteBox' sx={{ '& > :not(style)': { m: 1 } }}>
          <h1 className='secondBarText'>Add Notes: </h1>
          {NOTES.map((note) => (
            <IconButton key={note.name} onClick={() => {addNote(note)}} style={{ backgroundColor: toHighlight(note) ? '#257a47' : '', padding: 0, width: '40px', height: '40px'}}>
              <img src={note.file} alt={note.name} style={{width: '50%', height: 'auto'}} />
            </IconButton>
          ))}
        </Box>
      </div>
      <div className="flex space-x-4 mr-8">
        <Button variant="contained" color={ editorOpen ? "warning" : "success"} onClick={handleEditorToggle}>
          { editorOpen ? "Hide Editor" : "Open Editor"}
        </Button>
      </div>
    </nav>
  );
};

export default Toolbar;