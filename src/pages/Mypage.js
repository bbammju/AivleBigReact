import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import Header from '../components/header';
import api from '../utils/api';
import MyPageMainLayout from '../components/MypageLayout';

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get('/users/mypage');
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
    fetchUserInfo();
  }, []);

  return (
    <>
      <Header />
      <MyPageMainLayout>
        {loading ? (
          <Typography>사용자 정보를 불러오는 중...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : userInfo ? (
          <Box>
            <Typography variant="h5" sx={{ mb: 4, color: '#1e293b', fontWeight: 600 }}>
              기본 정보
            </Typography>
            <Box sx={{ p: 3, backgroundColor: '#f8fafc', borderRadius: 1 }}>
              <Typography variant="h6" sx={{ color: '#334155', mb: 2 }}>
                {userInfo.userName || "이름 정보 없음"}님, 환영합니다!
              </Typography>
              <Typography sx={{ color: '#64748b' }}>
                이메일: {userInfo.email || "이메일 정보 없음"}
              </Typography>
            </Box>
          </Box>
        ) : null}
      </MyPageMainLayout>
    </>
  );
};

export default MyPage;
