import { Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";

import Preview from "./Preview";

// Assuming Preview is already a defined component that renders a candidate
export default function CandidateModal({ modalOpen, handleModalClose, candidates, onSelectCandidate }) {
  return (
    <Dialog
      open={modalOpen}
      onClose={handleModalClose}
      fullWidth
      maxWidth="lg" // This makes the modal quite large
      PaperProps={{ style: { minHeight: "80vh" } }} // Customize to make the height large enough
    >
      <DialogTitle>
        Select a Candidate!
      </DialogTitle>
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
