import React, { useState, useEffect } from "react";
import Header from "../components/header";
import api from "../utils/api";
import { useNavigate, useParams, useLocation  } from "react-router-dom";
import { Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, Box, Typography,
    Button, Paper,
  Pagination,
 } from "@mui/material";

// CustomTabs 컴포넌트
const CustomTabs = ({ tabs, activeTab, setActiveTab, setCurrentPage }) => {

    return (
      <Tabs
        value={activeTab}
        onChange={(event, newValue) => {
          setActiveTab(newValue);
          setCurrentPage(1);
        }}
        centered
        indicatorColor="primary"
        textColor="primary"
        sx={{
          width: "80%",
          margin: "0 auto",
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.label}
            value={tab.id}
            sx={{
              fontSize: "1.5rem",
              padding: "15px",
              minWidth: "150px",
            }}
          />
        ))}
      </Tabs>
    );
  };
  
  function sanitizeHtml(content) {
    return content
      .replace(/<p>\s*<\/p>/g, '')  // 빈 <p> 태그 제거
      .replace(/<\/?p>/g, '<br>')   // <p> 태그를 줄바꿈으로 변환
      .replace(/<(?!img)[^>]+>/g, '');  // img 태그 외 모든 태그 제거
  }
  
  
const Board = () => {
    // const tabs = ["공고게시판", "유저게시판", "청약뉴스"];
    const location = useLocation();
    const tabs = [
      { id: "gongo", label: "공고게시판" },
      { id: "user", label: "유저게시판" },
      { id: "news", label: "청약뉴스" }
    ];
    
    // tab.id
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'gongo');
    const [data, setData] = useState({ "gongo": [],
        "user": [], 
        "news": [
            { no: 1, title: "청약 뉴스 1", writer: "기자1", date: "2025-01-18", views: 12 },
            { no: 2, title: "청약 뉴스 2", writer: "기자2", date: "2025-01-17", views: 20 },
            { no: 3, title: "청약 뉴스 3", writer: "기자3", date: "2025-01-16", views: 8 },
            { no: 4, title: "청약 뉴스 4", writer: "기자4", date: "2025-01-15", views: 14 },
            { no: 5, title: "청약 뉴스 5", writer: "기자5", date: "2025-01-14", views: 18 },
        ] });
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            if (activeTab === "user") {
                try {
                    const response = await api.get("/board");
                    const boardListResponse = response.data.boardListResponse;
                    setData((prevData) => ({
                        ...prevData,
                        user:  boardListResponse || [],
                      }));
                    console.log(boardListResponse);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            } else if (activeTab === "gongo") {
              try {
                  const response = await api.get("/gongoboard");
                  const gongoListResponse = response.data.gongoListResponse;
                  setData((prevData) => ({
                      ...prevData,
                      gongo:  gongoListResponse || [],
                    }));
                  // console.log(gongoListResponse);
              } catch (error) {
                  console.error("Error fetching data:", error);
              }
          }
        };
        fetchData();
    }, [activeTab]);

    // 페이지네이션 관련 데이터
    const itemsPerPage = 5;
    const activeTabData = data[activeTab] || [];
    const totalPages = Math.ceil((activeTabData.length) / itemsPerPage);
    const paginatedData = activeTabData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Render detailed post if an ID is provided
    if (activeTab === "user" && id ) {
        
        const post = data[activeTab]?.find((item) => item.boardSn === parseInt(id));
        if (!post) return <Typography>Loading...</Typography>;

        return (
            <>
            <Header />
            <Box sx={{ width: "80%", margin: "0 auto", textAlign: "center", mt: 4,
             }}>
            <CustomTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setCurrentPage={setCurrentPage}
            />
          <Paper
            elevation={2}
            sx={{
              flex: 1,
              padding: 4,
              borderRadius: 3,
              margin: 2,
              backgroundColor: "white",
            }}
          >
            <Box sx={{ mt: 4, width: "80%", margin: "0 auto" }}>
                <Typography variant="h4" gutterBottom>
                {post.title}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                작성자: {post.userName} | 작성일: {post.createdDt}
                </Typography>
                <Typography variant="body1">
                  {/* {stripHtml(post.content) */}
                  <div
                    style={{ whiteSpace: 'pre-wrap' }}
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
                  />
                  </Typography>
                <Button sx={{ mt: 4 }} variant="contained" onClick={() => navigate("/board")}>
                뒤로가기
                </Button>
            </Box>
            </Paper>
        </Box>
        </>
        );
    }

    // 공고게시물 클릭시시
    if (activeTab === "gongo" && id ) {
      const post = data[activeTab]?.find((item) => item.gongoSn === parseInt(id));
      if (!post) return <Typography>Loading...</Typography>;

      return (
          <>
          <Header />
          <Box sx={{ width: "80%", margin: "0 auto", textAlign: "center", mt: 4,
           }}>
          <CustomTabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              setCurrentPage={setCurrentPage}
          />
        <Paper
          elevation={2}
          sx={{
            flex: 1,
            padding: 4,
            borderRadius: 3,
            margin: 2,
            backgroundColor: "white",
          }}
        >
          <Box sx={{ mt: 4, width: "80%", margin: "0 auto" }}>
              <Typography variant="h4" gutterBottom>
                {post.gongoName}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                공고 유형: {post.gongoType}
            </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                작성일: {post.createdDt}
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
              시작일: {post.scheduleStartDt} | 종료일: {post.scheduleEndDt}
            </Typography>
              <Button sx={{ mt: 4 }} variant="contained" onClick={() => navigate("/board")}>
              뒤로가기
              </Button>
          </Box>
          </Paper>
      </Box>
      </>
      );
  }

  return (
    <>
      <Header />
      <Box sx={{ width: "80%", margin: "0 auto", textAlign: "center", mt: 4 }}>

      <CustomTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setCurrentPage={setCurrentPage}
      />

      {/* 게시판 내용 */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
        {tabs.find((tab) => tab.id === activeTab)?.label || ""}
        </Typography>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>제목</TableCell>
              {activeTab === "user" && <TableCell>글쓴이</TableCell>}
              <TableCell>작성일</TableCell>
              {/* <TableCell>조회수</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow 
              key={activeTab === "gongo" ? item.gongoSn : item.boardSn}
              onClick={() => {
                if (activeTab === "gongo") {
                  navigate(`/gongoboard/${item.gongoSn}`);
                } else {
                  navigate(`/board/${item.boardSn}`);
                }
              }}
                sx={{ cursor: "pointer" }}
              >
                <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{activeTab === "gongo" ? item.gongoName : item.title}</TableCell>
                {activeTab === "user" && <TableCell>{item.userName}</TableCell>}
                <TableCell>{item.createdDt}</TableCell>
                {/* <TableCell>{item.views}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* 페이지네이션 */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              color="primary"
            />
          </Box>
      </Box>
      
      {/* 유저게시판 탭일 때만 글쓰기 버튼 표시 */}
      {activeTab === "user" && (
        <>
          {/* 글쓰기 버튼 */}
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button variant="contained" color="primary" 
            onClick={() => navigate("/boardform")}
            sx={{ mr: 2 }} >
              글쓰기
            </Button>
          </Box>
        </>
      )}
    </Box>
    </>
  );
};

export default Board;
