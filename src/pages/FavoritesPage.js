import Header from '../components/header';
import Sidebar from "../components/Mypage_SideBar"; // Sidebar 컴포넌트 임포트
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Card , Button, Paper, CardContent , CardActions } from '@mui/material';
import Grid from "@mui/material/Grid2";

const FavoritesPage = () => {
    const navigate = useNavigate();
    const [userSn] = useState(2); // 사용자 고유 번호(예: 1, 실제 데이터에 맞게 설정)
    const [favorites, setFavorites] = useState([]); // 관심주택 리스트 상태

    useEffect(() => {
        fetchFavorites();
      }, [userSn]);

    // 관심주택 정보를 가져오는 함수
    const fetchFavorites = async () => {
    try {
        const response = await axios.get(`http://localhost:7773/api/favorites?userSn=${userSn}`
        );
        const favoriteResponseList = response.data.favoriteResponseList; // JSON 응답에서 리스트 추출
        setFavorites(favoriteResponseList);// 상태 업데이트
        console.log(favoriteResponseList);
    } catch (error) {
      console.error('관심 주택 정보를 가져오는 중 오류 발생:', error);
    }
  };

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
      <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        나의 관심 주택 리스트
      </Typography>
      {Array.isArray(favorites) && favorites.length > 0 ? (
        <Grid container spacing={3}>
          {favorites.map((favorite, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {favorite.jutaekName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    크기: {favorite.jutaekSize}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    주소: {favorite.jutaekAddress}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    공고 유형: {favorite.gongoType}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    자세히 보기
                  </Button>
                  <Button size="small" color="secondary">
                    삭제
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary">
          관심 주택이 없습니다.
        </Typography>
      )}
    </div>
        </Paper>
    </Box>
    </>
  );
};

export default FavoritesPage;
