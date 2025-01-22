import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from './header';
import Sidebar from "./Mypage_SideBar"; // Sidebar 컴포넌트 임포트
import { Box, Typography, TextField, Button, Paper, Radio, RadioGroup, FormControlLabel,
 } from '@mui/material';

 // FormField 컴포넌트
 const FormField = ({ label, name, value, onChange, type = 'text', button , disabled}) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
    <Typography sx={{ minWidth: '120px', mr: 2 }}>{label}</Typography>
    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
      <TextField
        fullWidth
        size="small"
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        disabled={disabled}
      />
      {button}
    </Box>
  </Box>
);


 const MyPage_Container = ({ formData, handleChange, onUpdate }) => {
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅 사용
  return (
    <>
    <Header />
    <Box sx={{ 
      display: 'flex',
      height: '100vh',
      backgroundColor: '#f5f5f5',
      // borderRadius: 5,
      padding: 2 }}>

      {/* Left Sidebar */}
      <Sidebar />

      {/* Right Content */}
      <Paper elevation={2} sx={{ flex: 1, padding: 2, borderRadius: 3 }}>
        <FormField label="이름" name="userName" value={formData.userName} onChange={handleChange} disabled/>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ minWidth: '120px', mr: 2 } }>성별</Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="gender"
              value={formData.gender} // 현재 상태값
              onChange={handleChange}
            >
              <FormControlLabel value="W" control={<Radio />} label="Female" disabled/>
              <FormControlLabel value="M" control={<Radio />} label="Male" disabled/>
            </RadioGroup>
            </Box>
        </Box>
        <FormField label="이메일" name="email" value={formData.email} onChange={handleChange} />
        <FormField label="주소" name="address" value={formData.address} onChange={handleChange} />
        <FormField label="우편번호" name="zipCode" value={formData.zipCode} onChange={handleChange} />
        <FormField label="전화번호" name="telno" value={formData.telno} onChange={handleChange} />


        {/* Buttons */} 
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
          <Button variant="contained" sx={{ marginRight: 1 }} onClick={onUpdate} >
          수정완료
          </Button>
        </Box>
      </Paper>
      </Box>
    </>
  );
}

export default MyPage_Container;
