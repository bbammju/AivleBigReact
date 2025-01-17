import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/zipline.png';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Alert  
} from '@mui/material'; 
import LoginModal from './LoginModal';


const Header = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  // 로그인 상태와 사용자 정보를 위한 state 추가
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const handleLogoClick = () => {
    navigate('/main'); // 메인페이지로 이동동
  }

  useEffect(() => {
    // 컴포넌트가 마운트될 때 로그인 상태 확인
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    setShowAlert(true); // Alert 표시시
    // 3초 후 Alert 숨기기
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
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
                marginRight: 2,
                cursor: 'pointer' 
              }}
              onClick={handleLogoClick}
            />
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
              <Button color="inherit">청약정보</Button>
              <Button color="inherit">청약일정</Button>
              <Button color="inherit">커뮤니티</Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
            {isLoggedIn ? (
                // 로그인된 경우
                <>
                  <Typography sx={{ alignSelf: 'center', color: 'white' }}>
                    {user?.userName}님
                  </Typography>
                  <Button 
                    color="inherit"
                    onClick={handleLogout}
                  >
                    로그아웃
                  </Button>
                </>
              ) : (
                // 로그인되지 않은 경우
                <>
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