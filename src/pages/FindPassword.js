import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
 Box,
 Button,
 TextField,
 Typography,
 Alert,
} from "@mui/material";
import Header from "../components/header";

function FindPassword() {
 const navigate = useNavigate();
 const [email, setEmail] = useState('');
 const [showAlert, setShowAlert] = useState(false);
 const [alertMessage, setAlertMessage] = useState('');
 const [alertSeverity, setAlertSeverity] = useState('error');

 const handleSubmit = async (e) => {
   e.preventDefault();
   try {
     const response = await fetch('http://localhost:7773/api/users/find-password', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ email })
     });

     const data = await response.json();
     
     if (response.ok) {
       // 임시 비밀번호 발송 성공
       setAlertSeverity('success');
       setAlertMessage('임시 비밀번호가 이메일로 발송되었습니다.');
       setShowAlert(true);
       setTimeout(() => navigate('/'), 2000); // 2초 후 메인 페이지로 이동
     } else {
       // 실패한 경우 (이메일이 존재하지 않는 등)
       setAlertSeverity('error');
       setAlertMessage(data.resultMsg || '비밀번호 찾기에 실패했습니다.');
       setShowAlert(true);
     }
   } catch (error) {
     setAlertSeverity('error');
     setAlertMessage('서버 오류가 발생했습니다.');
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
         비밀번호 찾기
       </Typography>
       <Typography 
         variant="body2" 
         color="text.secondary" 
         align="center" 
         sx={{ mb: 3 }}
       >
         가입하신 이메일 주소를 입력하시면<br />
         임시 비밀번호를 보내드립니다.
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
           임시 비밀번호 받기
         </Button>

       </form>
     </Box>
   </>
 );
}

export default FindPassword;