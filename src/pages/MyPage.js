import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography } from "@mui/material";
import Header from "../components/header";
import Sidebar from "../components/Mypage_SideBar";
import api from '../utils/api';

const MyPage = () => {
    const [user, setUserInfo] = useState({
        userName: '',
        email: ''
    }); // 사용자 정보 상태
    const [userSn] = useState(2);

    // 사용자 정보 가져오는 함수
    const fetchUserInfo = async () => {
        try {
        const response = await api.get(`/mypage?userSn=${userSn}`, {
            // params: { userSn: 2 }, // 예제: userSn 2번 사용자
        });
        // 서버에서 받은 데이터를 상태에 설정
        const userInfo = response.data;
        setUserInfo({
            userName: userInfo.userName,
            email: userInfo.email
        });
        } catch (error) {
        console.error("사용자 정보를 가져오는 중 오류 발생:", error);
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
          {user ? (
            <>
              <Typography variant="h6">
                {user.userName || "이름 정보 없음"}님, 환영합니다!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                이메일: {user.email || "이메일 정보 없음"}
              </Typography>
            </>
          ) : (
            <Typography>사용자 정보를 불러오는 중...</Typography>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default MyPage;
