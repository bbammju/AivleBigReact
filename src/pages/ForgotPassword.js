import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Stack,
  Alert,
  Typography,
  Container,
  Paper
} from "@mui/material";
import Header from "../components/header";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleEmailSubmit = async () => {
    try {
      const response = await api.fetch('/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setStep(2);
        setMessage('인증번호가 이메일로 전송되었습니다.');
      } else {
        setError('이메일 전송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
    }
  };

  const handleVerificationSubmit = async () => {
    try {
      const response = await api.fetch('/users/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, verificationCode }),
      });
      
      const responseData = await response.json();

      if (response.ok) {
        setStep(3);
        setMessage(`임시 비밀번호는 ${responseData.data.temporaryPassword} 입니다.`);
      } else {
        setError(responseData.message || '인증번호가 일치하지 않습니다.');
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
    }
  };

  const handleGoToLogin = () => {
    navigate('/');  // 메인으로 보내는데 로그인 모달 창 띄우는거 고려
  };


  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            비밀번호 찾기
          </Typography>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}
            {message && <Alert severity="success">{message}</Alert>}
            
            {step === 1 && (
              <>
                <TextField
                  label="이메일"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                />
                <Button 
                  variant="contained" 
                  onClick={handleEmailSubmit}
                  disabled={!email}
                >
                  인증번호 받기
                </Button>
              </>
            )}

            {step === 2 && (
              <>
                <TextField
                  label="인증번호"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  fullWidth
                />
                <Button 
                  variant="contained" 
                  onClick={handleVerificationSubmit}
                  disabled={!verificationCode}
                >
                  확인
                </Button>
              </>
            )}

            {step === 3 && (
              <Button 
                variant="contained" 
                onClick={handleGoToLogin}
              >
                로그인하러 가기
              </Button>
            )}
          </Stack>
        </Paper>
      </Container>
    </>
  );
};

export default ForgotPassword;