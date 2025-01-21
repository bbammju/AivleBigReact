import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import DistrictModal from "../components/guModal";
import SizeRangeModal from "../components/sizeRangeModal";
import GuaranteeRangeModal from "../components/guaranteeModal";
import MonthlyRangeModal from "../components/monthlyModal";
import NaverMap from "../components/navermap";
import { Box, Button, Typography, Chip, Card, CardContent, CardMedia } from "@mui/material";

const seoulDistricts = [
  "강남구", "강동구", "강북구", "강서구", "관악구",
  "광진구", "구로구", "금천구", "노원구", "도봉구",
  "동대문구", "동작구", "마포구", "서대문구", "서초구",
  "성동구", "성북구", "송파구", "양천구", "영등포구",
  "용산구", "은평구", "종로구", "중구", "중랑구"
];

const RsltList = () => {
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(10);
  const [pageNum, setPageNum] = useState(1);
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
  const [results, setResults] = useState([]);  // Store result list data

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

  const params = {
    pageSize,
    pageNum,
    ...(minSize && { minSize }),
    ...(maxSize && { maxSize }),
    ...(minGuarantee && { minGuarantee }),
    ...(maxGuarantee && { maxGuarantee }),
    ...(minMonthly && { minMonthly }),
    ...(maxMonthly && { maxMonthly }),
  };

  const listHandler = async () => {
    try {
      const response = await axios.get("http://localhost:7773/api/rslt-list", { params });

      if (response.data) {
        setResults(response.data.data);  // Store fetched data
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const dtlHandler = async (sn) => {
    try {
      const response = await axios.get("http://localhost:7773/api/jutaek-dtl", sn );
      
      if (response.data) {
        setResults(response.data.data);  // Store fetched data
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    listHandler();
  }, [pageNum]);
  return (
    <>
      <Header />
      <Box sx={{ p: 2, borderBottom: "1px solid #ccc" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
          <Box
            onClick={() => setIsModalOpen(true)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "5%",
              padding: "8px 10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: "white",
              '&:hover': { borderColor: "#888" },
            }}
          >
            <Typography>지역(구)</Typography>
            <Box sx={{ fontSize: "16px", color: "#aaa" }}>▼</Box>
          </Box>

          <Box
            onClick={() => setIsRangeModalOpen(true)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "7%",
              padding: "8px 10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: "white",
              '&:hover': { borderColor: "#888" },
            }}
          >
            <Typography>면적 선택</Typography>
            <Box sx={{ fontSize: "16px", color: "#aaa" }}>▼</Box>
          </Box>

          <Box
            onClick={() => setIsGuaranteeModalOpen(true)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "10%",
              padding: "8px 10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: "white",
              '&:hover': { borderColor: "#888" },
            }}
          >
            <Typography>보증금 선택</Typography>
            <Box sx={{ fontSize: "16px", color: "#aaa" }}>▼</Box>
          </Box>

          <Box
            onClick={() => setIsMonthlyModalOpen(true)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "10%",
              padding: "8px 10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              backgroundColor: "white",
              '&:hover': { borderColor: "#888" },
            }}
          >
            <Typography>월세 선택</Typography>
            <Box sx={{ fontSize: "16px", color: "#aaa" }}>▼</Box>
          </Box>

          <Button variant="contained" onClick={listHandler}>
            검색
          </Button>
          {/* Hashtags */}
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
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
                <Chip label={`#${sizeRange[0]} ~ ${sizeRange[1]} m²`} onDelete={clearSizeRange} />
              )}
              {guaranteeRange.length > 0 && (
                <Chip label={`#${guaranteeRange[0]} ~ ${guaranteeRange[1]}`} onDelete={clearGuaranteeRange} />
              )}
              {monthlyRange.length > 0 && (
                <Chip label={`#${monthlyRange[0]} ~ ${monthlyRange[1]}`} onDelete={clearMonthlyRange} />
              )}
            </Box>
        </Box>
      </Box>

      {/* Result List */}
      <Box sx={{ display: "flex", height: "80vh" }}>
        {/* Left Column - Results (35% width) */}
        <Box
          sx={{
            width: "35%",
            p: 2,
            overflowY: "auto",
            maxHeight: "100%",
          }}
        >
          {results.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",  // Ensuring 2 items per row
                gap: 2,
              }}
            >
              {results.map((item) => (
                <Card key={item.jutaekDtlSn} sx={{ maxWidth: "100%", boxShadow: 3 }}>
                  <Box sx={{ height: 120, backgroundColor: "#e0e0e0" }} />  {/* Placeholder for Image */}
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" fontSize="14px">
                      주택 유형: {item.jutaekType}
                    </Typography>
                    <Typography variant="body2" fontSize="12px">크기: {item.jutaekSize} m²</Typography>
                    <Typography variant="body2" fontSize="12px">보증금: {item.guarantee} 원</Typography>
                    <Typography variant="body2" fontSize="12px">월세: {item.monthly} 원</Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Typography variant="h6" align="center" sx={{ mt: 3, color: "gray" }}>
              검색 결과가 없습니다.
            </Typography>
          )}
        </Box>

        {/* Right Column - Empty Space (65%) for future content */}
        <Box sx={{ width: "65%", backgroundColor: "#f5f5f5", p: 2 }}>
          <Typography variant="h6" align="center" sx={{ color: "gray" }}>
            여기에 추가 콘텐츠가 들어갈 수 있습니다.
          </Typography>
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
        initialMin={minSize}
        initialMax={maxSize}
      />
      <MonthlyRangeModal
        isOpen={isMonthlyModalOpen}
        onClose={() => setIsMonthlyModalOpen(false)}
        handleConfirm={(min, max) => confirmRangeSelection(min, max, "monthly")}
        initialMin={minMonthly}
        initialMax={maxMonthly}
      />
      <GuaranteeRangeModal
        isOpen={isGuaranteeModalOpen}
        onClose={() => setIsGuaranteeModalOpen(false)}
        handleConfirm={(min, max) => confirmRangeSelection(min, max, "guarantee")}
        initialMin={minGuarantee}
        initialMax={maxGuarantee}
      />
      
    </>
  );
};

export default RsltList;