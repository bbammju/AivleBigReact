import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/zipline.png';
import { useStore } from '../zustand/store';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Alert,
  Menu,
  MenuItem,
  Avatar,
  Stack  
} from '@mui/material'; 
import LoginModal from './LoginModal';
import api from '../utils/api';

const Header = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // 로그인 상태와 사용자 정보를 위한 state 추가
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { gongoName } = useStore();
  const [user, setUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  // 드롭다운 메뉴를 위한 state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // 아바타 색상 생성 함수
  const stringToColor = (string) => {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  // 아바타 속성 생성 함수
  const stringAvatar = (name) => {
    return {
      sx: {
        bgcolor: stringToColor(name),
        cursor: 'pointer',
      },
      children: name[0], // 이름의 첫 글자만 사용
    };
  };

  const handleLogoClick = () => {
    navigate('/'); // 메인페이지로 이동동
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    setAnchorEl(null);
  };

  const handleMyPage = () => {
    navigate('/mypage');
    handleMenuClose();
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로그인 상태 확인
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      // 로그아웃 API 호출
      await api.post('/users/logout');

      // 로그아웃 성공 시 클라이언트 처리 (현재는 무조건 성공 응답, 추후 redis등 고도화 시 변경)
      localStorage.removeItem('user'); // 사용자 정보 삭제
      localStorage.removeItem('accessToken'); // 액세스 토큰 삭제
      localStorage.removeItem('refreshToken'); // 리프레시 토큰 삭제
      setIsLoggedIn(false);
      setUser(null);

      // 성공 알림 표시
      setShowAlert(true); // Alert 표시
      handleMenuClose(); // 메뉴 닫기    
      // 3초 후 Alert 숨기기
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      navigate('/');
    } catch (error) {   
      console.error('로그아웃 중 오류 발생:', error);
      alert('로그아웃 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      handleMenuClose(); // 메뉴 닫기
    }
  };

  return (
    <>
      {/* Alert 컴포넌트 추가 */}
      {showAlert && (
        <Alert 
          severity="success"
          sx={{ 
            position: 'fixed', 
            top: 20, 
            left: '50%', 
            transform: 'translateX(-50%)',
            zIndex: 9999,
            boxShadow: 2
          }}
        >
          로그아웃 되었습니다.
        </Alert>
      )}
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar>
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{ 
                height: 50,
                cursor: 'pointer' 
              }}
              onClick={handleLogoClick}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Typography color="inherit"
            sx={{ fontWeight: 'bold',whiteSpace: 'nowrap',textAlign: 'center',
              flexGrow: 1,marginRight: 'auto', }}
          >
            {gongoName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isLoggedIn ? (
                <>
                  {/* 커뮤니티 버튼 */}
                  <Button 
                    color="inherit"
                    onClick={() => navigate('/community')} // 나중에 커뮤니티 주소
                  >
                    커뮤니티
                  </Button>

                  {/* 사용자 이름 및 아바타 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography color="inherit">
                      {user?.userName}님
                    </Typography>
                    <Avatar
                      {...stringAvatar(user?.userName || '')}
                      onClick={handleMenuClick}
                    />
                  </Box>

                  {/* 드롭다운 메뉴 */}
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <MenuItem onClick={() => {
                      navigate('/mypage');
                      handleMenuClose();
                    }}>
                      마이페이지
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      로그아웃
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  {/* 비로그인 상태 */}
                  <Button 
                    color="inherit"
                    onClick={() => navigate('/signup')}
                  >
                    회원가입
                  </Button>
                  <Button 
                    color="inherit"
                    onClick={() => setIsLoginModalOpen(true)}
                  >
                    로그인
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <LoginModal 
        open={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default Header;