// src/components/BoardForm.js
import React, { useState } from 'react';
import api from '../utils/api';
import Header from "../components/header";
import { Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, Box, Typography,
    Button, Paper,
  Pagination,
 } from "@mui/material";
 import CustomTabs from '../pages/Board';
 import { useNavigate, useParams } from "react-router-dom";

const BoardForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [userSn] = useState(2);
  const navigate = useNavigate();

  // const [file, setFile] = useState(null); // 파일 상태 추가
  const tabs = [
    { id: "gongo", label: "공고게시판" },
    { id: "user", label: "유저게시판" },
    { id: "news", label: "청약뉴스" }
  ];
  const [activeTab, setActiveTab] = useState('user');
  const [currentPage, setCurrentPage] = useState(1);

  // const handleFileChange = (event) => {
  //   const selectedFile = event.target.files[0];
  //   setFile(selectedFile);
  //   console.log("선택된 파일:", selectedFile);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const postData = { title, content, userSn };

    try {
      const response = await api.post('/post-board', postData,
        { headers: { 'Content-Type': 'application/json' },
      });

      if (response.status === 200 || response.status === 201) {
        alert('게시글이 등록되었습니다!');
        setTitle('');
        setContent('');
        // 게시글 등록 성공 후 /board 페이지로 리다이렉트
        navigate('/board', { state: { activeTab: 'user' } });
      } else {
        alert('게시글 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('오류가 발생했습니다.');
    }
  };

  return (
    <>
    <Header />
    <Box sx={{ width: "80%", margin: "0 auto", textAlign: "center", mt: 4,
        }}>
      <Box >
      {/* <CustomTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setCurrentPage={setCurrentPage}
      /> */}
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
          {activeTab === "user" && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                {tabs.find((tab) => tab.id === activeTab)?.label || ""}
              </Typography>
            </Box>
          )}
        
        
    </Box>
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
          
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>게시글 작성</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          {/* style={{left}} label 왼쪽으로 바꾸기 */}
          <label  htmlFor="title">제목:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            required
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="content">내용:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{ width: '100%', height: '200px', padding: '8px', marginTop: '5px' }}
            required
          ></textarea>
        </div>
        <button type="submit" style={{ padding: '10px 15px' }}>
          게시글 등록
        </button>
      </form>
    </div>
    </Paper>
    </Box>
    </>
  );
};

export default BoardForm;
