import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../zustand/store';
import api from '../utils/api';
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


const LoginModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const { setUserSn } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/users/login', {
        email: formData.email,
        password: formData.password
      });
      const data = response.data;

      if (data.resultCode === 200){
        
        const { user, token } = data;
        
        // Zustand 전역 상태에 userSn 설정
        setUserSn(user.userSn);
        

        // 현재는 로컬 스토리지에 저장하지만 추후 쿠키로 변경 예정
        localStorage.setItem('accessToken', token.accessToken);
        localStorage.setItem('refreshToken', token.refreshToken);

        setAlertSeverity('success');
        setAlertMessage('로그인 되었습니다.');
        setShowAlert(true);

        setTimeout(() => {
          setShowAlert(false);
          onClose();
          navigate('/'); // 메인 페이지로 이동
        }, 500);
       
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

  const handleFindPassword = () => {
    onClose();
    navigate('/forgot-password');
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
                onClick={handleFindPassword}
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

    </>
  );
};

export default LoginModal;