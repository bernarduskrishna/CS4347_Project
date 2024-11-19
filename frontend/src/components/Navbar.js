"use client";

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import MenuIcon from '@mui/icons-material/Menu';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import AI_Icon from '../resources/ai.png';

const Navbar = ({ value, setValue, play, handleSettingsOpen, suggestMelody, suggestHarmony }) => {

  // For Burger Bar Menu
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const handleMenuClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // For AI Menu
  const [AIMenuAnchorEl, setAIMenuAnchorEl] = React.useState(null);
  const AIMenuOpen = Boolean(AIMenuAnchorEl);
  const handleAIMenuClick = (event) => {
    setAIMenuAnchorEl(event.currentTarget);
  };
  const handleAIMenuClose = () => {
    setAIMenuAnchorEl(null);
  };

  const handleImportXML = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('musicxml', file);

    fetch("/upload_xml", {
      method: 'POST',
      body: formData,
    }).then((res) => res.json()).then((data) => {
      const result_abc = data['result'];
      setValue(result_abc);
    });

  };

  const handleExportXML = async (event) => {
    fetch("/download_xml", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({'abc': value.split('\n')}),
    }).then((res) => {
      if (res.ok) {
        // Check if the response is okay, and if so, start the download
        const contentDisposition = res.headers.get('Content-Disposition');
        const fileName = contentDisposition.split('filename=')[1].replace(/"/g, ''); // Extract filename from header
  
        return res.blob().then((blob) => {
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          link.download = fileName; // Use the file name from the response
          link.click();
          window.URL.revokeObjectURL(url);
        });
      } else {
        throw new Error('Failed to export XML');
      }
    });
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
    <nav className="fixed relative top-0 flex justify-between items-center p-4 bg-gray-800">
      <div className="flex space-x-4 text-white text-xl">
        <IconButton 
          aria-label="menu"
          id="basic-button"
          aria-controls={menuOpen ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={menuOpen ? 'true' : undefined}
          onClick={handleMenuClick}
        >
          <MenuIcon style={{ color: 'white' }} />
        </IconButton>
        <Menu
          id="basic-menu"
          anchorEl={menuAnchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem
            component="label"
            role={undefined}
            variant="text"
            tabIndex={-1}
          >
            Import MusicXML / XML
            <VisuallyHiddenInput
              type="file"
              onChange={handleImportXML}
              multiple
            />
          </MenuItem>
          <MenuItem 
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            onClick={handleExportXML}
          >
            Export MusicXML
          </MenuItem>
        </Menu>
        <p className="mt-1">ScoreGen</p>
      </div>
      <div className="flex space-x-4">
        <Button
          variant="contained"
          color="success"
          onClick={() => play()}
        >
          <PlayArrowIcon style={{ color: 'white' }} />
        </Button>
        <Button 
          aria-label="ai-menu"
          variant="contained" 
          color="info" 
          startIcon={<Avatar src={AI_Icon} style={{ height: '32px', width: 'auto' }}/>}
          aria-controls={AIMenuOpen ? 'ai-basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={AIMenuOpen ? 'true' : undefined}
          onClick={handleAIMenuClick}
        >
          AI Ideation Helper
        </Button>
        <Menu
          id="ai-basic-menu"
          anchorEl={AIMenuAnchorEl}
          open={AIMenuOpen}
          onClose={handleAIMenuClose}
          MenuListProps={{
            'aria-labelledby': 'ai-menu',
          }}
        >
          <MenuItem
            component="label"
            role={undefined}
            variant="text"
            tabIndex={-1}
            onClick={() => suggestMelody()}
          >
            Suggest Melody
          </MenuItem>
          <MenuItem 
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            onClick={() => suggestHarmony()}
          >
            Suggest Harmony
          </MenuItem>
          <MenuItem 
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            onClick={() => handleSettingsOpen()}
          >
            AI Helper Settings
          </MenuItem>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;