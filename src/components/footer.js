import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  Divider 
} from '@mui/material';
import { grey, blueGrey } from '@mui/material/colors'; 

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: grey[900],
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