import React, { useState } from "react";
import Header from "../components/header";
import { Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, Box, Typography } from "@mui/material";

const Board = () => {
    const [activeTab, setActiveTab] = useState("공고게시판");
    const tabs = ["공고게시판", "유저게시판", "청약뉴스"];
    const data = {
        공고게시판: [
        { no: 1, title: "공고 1", writer: "관리자", date: "2025-01-22", views: 10 },
        { no: 2, title: "공고 2", writer: "관리자", date: "2025-01-21", views: 8 },
        ],
        유저게시판: [
        { no: 1, title: "유저 글 1", writer: "유저1", date: "2025-01-20", views: 15 },
        { no: 2, title: "유저 글 2", writer: "유저2", date: "2025-01-19", views: 5 },
        ],
        청약뉴스: [
        { no: 1, title: "청약 뉴스 1", writer: "기자1", date: "2025-01-18", views: 12 },
        { no: 2, title: "청약 뉴스 2", writer: "기자2", date: "2025-01-17", views: 20 },
        ],
    };

  return (
    <>
      <Header />
      <Box sx={{ width: "80%", margin: "0 auto", textAlign: "center", mt: 4 }}>
      {/* 탭 영역 */}
      <Tabs
        value={activeTab}
        onChange={(event, newValue) => setActiveTab(newValue)}
        centered
        indicatorColor="primary"
        textColor="primary"
      >
        {tabs.map((tab, index) => (
          <Tab key={index} label={tab} />
        ))}
      </Tabs>

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
              <TableCell>조회수</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data[tabs[activeTab]]?.map((item) => (
              <TableRow key={item.no}>
                <TableCell>{item.no}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.writer}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.views}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
    </>
  );
};

export default Board;
