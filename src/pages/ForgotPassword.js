import React, { useEffect, useState } from 'react';
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
  Paper,
  CircularProgress
} from "@mui/material";
import Header from "../components/headersub";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [timer, setTimer] = useState(300);
  const [timerActive, setTimerActive] = useState(false);


  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setEmailError('유효한 이메일 주소를 입력해주세요');
      return false;
    }
    setEmailError('');
    return true;
  }

  const handleEmailSubmit = async () => {
    if (!validateEmail(email)) return;
    setIsLoading(true);
    try {

      const response = await api.post('/users/forgot-password', {email});
      if (response.status === 200) {
        setStep(2);
        setMessage('인증번호가 이메일로 전송되었습니다.');
        setTimer(300);
        setTimerActive(true);
      } else {
        setError('이메일 전송에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err) {
      setError(err.response?.data?.error || '서버 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const validateVerificationCode = (code) => {
    const regex = /^\d{4}$/;
    if (!regex.test(code)) {
      setError('인증번호는 4자리 숫자로 입력해주세요.');
      return false;
    }
    return true;
  };

  const handleVerificationSubmit = async () => {
    try {
      const response = await api.post('/users/verify-code', {email, code: verificationCode });
    
      if (response.status === 200) {
        setStep(3);
        setMessage(`임시 비밀번호는 ${response.data.data.tempPassword} 입니다.`);
      } else {
        setError(response.data.message);
        setVerificationCode('');
      }
    } catch (err) {
      setError(err.response?.data?.message || '인증번호 확인에 실패했습니다.');
      setVerificationCode('');
    }
  };

  const handleRetry = () => {
    if (step === 2 && !error.includes('만료')) {
      // 단순 인증코드 검증 실패
      setVerificationCode('');
      setError('');
    }
    else {
      // 이메일 관련 에러나 인증코드 만료된 경우
      setStep(1);
      setEmail('');
      setVerificationCode('');
      setMessage('');
      setError('');
      setTimer(300);
      setTimerActive(false);
    }    
  };

  const handleGoToLogin = () => {
    navigate('/');  // 메인으로 보내는데 로그인 모달 창 띄우는거 고려
  };

  useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    if (timer == 0) {
      setStep(1);
      setError('인증 시간이 만료되었습니다. 다시 시도해주세요.');
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);


  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            비밀번호 찾기
          </Typography>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {error && (
              <Alert 
                severity="error" 
                action={
                  <Button color="inherit" size="small" onClick={handleRetry}>
                    다시 시도
                  </Button>
                }
              >
                {error}
              </Alert>
            )}
            {message && <Alert severity="success">{message}</Alert>}
            
            {step === 1 && (
              <>
                <TextField
                  label="이메일"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={!!emailError}
                  helperText={emailError}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2B4155'
                      }
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#2B4155'
                    }
                  }}
                />
                {isLoading && (
                  <CircularProgress 
                    sx={{ 
                      position: 'fixed', 
                      top: '50%', 
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 9999
                    }} 
                  />
                )}
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
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^\d]/g, '').slice(0, 4);
                    setVerificationCode(value);
                  }}
                  inputProps={{ maxLength: 4 }}
                  helperText={`남은 시간: ${Math.floor(timer/60)}:${String(timer%60).padStart(2, '0')}`}
                  fullWidth                
                />
                <Button 
                  variant="contained" 
                  onClick={handleVerificationSubmit}
                  disabled={verificationCode.length !== 4}
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