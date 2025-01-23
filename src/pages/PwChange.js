import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Sidebar from "../components/Mypage_SideBar"; // Sidebar 컴포넌트 임포트
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../utils/api';
import { Box, Typography , Button, Paper, TextField, Stack } from '@mui/material';

const PwChange = () => {
    const navigate = useNavigate();
    const [userSn] = useState(1);
    // 상태 변수
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // 비밀번호 변경 핸들러
    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
        alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
        return;
        }

        try {
        // 서버 요청
        const response = await api.post("/change-password", {
            userSn: userSn, // 사용자 고유 번호
            currentPassword,
            newPassword,
        });
        alert("비밀번호가 성공적으로 변경되었습니다!");
        navigate("/Mypage"); // 마이페이지로 이동
        } catch (error) {
        console.error("비밀번호 변경 중 오류 발생:", error);
        alert("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <>
        <Header />
        <Box sx={{ 
            display: 'flex',
            height: '100vh',
            backgroundColor: '#f5f5f5',
            // borderRadius: 5,
            padding: 2 }}>

        {/* Left Sidebar */}
        <Sidebar />

        {/* Right Content */}
        <Paper elevation={2} sx={{ flex: 1, padding: 2, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ marginBottom: 3 }}>
            비밀번호 변경
          </Typography>
          <Stack spacing={3}>
            {/* 현재 비밀번호 */}
            <TextField
              label="현재 비밀번호"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              fullWidth
              variant="outlined"
            />

            {/* 새 비밀번호 */}
            <TextField
              label="새 비밀번호"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              variant="outlined"
            />

            {/* 새 비밀번호 확인 */}
            <TextField
              label="새 비밀번호 확인"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              variant="outlined"
            />

            {/* 비밀번호 변경 버튼 */}
            <Button
              variant="contained"
              color="primary"
              onClick={handlePasswordChange}
              fullWidth
            >
              비밀번호 변경
            </Button>
          </Stack>
        </Paper>
        </Box>
        </>
    );
};

export default PwChange;