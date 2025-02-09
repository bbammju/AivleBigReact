import React, { useEffect, useState } from 'react';
import { Typography, Box, Button, Avatar } from '@mui/material';
import Header from '../components/header';
import api from '../utils/api';
import MyPageMainLayout from '../components/MypageLayout';

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get('/users/mypage');
        if (response.data.resultCode === 200) {
          setUserInfo(response.data.data);
          setProfileImage(response.data.data.profileImage); // 프로필 이미지 추가
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

    // ✅ 파일 선택 후 업로드
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
    
        const formData = new FormData();
        formData.append('userSn', userInfo?.userSn);
        formData.append('profileImage', file);
    
        try {
          setUploading(true);
          const response = await api.post('/users/profile-image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
    
          if (response.data.resultCode === 200) {
            setProfileImage(response.data.data.profileImage); // 새로운 이미지로 업데이트
          } else {
            alert('프로필 이미지 업로드 실패: ' + response.data.resultMsg);
          }
        } catch (error) {
          alert('이미지 업로드 중 오류 발생: ' + error.response?.data?.resultMsg);
        } finally {
          setUploading(false);
        }
      };

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
                  {/* ✅ 프로필 이미지 표시 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={profileImage} sx={{ width: 80, height: 80 }} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      disabled={uploading}
                      style={{ display: 'none' }}
                      id="upload-profile"
                    />
                    <label htmlFor="upload-profile">
                      <Button component="span" variant="contained" disabled={uploading}>
                        {uploading ? '업로드 중...' : '프로필 변경'}
                      </Button>
                    </label>
                  </Box>
    
                  <Typography variant="h6" sx={{ color: '#334155', mt: 2 }}>
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
