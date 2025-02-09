import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Sidebar from './MypageSideBar';
import apartmentImage from '../assets/apartmentimage.png';

const MyPageLayout = ({ children }) => {
  return (
    <>
      {/* 배너 영역 */}
      <Box
        sx={{
          width: '100%',
          height: '240px',
          position: 'relative',
          background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${apartmentImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'top',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(2px)',
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: 'white',
            fontWeight: 500,
            position: 'absolute',
            bottom: 40,
            left: 40,
            zIndex: 1,
            letterSpacing: '0.05em',
            fontSize: '2.2rem',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -8,
              left: 0,
              width: '100%',
              height: 3,
              backgroundColor: 'black',
              opacity: 0.7,
            },
          }}
        >
          마이페이지
        </Typography>
      </Box>

      {/* 메인 레이아웃 영역 */}
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5', p: 2 }}>
        {/* 사이드바 */}
        <Sidebar />

        {/* 컨텐츠 영역 */}
        <Paper elevation={2} sx={{ flex: 1, p: 3, borderRadius: 3, ml: 2 }}>
          {children}
        </Paper>
      </Box>
    </>
  );
};

export default MyPageLayout;
