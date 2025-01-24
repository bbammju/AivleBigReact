import React, { useState, useEffect } from "react";
import Header from "../components/header";
import api from "../utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, Box, Typography,
    Button,
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
        {tabs.map((tab, index) => (
          <Tab
            key={index}
            label={tab}
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

const Board = () => {
    const tabs = ["공고게시판", "유저게시판", "청약뉴스"];
    const [activeTab, setActiveTab] = useState(0);
    const [data, setData] = useState({ "공고게시판": [
        { no: 1, title: "공고 1", writer: "관리자", date: "2025-01-22", views: 10 },
            { no: 2, title: "공고 2", writer: "관리자", date: "2025-01-21", views: 8 },
            { no: 3, title: "공고 3", writer: "관리자", date: "2025-01-20", views: 6 },
            { no: 4, title: "공고 4", writer: "관리자", date: "2025-01-19", views: 7 },
            { no: 5, title: "공고 5", writer: "관리자", date: "2025-01-18", views: 9 },
    ], 
        "유저게시판": [], 
        "청약뉴스": [
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
            if (tabs[activeTab] === "유저게시판") {
                try {
                    const response = await api.get("/board");
                    const boardListResponse = response.data.boardListResponse;
                    setData((prevData) => ({
                        ...prevData,
                        유저게시판: boardListResponse,
                      }));
                    console.log(boardListResponse);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fetchData();
    }, [activeTab]);

    // 페이지네이션 관련 데이터
    const itemsPerPage = 5;
    const totalPages = Math.ceil((data[tabs[activeTab]]?.length || 0) / itemsPerPage);
    const paginatedData = data[tabs[activeTab]].slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Render detailed post if an ID is provided
    if (tabs[activeTab] === "유저게시판" && id ) {
        const post = data[tabs[activeTab]]?.find((item) => item.boardSn === parseInt(id));

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

            <Box sx={{ mt: 4, width: "80%", margin: "0 auto" }}>
                <Typography variant="h4" gutterBottom>
                {post.title}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                작성자: {post.userName} | 작성일: {post.createdDt}
                </Typography>
                <Typography variant="body1">{post.content}</Typography>
                <Button sx={{ mt: 4 }} variant="contained" onClick={() => navigate("/board")}>
                뒤로가기
                </Button>
            </Box>
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
          {tabs[activeTab]}
        </Typography>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>제목</TableCell>
              <TableCell>글쓴이</TableCell>
              <TableCell>작성일</TableCell>
              {/* <TableCell>조회수</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow key={item.boardSn}  onClick={() => navigate(`/board/${item.boardSn}`)} sx={{ cursor: "pointer" }}>
                <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.userName}</TableCell>
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
      {tabs[activeTab] === "유저게시판" && (
        <>
          {/* 글쓰기 버튼 */}
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button variant="contained" color="primary" sx={{ mr: 2 }}>
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
