import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  Divider 
} from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'primary.main',
        color: 'white',
        py: 3,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="subtitle1" gutterBottom>
              회사 정보
            </Typography>
            <Typography variant="body2">
              회사명: XXX 주식회사<br />
              대표: 홍길동<br />
              사업자등록번호: 123-45-67890
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              고객 지원
            </Typography>
            <Link href="#" color="inherit" display="block">고객센터</Link>
            <Link href="#" color="inherit" display="block">FAQ</Link>
            <Link href="#" color="inherit" display="block">문의하기</Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              소셜 미디어
            </Typography>
            <Link href="#" color="inherit" display="block">Facebook</Link>
            <Link href="#" color="inherit" display="block">Instagram</Link>
            <Link href="#" color="inherit" display="block">Twitter</Link>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} XXX 주식회사. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;