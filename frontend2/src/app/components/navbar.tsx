"use client";

import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

const Navbar = (props: any) => {

  const handleImportXML = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (!file) return;

    const formData = new FormData();
    formData.append('musicxml', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/upload_xml', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      const result_abc = result['result'];
      props.setDisplayMusicABC(result_abc)

    } catch (error) {
      console.error('Error:', error);
    }
 
  };

  const handleExportXML = () => {
    console.log("Play clicked");
  };

  const handleImport = () => {
    console.log("Play clicked");
  };

  const handlePlay = () => {
    console.log("Play clicked");
  };

  const handleSuggestMelody = () => {
    console.log("Suggest Melody clicked");
  };

  const handleSuggestHarmony = () => {
    console.log("Suggest Harmony clicked");
  };

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800">
      <div className="flex space-x-4 text-white text-xl">
        <h1>CS4347 Project</h1>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Import XML
          <VisuallyHiddenInput
            type="file"
            accept=".musicxml"
            onChange={handleImportXML}
            multiple
          />
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleExportXML}
        >
          Export XML
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleImport}
        >
          Import MP3
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleImport}
        >
          Export MP3
        </Button>
    </div>
      <div className="flex space-x-4">
        <Button
          variant="contained"
          color="success"
          onClick={handlePlay}
        >
          Play
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleSuggestMelody}
        >
          Suggest Melody
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleSuggestHarmony}
        >
          Suggest Harmony
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;