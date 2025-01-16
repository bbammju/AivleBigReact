import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/zipline.png';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container
} from '@mui/material'; 
import LoginModal from './LoginModal';

const Header = () => {
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar>
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{ height: 50, marginRight: 2 }}
            />
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
              <Button color="inherit">청약정보</Button>
              <Button color="inherit">청약일정</Button>
              <Button color="inherit">커뮤니티</Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
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