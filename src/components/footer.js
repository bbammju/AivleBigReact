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
        backgroundColor: "primary.main",
        color: "white",
        py: 2,
        mt: "auto",
        textAlign: "center",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2">
          © {new Date().getFullYear()} KT Aivle School. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
};


export default Footer;