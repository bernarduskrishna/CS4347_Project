import { Box, Dialog, DialogTitle, DialogContent, Slider } from "@mui/material";

// Assuming Preview is already a defined component that renders a candidate
export default function AISettingsModal({ settingsOpen, handleSettingsClose, nSuggestions, setNSuggestions, temperature, setTemperature }) {
  return (
    <Dialog
      open={settingsOpen}
      onClose={handleSettingsClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{ style: { minHeight: "50vh" } }}
    >
      <DialogTitle>AI Ideator Settings</DialogTitle>
      <DialogContent>
        <Box className='paramsBox' sx={{ '& > :not(style)': { m: 1 } }}>
          {/* Use Slider from materialui to adjust temperature and nSuggestions */}
          <h1 className='secondBarText'>Temperature: {temperature}</h1>
          <Slider
            value={temperature}
            onChange={(event, newValue) => setTemperature(newValue)}
            min={0.1}
            max={1}
            step={0.1}
            style={{width: '150px'}}
          />
          <h1 className='secondBarText'>Number Of Suggestions: {nSuggestions}</h1>
          <Slider
            value={nSuggestions}
            onChange={(event, newValue) => setNSuggestions(newValue)}
            min={1}
            max={5}
            step={1}
            style={{width: '150px'}}
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
