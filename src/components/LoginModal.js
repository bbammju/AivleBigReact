import React, { useState } from 'react';
import axios from 'axios';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Alert,
  Typography,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const api = axios.create({
  baseURL: 'http://localhost:7773/api/users',
  headers: {
    'Content-Type': 'application/json'
  }
});

const ResetPasswordModal = ({ open, onClose }) => {
  const [email, setEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [resetSeverity, setResetSeverity] = useState('info');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    // TODO: 비밀번호 재설정 API 호출
    try {
      const response = await fetch('http://localhost:7773/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (data.resultCode === 200) {
        setResetSeverity('success');
        setResetMessage('임시 비밀번호가 이메일로 전송되었습니다.');
      } else {
        setResetSeverity('error');
        setResetMessage(data.resultMsg || '비밀번호 재설정에 실패했습니다.');
      }
    } catch (error) {
      setResetSeverity('error');
      setResetMessage('서버 오류가 발생했습니다.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        비밀번호 찾기
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleResetPassword}>
        <DialogContent>
          <Typography variant="body2" gutterBottom>
            가입된 이메일 주소를 입력하시면 임시 비밀번호를 보내드립니다.
          </Typography>
          <TextField
            label="이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          {resetMessage && (
            <Alert severity={resetSeverity} sx={{ mt: 2 }}>
              {resetMessage}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button 
            variant="contained" 
            type="submit" 
            fullWidth
          >
            임시 비밀번호 받기
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};


const LoginModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', formData);
      const data = response.data;
     
      if (data.resultCode == 200){
        // 로그인 성공 시 사용자 정보를 localStroage에 저장
        localStorage.setItem('user', JSON.stringify(data.data));
        setAlertSeverity('success');
        setAlertMessage('로그인 되었습니다.');
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        onClose();
        window.location.reload(); // 헤더 상태 업데이트를 위한 새로고침
      } else {
        // 로그인 실패 (이메일/비밀번호 불일치 등)
        setFormData(prev => ({
          ...prev,
          password: '' // 비밀번호 초기화
        }));
        setAlertSeverity('error');
        setAlertMessage(data.resultMsg);
        setShowAlert(true);
        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setFormData(prev => ({
        ...prev,
        password: ''
      }));
      setAlertSeverity('error');
      setAlertMessage(error.response?.data?.resultMsg || '로그인 중 오류가 발생했습니다.');
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
};
  return (
    <>
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
          }}>
          {alertMessage}
        </Alert>
      )}
      <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          로그인
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <CloseIcon />
          </IconButton>
          </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="이메일"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                fullWidth
              />
              <TextField
                label="비밀번호"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                fullWidth
              />
              <Typography
                variant="body2"
                color="primary"
                align="right"
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
                onClick={() => setIsResetModalOpen(true)}
              >
                비밀번호를 잊으셨나요?
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ padding: 2 }}>
            <Button 
              variant="contained" 
              type="submit" 
              fullWidth
            >
              로그인
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ResetPasswordModal
        open={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />
    </>
  );
};

export default LoginModal;