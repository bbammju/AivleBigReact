import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import DistrictModal from "../components/guModal";
import SizeRangeModal from "../components/sizeRangeModal";
import GuaranteeRangeModal from "../components/guaranteeModal";
import MonthlyRangeModal from "../components/monthlyModal";
import { Box, Button, Typography, Chip } from "@mui/material";

const seoulDistricts = [
  "강남구", "강동구", "강북구", "강서구", "관악구",
  "광진구", "구로구", "금천구", "노원구", "도봉구",
  "동대문구", "동작구", "마포구", "서대문구", "서초구",
  "성동구", "성북구", "송파구", "양천구", "영등포구",
  "용산구", "은평구", "종로구", "중구", "중랑구"
];

const RsltList = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState([]);
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");
  const [sizeRange, setSizeRange] = useState([]);
  const [minGuarantee, setMinGuarantee] = useState("");
  const [maxGuarantee, setMaxGuarantee] = useState("");
  const [guaranteeRange, setGuaranteeRange] = useState([]);
  const [minMonthly, setMinMonthly] = useState("");
  const [maxMonthly, setMaxMonthly] = useState("");
  const [monthlyRange, setMonthlyRange] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
  const [isGuaranteeModalOpen, setIsGuaranteeModalOpen] = useState(false);
  const [isMonthlyModalOpen, setIsMonthlyModalOpen] = useState(false);

  const listHandler = async () => {
    try {
      const data = await axios.get("http://localhost:7773/api/rslt-list", {
        params: {
          minSize,
          maxSize,
          minGuarantee,
          maxGuarantee,
          minMonthly,
          maxMonthly,
        },
      });

      if (data) {
        console.log(data.data.data); // Handle result data
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleModalConfirm = () => {
    setLocation(selectedDistricts);
    setIsModalOpen(false);
  };

  const toggleDistrictSelection = (district) => {
    setSelectedDistricts((prev) =>
      prev.includes(district)
        ? prev.filter((item) => item !== district)
        : [...prev, district]
    );
  };

  const confirmRangeSelection = (min, max, type) => {
    if (type === "size") {
      setMinSize(min);
      setMaxSize(max);
      setSizeRange([min, max]);
    } else if (type === "guarantee") {
      setMinGuarantee(min);
      setMaxGuarantee(max);
      setGuaranteeRange([min, max]);
    } else if (type === "monthly") {
      setMinMonthly(min);
      setMaxMonthly(max);
      setMonthlyRange([min, max]);
    }
  };

  const clearSizeRange = () => {
    setMinSize("");
    setMaxSize("");
    setSizeRange([]);
  };

  const clearGuaranteeRange = () => {
    setMinGuarantee("");
    setMaxGuarantee("");
    setGuaranteeRange([]);
  };

  const clearMonthlyRange = () => {
    setMinMonthly("");
    setMaxMonthly("");
    setMonthlyRange([]);
  };

  return (
    <>
      <Header />
      <Box sx={{ p: 2, borderBottom: "1px solid #ccc" }}>
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          {/* 지역(구) Dropdown */}
          <Box
            onClick={() => setIsModalOpen(true)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "25%",
              padding: "8px 10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: "white",
              '&:hover': { borderColor: "#888" },
            }}
          >
            <Typography>
              지역(구)
            </Typography>
            <Box sx={{ fontSize: "16px", color: "#aaa" }}>▼</Box>
          </Box>

          {/* 면적 선택 Dropdown */}
          <Box
            onClick={() => setIsRangeModalOpen(true)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "25%",
              padding: "8px 10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: "white",
              '&:hover': { borderColor: "#888" },
            }}
          >
            <Typography>
              면적 선택
            </Typography>
            <Box sx={{ fontSize: "16px", color: "#aaa" }}>▼</Box>
          </Box>

          {/* 보증금 선택 Dropdown */}
          <Box
            onClick={() => setIsGuaranteeModalOpen(true)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "25%",
              padding: "8px 10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: "white",
              '&:hover': { borderColor: "#888" },
            }}
          >
            <Typography>
              보증금 선택
            </Typography>
            <Box sx={{ fontSize: "16px", color: "#aaa" }}>▼</Box>
          </Box>

          {/* 월세 선택 Dropdown */}
          <Box
            onClick={() => setIsMonthlyModalOpen(true)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "25%",
              padding: "8px 10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: "white",
              '&:hover': { borderColor: "#888" },
            }}
          >
            <Typography>
              월세 선택
            </Typography>
            <Box sx={{ fontSize: "16px", color: "#aaa" }}>▼</Box>
          </Box>

          {/* Search Button */}
          <Button variant="contained" onClick={listHandler}>
            검색
          </Button>
        </Box>

        {/* Display Hashtags */}
        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
          {location.map((loc, index) => (
            <Chip
              key={index}
              label={`#${loc}`}
              onDelete={() => {
                setLocation((prev) => prev.filter((item) => item !== loc));
                setSelectedDistricts((prev) => prev.filter((item) => item !== loc));
              }}
            />
          ))}
          {sizeRange.length > 0 && (
            <Chip label={`#${sizeRange[0]} ~ ${sizeRange[1]} (m²)`} onDelete={clearSizeRange} />
          )}
          {guaranteeRange.length > 0 && (
            <Chip label={`#${guaranteeRange[0]} ~ ${guaranteeRange[1]}`} onDelete={clearGuaranteeRange} />
          )}
          {monthlyRange.length > 0 && (
            <Chip label={`#${monthlyRange[0]} ~ ${monthlyRange[1]}`} onDelete={clearMonthlyRange} />
          )}
        </Box>
      </Box>

      {/* Modals */}
      <DistrictModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        seoulDistricts={seoulDistricts}
        selectedDistricts={selectedDistricts}
        toggleDistrictSelection={toggleDistrictSelection}
        handleConfirm={handleModalConfirm}
      />
      <SizeRangeModal
        isOpen={isRangeModalOpen}
        onClose={() => setIsRangeModalOpen(false)}
        handleConfirm={(min, max) => confirmRangeSelection(min, max, "size")}
        initialMin={minSize} // Sync with state
        initialMax={maxSize} // Sync with state
      />
      <MonthlyRangeModal
        isOpen={isMonthlyModalOpen}
        onClose={() => setIsMonthlyModalOpen(false)}
        handleConfirm={(min, max) => confirmRangeSelection(min, max, "monthly")}
        initialMin={minMonthly} // Sync with state
        initialMax={maxMonthly} // Sync with state
      />

      <GuaranteeRangeModal
        isOpen={isGuaranteeModalOpen}
        onClose={() => setIsGuaranteeModalOpen(false)}
        handleConfirm={(min, max) => confirmRangeSelection(min, max, "guarantee")}
        initialMin={minGuarantee} // Sync with state
        initialMax={maxGuarantee} // Sync with state
      />
    </>
  );
};

export default RsltList;