import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from "@mui/material";
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
      <Box sx={{ display: "flex", height: "100vh", backgroundColor: "#f5f5f5" }}>
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content */}
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
          <Typography variant="h4" sx={{ mb: 3 }}>
            마이페이지
          </Typography>
            {loading ? (
              <Typography>사용자 정보를 불러오는 중...</Typography>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : userInfo ? (
              <>
                <Typography variant="h6">
                  {userInfo.userName || "이름 정보 없음"}님, 환영합니다!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  이메일: {userInfo.email || "이메일 정보 없음"}
                </Typography>
              </>
            ) : null}
        </Paper>
      </Box>
    </>
  );
};

export default MyPage;
