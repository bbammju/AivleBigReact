import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Header from './header';
import { Box, Typography, TextField, Button, Paper, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText
 } from '@mui/material';
 import Grid from '@mui/material/Grid2';
 import PersonIcon from '@mui/icons-material/Person';
 import StarIcon from '@mui/icons-material/Star';
 import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

 // FormField 컴포넌트
 const FormField = ({ label, name, value, onChange, type = 'text', button }) => (
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
      <Paper elevation={2} sx={{ width: '20%', padding: 2, marginRight: 2, borderRadius: 3 }}>
      <nav aria-label="main mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate("/Mypage")}>
              <ListItemIcon>
                <PersonIcon />
              </ListItemIcon>
              <ListItemText primary="마이페이지" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/FavoritesPage")}>
            {/* 클릭 시 /favorites로 이동 */}
            <ListItemIcon>
              <StarIcon />
            </ListItemIcon>
            <ListItemText primary="관심주택" />
          </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <PersonRemoveIcon />
              </ListItemIcon>
              <ListItemText primary="회원탈퇴" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
      </Paper>

      {/* Right Content */}
      <Paper elevation={2} sx={{ flex: 1, padding: 2, borderRadius: 3 }}>
        <FormField label="이름" name="userName" value={formData.userName} onChange={handleChange}/>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography sx={{ minWidth: '120px', mr: 2 }}>성별</Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="gender"
              value={formData.gender} // 현재 상태값
              onChange={handleChange}
            >
              <FormControlLabel value="W" control={<Radio />} label="Female" />
              <FormControlLabel value="M" control={<Radio />} label="Male" />
              {/* <FormControlLabel value="other" control={<Radio />} label="Other" /> */}
            </RadioGroup>
            </Box>
        </Box>
        <FormField label="이메일" name="email" value={formData.email} onChange={handleChange} />
        <FormField 
          label="비밀번호" 
          name="password" 
          value={formData.password} 
          onChange={handleChange} 
          type="password"
          button={<Button variant="contained" size="small" sx={{ ml: 1 }}>변경</Button>}
        />
        <FormField label="주소" name="address" value={formData.address} onChange={handleChange} />
        <FormField label="우편번호" name="zipCode" value={formData.zipCode} onChange={handleChange} />
        <FormField label="전화번호" name="telno" value={formData.telno} onChange={handleChange} />


        {/* Buttons */} 
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
          <Button variant="contained" sx={{ marginRight: 1 }} onClick={onUpdate} >
            수정
          </Button>
          <Button variant="outlined">수정완료</Button>
        </Box>
      </Paper>
      </Box>
    </>
  );
}

export default MyPage_Container;
