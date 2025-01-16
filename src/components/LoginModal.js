import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const LoginModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:7773/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.resultCode === 200) {
        alert('로그인이 완료되었습니다.');
        onClose();
      } else {
        alert(data.resultMsg);
      }
    } catch (error) {
      alert('로그인 중 오류가 발생했습니다.');
    }
  };

  return (
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
  );
};

export default LoginModal;