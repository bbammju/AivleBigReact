import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Sidebar from '../components/Mypage_SideBar';
import api from '../utils/api';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Alert,
  Divider
} from '@mui/material';

const PasswordChange = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isCurrentPasswordVerified, setIsCurrentPasswordVerified] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: ''
  });

  const handleCurrentPasswordCheck = async () => {
    if (!formData.currentPassword) {
      showAlertMessage('현재 비밀번호를 입력해주세요.', 'error');
      return;
    }
 
    try {
      const response = await api.post('/users/check-password', {
        currentPassword: formData.currentPassword
      });
 
      if (response.data.resultCode === 200) {
        setIsCurrentPasswordVerified(true);
        showAlertMessage('현재 비밀번호가 확인되었습니다.');
      } else {
        showAlertMessage('현재 비밀번호가 일치하지 않습니다.', 'error');
      }
    } catch (error) {
      console.error('Password check error:', error);
      showAlertMessage('비밀번호 확인 중 오류가 발생했습니다.', 'error');
    }
  };
 
  const validateField = (name, value) => {
    let errors = { ...fieldErrors };
    
    switch (name) {
      case 'newPassword':
        if (value.length < 8) {
          errors.newPassword = '비밀번호는 최소 8자 이상이어야 합니다.';
        } else if (!/(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])/.test(value)) {
          errors.newPassword = '비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 합니다.';
        } else {
          delete errors.newPassword;
        }
        break;
 
      case 'newPasswordConfirm':
        if (value !== formData.newPassword) {
          errors.newPasswordConfirm = '새 비밀번호가 일치하지 않습니다.';
        } else {
          delete errors.newPasswordConfirm;
        }
        break;
    }
    
    setFieldErrors(errors);
  };
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name !== 'currentPassword') {
      validateField(name, value);
    }
  };
 
  const showAlertMessage = (message, severity = 'success') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };
 
  const handlePasswordChange = async () => {
    if (Object.keys(fieldErrors).length > 0) {
      showAlertMessage('새 비밀번호를 확인해주세요.', 'error');
      return;
    }
 
    if (!formData.newPassword || !formData.newPasswordConfirm) {
      showAlertMessage('새 비밀번호를 모두 입력해주세요.', 'error');
      return;
    }
 
    try {
      const response = await api.put('/users/change-password', {
        newPassword: formData.newPassword
      });
      
      if (response.data.resultCode === 200) {
        showAlertMessage('비밀번호가 성공적으로 변경되었습니다.');
        setFormData({
          currentPassword: '',
          newPassword: '',
          newPasswordConfirm: ''
        });
        setIsCurrentPasswordVerified(false);

        setTimeout(() => {
          navigate('/mypage');
        }, 1500);
      } else {
        showAlertMessage(response.data.resultMsg || '비밀번호 변경에 실패했습니다.', 'error');
      }
    } catch (error) {
      console.error('Password change error:', error);
      showAlertMessage('비밀번호 변경 중 오류가 발생했습니다.', 'error');
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
          onClose={() => setShowAlert(false)}
        >
          {alertMessage}
        </Alert>
      )}
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5', p: 2 }}>
        <Sidebar />
        <Paper elevation={2} sx={{ flex: 1, p: 3, borderRadius: 3, ml: 2 }}>
          <Typography variant="h5" gutterBottom>비밀번호 변경</Typography>
          
          <Box sx={{ mt: 3, maxWidth: 400, mx: 'auto' }}>
            {/* Step 1: 현재 비밀번호 확인 */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <TextField
                  fullWidth
                  type="password"
                  label="현재 비밀번호"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  disabled={isCurrentPasswordVerified}
                  required
                />
                <Button 
                  variant="outlined"
                  onClick={handleCurrentPasswordCheck}
                  disabled={isCurrentPasswordVerified}
                >
                  확인
                </Button>
              </Box>
            </Box>
 
            <Divider sx={{ my: 3 }} />
 
            {/* Step 2: 새 비밀번호 설정 */}
            <Box sx={{ opacity: isCurrentPasswordVerified ? 1 : 0.5, pointerEvents: isCurrentPasswordVerified ? 'auto' : 'none' }}>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  type="password"
                  label="새 비밀번호"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  error={!!fieldErrors.newPassword}
                  helperText={fieldErrors.newPassword}
                />
              </Box>
 
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  type="password"
                  label="새 비밀번호 확인"
                  name="newPasswordConfirm"
                  value={formData.newPasswordConfirm}
                  onChange={handleChange}
                  required
                  error={!!fieldErrors.newPasswordConfirm}
                  helperText={fieldErrors.newPasswordConfirm}
                />
              </Box>
 
              <Box sx={{ mt: 4 }}>
                <Button 
                  fullWidth
                  variant="contained"
                  onClick={handlePasswordChange}
                >
                  비밀번호 변경
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
 };
 

export default PasswordChange;