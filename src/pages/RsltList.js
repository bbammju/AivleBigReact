import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import Header from "../components/headersub";
import DistrictModal from "../components/guModal";
import SizeRangeModal from "../components/sizeRangeModal";
import GuaranteeRangeModal from "../components/guaranteeModal";
import MonthlyRangeModal from "../components/monthlyModal";
import NaverMap from "../components/navermap";
import { useStore } from '../zustand/store';
import { Box, Button, Typography, Chip, Card, CardContent, CardMedia, Pagination } from "@mui/material";

const seoulDistricts = [
  "강남구", "강동구", "강북구", "강서구", "관악구",
  "광진구", "구로구", "금천구", "노원구", "도봉구",
  "동대문구", "동작구", "마포구", "서대문구", "서초구",
  "성동구", "성북구", "송파구", "양천구", "영등포구",
  "용산구", "은평구", "종로구", "중구", "중랑구"
];

const RsltList = () => {
  const navigate = useNavigate();
  const { gongoSn, userSn } = useStore();
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
  const [results, setResults] = useState([]); 
  const [dtlData, setDtlData] = useState(); 
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lat, setLat] = useState();
  const [lng, setLng] = useState();
  const [totalPages, setTotalPages] = useState(1);

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
    userSn,
    gongoSn,
    location,
    ...(minSize && { minSize }),
    ...(maxSize && { maxSize }),
    ...(minGuarantee && { minGuarantee }),
    ...(maxGuarantee && { maxGuarantee }),
    ...(minMonthly && { minMonthly }),
    ...(maxMonthly && { maxMonthly }),
  };

  const jutaekDtlSn = {
    pageSize
  };

  const listHandler = async () => {
    try {
      const response = await api.post("/rslt-list", params);
      if (response.data) {
        setResults(response.data.data);
        // Calculate total pages using totalCount
        const totalCount = response.data.totalCount || 0;
        setTotalPages(Math.ceil(totalCount / pageSize));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const dtlHandler = async (sn) => {
    try {
      const response = await api.get("/jutaek-dtl", { params: { jutaekDtlSn: sn } } );
      
      if (response.data) {
        setDtlData(response.data.data);
        setLat(response.data.data.latitude)
        setLng(response.data.data.longitude)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    listHandler();
    // Get user location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
          setLoading(false);
        },
        (error) => {
          console.error("Error getting user location:", error);
          setLoading(false);
        }
      );
    } else {
      console.error("Geolocation is not supported");
      setLoading(false);
    }
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
              width: "8%",
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
              width: "8%",
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
      <Box sx={{ display: "flex", height: "85vh" }}>
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
                <Card
                  key={item.jutaekDtlSn}
                  sx={{ maxWidth: "100%", boxShadow: 3, cursor: "pointer" }}
                  onClick={() => dtlHandler(item.jutaekDtlSn)}
                >
                  <Box
                    sx={{
                      height: 120,
                      backgroundImage: item.jutaekImg && item.jutaekImg.length > 0 
                        ? `url(${item.jutaekImg[0]})`
                        : "none",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  />
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

            {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Pagination
              count={totalPages}
              page={pageNum}
              onChange={(event, value) => setPageNum(value)}
              color="primary"
            />
          </Box>
        </Box>

      
        {/* Right Column - Naver Map (65%) */}
        <div style={{ display: "flex", flexDirection: "column", width: "65%", margin: "0 auto", gap: "16px" }}>
          {/* Map Section */}
          <Box sx={{ width: "96%", height: "60vh", backgroundColor: "#f5f5f5", p: 2, mt: 2 }}>
            {loading ? (
              <Typography>로딩 중...</Typography>
            ) : dtlData ? (
              <>
                <NaverMap long={lng} lat={lat} />
              </>
            ) : (
              <Typography>주택을 선택해주세요.</Typography>
            )}
          </Box>

          {/* Housing Details Section */}
          <Box sx={{ width: "96%", p: 2, backgroundColor: "white", borderRadius: "8px", boxShadow: 2 }}>
            {dtlData ? (
              <>
                <Typography variant="h6" fontWeight="bold">
                  {dtlData.jutaekName}
                </Typography>
                <Typography variant="body1">주소: {dtlData.jutaekAddress}</Typography>
                <Typography variant="body1">크기: {dtlData.jutaekSize} m²</Typography>
                <Typography variant="body1">주거 면적: {dtlData.residentialArea} m²</Typography>
                <Typography variant="body1">공용 면적: {dtlData.commonArea} m²</Typography>
                <Typography variant="body1">기타 면적: {dtlData.otherArea} m²</Typography>
                <Typography variant="body1">보증금: {dtlData.guarantee ? `${dtlData.guarantee} 원` : "정보 없음"}</Typography>
                <Typography variant="body1">월세: {dtlData.monthly ? `${dtlData.monthly} 원` : "정보 없음"}</Typography>
              </>
            ) : (
              <Typography>주택 정보를 확인하려면 지도를 클릭하세요.</Typography>
            )}
          </Box>
        </div>
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