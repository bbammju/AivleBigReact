import React from "react";
import Header from '../components/header';
import { useNavigate } from "react-router-dom";
import { Box, Typography, TextField, Button, Paper, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel,
    List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider
   } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';  

const FavoritesPage = () => {
    const navigate = useNavigate();
    // 관심 주택 데이터 샘플
  const favoriteHouses = [
    { id: 1, name: "아파트 A", location: "서울 강남구", price: "10억" },
    { id: 2, name: "빌라 B", location: "부산 해운대구", price: "5억" },
    { id: 3, name: "주택 C", location: "대구 중구", price: "3억" },
  ];
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
        <h2>관심 주택 리스트</h2>
        <List>
        {favoriteHouses.map((house, index) => (
          <React.Fragment key={house.id}>
            <ListItem>
              <ListItemText
                primary={house.name}
                secondary={`위치: ${house.location}, 가격: ${house.price}`}
              />
            </ListItem>
            {index < favoriteHouses.length - 1 && <Divider />} {/* 리스트 아이템 구분선 */}
          </React.Fragment>
        ))}
      </List>
        </Paper>
    </Box>
    </>
  );
};

export default FavoritesPage;
