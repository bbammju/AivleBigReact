import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import Header from "../components/headersub";
import DistrictModal from "../components/guModal";
import SizeRangeModal from "../components/sizeRangeModal";
import GuaranteeRangeModal from "../components/guaranteeModal";
import MonthlyRangeModal from "../components/monthlyModal";
import NaverMap from "../components/navermap";
import { useStore } from "../zustand/store";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
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
      const response = await api.get("/jutaek-dtl", { params: { jutaekDtlSn: sn, userSn: userSn, gongoSn: gongoSn } } );
      
      if (response.data) {
        setDtlData(response.data.data);
        setLat(response.data.data.latitude)
        setLng(response.data.data.longitude)
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const favHandler = async (jutaekDtlSn) => {
    const params = {
      userSn,
      gongoSn,
      jutaekDtlSn, // this parameter controls each data's unique identifier
    };

    try {
      const response = await api.post("/fav-ctl", params);
      if (response.data) {
        // Optionally update UI (for example, toggle favYn in your state)
        setResults((prevResults) =>
          prevResults.map((item) =>
            item.jutaekDtlSn === jutaekDtlSn
              ? { ...item, favYn: item.favYn === "Y" ? "N" : "Y" }
              : item
          )
        );
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
              "&:hover": { borderColor: "#888" },
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
              "&:hover": { borderColor: "#888" },
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
              "&:hover": { borderColor: "#888" },
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
              "&:hover": { borderColor: "#888" },
            }}
          >
            <Typography>월임대료 선택</Typography>
            <Box sx={{ fontSize: "16px", color: "#aaa" }}>▼</Box>
          </Box>

          <Button variant="contained" onClick={listHandler}>
            검색
          </Button>
          {/* Hashtags */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 2 }}>
            {/* Location chips */}
            {location.map((loc, index) => (
              <Chip
                key={index}
                label={`#${loc}`}
                onDelete={() => {
                  setLocation((prev) => prev.filter((item) => item !== loc));
                  setSelectedDistricts((prev) => prev.filter((item) => item !== loc));
                }}
                sx={{ backgroundColor: "#ABE7FE" }} // 지역(구) 색상
              />
            ))}

            {/* Size range chips */}
            {sizeRange.length > 0 && (
              <Chip
                label={`#${sizeRange[0]} ~ ${sizeRange[1]} m²`}
                onDelete={clearSizeRange}
                sx={{ backgroundColor: "#ABD2FE" }} // 면적 색상
              />
            )}

            {/* Guarantee range chips */}
            {guaranteeRange.length > 0 && (
              <Chip
                label={`#${Number(guaranteeRange[0]).toLocaleString()}원 ~ ${Number(guaranteeRange[1]).toLocaleString()}원`}
                onDelete={clearGuaranteeRange}
                sx={{ backgroundColor: "#ABC2FE" }} // 보증금 색상
              />
            )}

            {/* Monthly range chips */}
            {monthlyRange.length > 0 && (
              <Chip
                label={`#${Number(monthlyRange[0]).toLocaleString()}원 ~ ${Number(monthlyRange[1]).toLocaleString()}원`}
                onDelete={clearMonthlyRange}
                sx={{ backgroundColor: "#ABB4FE" }} // 월임대료 색상
              />
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
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
              }}
            >
              {results.map((item) => {
                // Calculate the difference between inputWholeScore and qtyPred
                const diff = item.inputWholeScore - item.qtyPred;
                const absDiff = Math.abs(diff);
                return (
                  <Card
                  key={item.jutaekDtlSn}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: 3,
                    cursor: "pointer",
                    height: "27vh", // Set a fixed height for the card (adjust as needed)
                  }}
                  onClick={() => dtlHandler(item.jutaekDtlSn)}
                >
                  {/* Top content area */}
                  <Box>
                    {/* Star icon at the top-right (still using absolute if needed) */}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        zIndex: 2,
                        cursor: "pointer",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        favHandler(item.jutaekDtlSn);
                      }}
                    >
                      {item.favYn === "Y" ? (
                        <StarIcon sx={{ color: "yellow" }} />
                      ) : (
                        <StarBorderIcon sx={{ color: "black" }} />
                      )}
                    </Box>
                
                    {/* Image area */}
                    <Box
                      sx={{
                        height: 120,
                        backgroundImage:
                          item.jutaekImg && item.jutaekImg.length > 0
                            ? `url(${item.jutaekImg[0]})`
                            : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                
                    {/* Card content */}
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" fontSize="14px">
                        {item.jutaekName} {item.jutaekType}
                      </Typography>
                      <br />
                      <Typography variant="body2" fontSize="12px">
                        {diff === 0 ? (
                          "내 순위와 동일합니다"
                        ) : (
                          <>
                            내 순위와{" "}
                            <span style={{ color: diff < 0 ? "red" : "green" }}>
                              {diff > 0 ? `+${absDiff}` : `-${absDiff}`}점
                            </span>{" "}
                            차이납니다
                          </>
                        )}
                      </Typography>
                    </CardContent>
                  </Box>
                
                  {/* Bottom reserved area for structureScore */}
                  <Box
                    sx={{
                      height: 20, // Fixed height for the bottom area
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      px: 1, // horizontal padding
                    }}
                  >
                    {item.structureScore !== "" && (
                      <Typography variant="body2" sx={{ color: "#7FB3FA", fontWeight: "bold" }}>
                        구조도점수 : {item.structureScore} / 5
                      </Typography>
                    )}
                  </Box>
                </Card>
                );
              })}
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
          <Box sx={{ width: "96%", height: "65vh", backgroundColor: "#f5f5f5", p: 2, mt: 2 }}>
            {loading ? (
              <Typography>로딩 중...</Typography>
            ) : dtlData ? (
              <NaverMap long={lng} lat={lat} />
            ) : (
              <Typography>주택을 선택해주세요.</Typography>
            )}
          </Box>

          {/* Housing Details Section */}
          <Box
            sx={{
              width: "96%",
              p: 2,
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: 2,
            }}
          >
            {dtlData ? (
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      보증금
                    </Typography>
                    <Typography variant="body2">
                      {dtlData.guarantee ? `${Number(dtlData.guarantee).toLocaleString()} 원` : "정보 없음"}
                    </Typography>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      월임대료
                    </Typography>
                    <Typography variant="body2">
                      {dtlData.monthly ? `${Number(dtlData.monthly).toLocaleString()} 원` : "정보 없음"}
                    </Typography>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      실제 넓이
                    </Typography>
                    <Typography variant="body2">
                      {dtlData.jutaekSize ? `넓이: ${dtlData.jutaekSize} m²` : "정보 없음"}
                    </Typography>
                </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight="bold">
                      인프라점수
                    </Typography>
                    <Typography variant="body2">
                      {dtlData.infraScore ? `${dtlData.infraScore} / 5 점` : "정보 없음"}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
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