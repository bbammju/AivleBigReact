import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import Header from "../components/header";
import LoginModal from '../components/LoginModal';

function EmailCheck() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('error');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.fetch('/users/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (data.exists) {
        // 이미 존재하는 이메일인 경우
        setAlertSeverity('info');
        setAlertMessage('이미 가입된 이메일입니다. 로그인해주세요.');
        setShowAlert(true);
        setTimeout(() => setIsLoginModalOpen(true), 1000);
      } else {
        // 신규 가입 가능한 경우
        navigate('/signup', { state: { email } });
      }
    } catch (error) {
      setAlertSeverity('error');
      setAlertMessage('이메일 확인 중 오류가 발생했습니다.');
      setShowAlert(true);
    }
  };

  return (
    <>
      <Header />
        {showAlert && (
            <Alert 
            severity={alertSeverity}
            sx={{ 
                position: 'fixed', 
                top: 20, 
                left: '50%', 
                transform: 'translateX(-50%)',
                zIndex: 9999,
                boxShadow: 2
            }}
            >
            {alertMessage}
            </Alert>
        )}

      <Box
        sx={{
          maxWidth: 400,
          mx: "auto",
          mt: 10,
          p: 3,
          border: "1px solid #ddd",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          이메일 확인
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            type="email"
            label="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            다음
          </Button>
        </form>
      </Box>

      <LoginModal 
        open={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}

export default EmailCheck;