import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";

const MonthlyRangeModal = ({ isOpen, onClose, handleConfirm, initialMin, initialMax }) => {
  const [minValue, setMinValue] = useState(initialMin || "");
  const [maxValue, setMaxValue] = useState(initialMax || "");

  // Sync modal values with external changes to initialMin and initialMax
  useEffect(() => {
    setMinValue(initialMin || "");
    setMaxValue(initialMax || "");
  }, [initialMin, initialMax]);

  const confirmSelection = () => {
    handleConfirm(minValue, maxValue);
    onClose();
  };

  const clearValues = () => {
    setMinValue("");
    setMaxValue("");
    handleConfirm("", ""); // Notify the parent component to clear the range
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          width: "400px",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" mb={2}>
          월세 선택
        </Typography>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <TextField
            label="최소 금액(원)"
            value={minValue}
            onChange={(e) => setMinValue(e.target.value)}
            fullWidth
            type="number"
          />
          <TextField
            label="최대 금액(원)"
            value={maxValue}
            onChange={(e) => setMaxValue(e.target.value)}
            fullWidth
            type="number"
          />
        </Box>
        <Box sx={{ textAlign: "right" }}>
          <Button onClick={clearValues} sx={{ mr: 2 }}>
            초기화
          </Button>
          <Button onClick={onClose} sx={{ mr: 2 }}>
            취소
          </Button>
          <Button variant="contained" onClick={confirmSelection}>
            확인
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default MonthlyRangeModal;