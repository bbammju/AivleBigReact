import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Container } from "@mui/material";
import Header from "../components/header";
import Sidebar from "../components/Mypage_SideBar";
import Footer from '../components/footer';
import api from '../utils/api';
import apartmentImage from '../assets/apartmentimage.png';

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
          {/* Banner Section */}
          <Box
            sx={{
                width: '100%',
                height: '380px',
                position: 'relative',
                background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${apartmentImage})`, // 불투명도 0.3 -> 0.7로 증가
                backgroundSize: 'cover',
                backgroundPosition: 'top', // 배경 이미지 focus 위치
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&::before': {  // 추가적인 어두운 오버레이
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(2px)',  // 블러 효과 추가
                }
            }}
        >
              <Typography
                variant="h4"  // h3 -> h4로 변경하여 크기 조정
                sx={{
                    color: 'white',
                    fontWeight: 500,  // bold -> 500으로 변경하여 좀 더 가벼운 굵기
                    position: 'absolute',  // 절대 위치로 변경
                    bottom: 40,  // 하단에서의 거리
                    left: 40,   // 왼쪽에서의 거리
                    zIndex: 1,
                    letterSpacing: '0.05em',  // 자간 추가
                    fontSize: '2.2rem',  // 폰트 크기 직접 지정
                    '&::after': {  // 밑줄 효과 추가
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: '100%',
                        height: 3,
                        backgroundColor: 'black',
                        opacity: 0.7
                    }
                }}
            >
                  마이페이지
              </Typography>
          </Box>

          {/* Content Section */}
          <Box sx={{ 
              display: "flex", 
              backgroundColor: "#f8fafc",
              minHeight: 'calc(100vh - 380px)', // 배너 높이만큼 뺌
              py: 6, // 상하 패딩 추가가
          }}>
              {/* Left Sidebar */}
              <Box sx={{ 
                  width: 240, 
                  backgroundColor: 'white',
                  borderRight: '1px solid #e2e8f0',
                  minHeight: '600px',
              }}>
                  <Sidebar />
              </Box>

              {/* Main Content */}
              <Box sx={{ flex: 1,
                         p: 4,
                         minHeight: '600px', //최소 높이 설정정
                         }}>
                  <Container maxWidth="lg">
                      <Paper
                          elevation={0}
                          sx={{
                              padding: 4,
                              borderRadius: 2,
                              backgroundColor: "white",
                              border: '1px solid #e2e8f0',
                              minHeight: '500px', // 최소 높이 설정
                          }}
                      >
                          {loading ? (
                              <Typography>사용자 정보를 불러오는 중...</Typography>
                          ) : error ? (
                              <Typography color="error">{error}</Typography>
                          ) : userInfo ? (
                              <Box>
                                  <Typography 
                                      variant="h5" 
                                      sx={{ 
                                          mb: 4,
                                          color: '#1e293b',
                                          fontWeight: 600
                                      }}
                                  >
                                      기본 정보
                                  </Typography>
                                  <Box sx={{ 
                                      p: 3, 
                                      backgroundColor: '#f8fafc',
                                      borderRadius: 1
                                  }}>
                                      <Typography variant="h6" sx={{ color: '#334155', mb: 2 }}>
                                          {userInfo.userName || "이름 정보 없음"}님, 환영합니다!
                                      </Typography>
                                      <Typography sx={{ color: '#64748b' }}>
                                          이메일: {userInfo.email || "이메일 정보 없음"}
                                      </Typography>
                                  </Box>
                              </Box>
                          ) : null}
                      </Paper>
                  </Container>
              </Box>
          </Box>
          <Footer />
      </>
  );
};

export default MyPage;
