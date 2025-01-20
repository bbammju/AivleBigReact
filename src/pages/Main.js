import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/header';
import {
 Box, 
 Container,
 Typography,
 FormControl,
 InputLabel,
 Select,
 MenuItem,
 Button
} from '@mui/material';

const api = axios.create({
 baseURL: 'http://localhost:7773/api',
 headers: {
   'Content-Type': 'application/json',
 }
});

function Main() {
 const navigate = useNavigate();
 const [activeGongos, setActiveGongos] = useState([]);
 const [selectedGongo, setSelectedGongo] = useState('');

 useEffect(() => {
   const fetchActiveGongos = async () => {
     try {
       const response = await api.get('/gongo/active');
       console.log('응답 데이터:', response.data);
       setActiveGongos(response.data.data || []);
     } catch (error) {
       console.error('공고 목록 조회 실패:', error);
     }
   };

   fetchActiveGongos();
 }, []);

 const handleGongoChange = (event) => {
   setSelectedGongo(event.target.value);
 };

 const handlePredict = () => {
   if (!selectedGongo) {
     alert('공고를 선택해주세요.');
     return;
   }
   navigate(`/predict/${selectedGongo.gongoSn}`);
 };

 return (
  <>
    <Header />
    <Box
      sx={{
        height: '100vh',
        width: '100%',
        position: 'relative',
        background: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("/apartment-image.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container sx={{ pt: 15 }}>
        <Box sx={{ maxWidth: '600px', color: 'white', mb: 6 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            API 분석과
          </Typography>
          <Typography variant="h4" sx={{ mb: 2 }}>
            가장 정확한 청약주택 카트라인
          </Typography>
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
            ZIPLINE
          </Typography>

        </Box>

        {/* 기존 드롭다운과 버튼 */}
        <Box sx={{ 
          bgcolor: 'white', 
          p: 4, 
          borderRadius: 2,
          maxWidth: '600px'
        }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>현재 진행중인 공고</InputLabel>
            <Select
              value={selectedGongo}
              label="현재 진행중인 공고"
              onChange={handleGongoChange}
            >
              {activeGongos.map((gongo) => (
                <MenuItem key={gongo.gongoSn} value={gongo}>
                  {gongo.gongoName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedGongo && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" gutterBottom>
                공고명: {selectedGongo.gongoName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                공고 기간: {selectedGongo.scheduleStartDt} ~ {selectedGongo.scheduleEndDt}
              </Typography>
            </Box>
          )}

          <Button
            variant="contained"
            size="large"
            onClick={handlePredict}
            disabled={!selectedGongo}
            fullWidth
          >
            당첨 예측하기
          </Button>
        </Box>
      </Container>
    </Box>
   </>
 );
}

export default Main;