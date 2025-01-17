import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";

const DistrictModal = ({
  isOpen,
  onClose,
  seoulDistricts,
  selectedDistricts,
  toggleDistrictSelection,
  handleConfirm,
}) => {
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
          서울특별시 구 선택
        </Typography>
        {/* Grid with 5x5 structure */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 1,
          }}
        >
          {seoulDistricts.map((district) => (
            <Button
              key={district}
              variant={selectedDistricts.includes(district) ? "contained" : "outlined"}
              onClick={() => toggleDistrictSelection(district)}
              sx={{
                textAlign: "center",
                p: 1,
                fontSize: "14px",
              }}
            >
              {district}
            </Button>
          ))}
        </Box>
        <Box sx={{ mt: 4, textAlign: "right" }}>
          <Button onClick={onClose} sx={{ mr: 2 }}>
            취소
          </Button>
          <Button variant="contained" onClick={handleConfirm}>
            확인
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DistrictModal;