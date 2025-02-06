import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Container } from "@mui/material";
import Header from "../components/headersub";
import Sidebar from "../components/Mypage_SideBar";
import api from '../utils/api';

const MyPage = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 사용자 정보 가져오는 함수
    const fetchUserInfo = async () => {
        try {
          const response = await api.get('/users/mypage')
          // 서버에서 받은 데이터를 상태에 설정
          if (response.data.resultCode === 200) {
            setUserInfo(response.data.data);
          } else {
            setError(response.data.resultMsg);
          }
        } catch (error) {
          setError(error.response?.data?.resultMsg || '사용자 정보를 불러오는 중 오류가 발생했습니다.');
        } finally {
          setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserInfo(); // 컴포넌트 마운트 시 사용자 정보 가져오기
    }, []);

    return (
      <>
          <Header />
          <Box sx={{ 
              display: "flex", 
              minHeight: "100vh", 
              backgroundColor: "#f8fafc",  // 조금 더 부드러운 회색 배경
              pt: 8  // 헤더 높이만큼 상단 패딩
          }}>
              {/* Left Sidebar */}
              <Sidebar />

              {/* Main Content */}
              <Container maxWidth="lg" sx={{ py: 3 }}>
                  <Paper
                      elevation={0}  // 그림자 제거
                      sx={{
                          flex: 1,
                          padding: 4,
                          borderRadius: 2,
                          backgroundColor: "white",
                          border: '1px solid #e2e8f0',  // 섬세한 보더 추가
                      }}
                  >
                      <Typography 
                          variant="h4" 
                          sx={{ 
                              mb: 4,
                              color: '#1e293b',  // 진한 회색으로 제목 강조
                              fontWeight: 600
                          }}
                      >
                          마이페이지
                      </Typography>
                      {loading ? (
                          <Typography>사용자 정보를 불러오는 중...</Typography>
                      ) : error ? (
                          <Typography color="error">{error}</Typography>
                      ) : userInfo ? (
                          <Box sx={{ 
                              p: 3, 
                              backgroundColor: '#f8fafc',  // 내부 컨텐츠 영역 구분
                              borderRadius: 1
                          }}>
                              <Typography 
                                  variant="h6" 
                                  sx={{ 
                                      color: '#334155',
                                      fontWeight: 500 
                                  }}
                              >
                                  {userInfo.userName || "이름 정보 없음"}님, 환영합니다!
                              </Typography>
                              <Typography 
                                  variant="body1" 
                                  sx={{ 
                                      mt: 2,
                                      color: '#64748b'  // 부드러운 회색으로 보조 텍스트
                                  }}
                              >
                                  이메일: {userInfo.email || "이메일 정보 없음"}
                              </Typography>
                          </Box>
                      ) : null}
                  </Paper>
              </Container>
          </Box>
      </>
  );
};


export default MyPage;
