import Header from '../components/headersub';
import Sidebar from "../components/MypageSideBar";
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useStore } from '../zustand/store';
import { 
  Box, 
  Typography, 
  Card , 
  Button, 
  Paper, 
  CardContent , 
  CardActions,
  Pagination,
  CardMedia,
  Chip,
  Stack 
} from '@mui/material';
import Grid from "@mui/material/Grid2";
import HomeIcon from '@mui/icons-material/Home';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Navigate, useNavigate } from 'react-router-dom';

const FavoritesPage = () => {
  const { userSn } = useStore();     
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]); // 관심주택 리스트 상태
  const [page, setPage] = useState(1);
  const itemsPerPage = 10; // 한 페이지당 보여줄 아이템 수

  // 현재 페이지에 해당하는 아이템들만 필터링
  // favorites 배열이 준비된 후에만 계산되도록 수정
  const currentItems = favorites ? favorites.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  ) : [];

  useEffect(() => {
      fetchFavorites();
    }, [userSn]);

  // 페이지 변경 핸들러
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // 관심주택 정보를 가져오는 함수
  const fetchFavorites = async () => {
  try {
      const response = await api.get(`/favorites?userSn=${userSn}`
      );
      const favoriteResponseList = response.data.favoriteResponseList; // JSON 응답에서 리스트 추출
      setFavorites(favoriteResponseList); // 상태 업데이트
      console.log(favoriteResponseList);
    } catch (error) {
    console.error('관심 주택 정보를 가져오는 중 오류 발생:', error);
    }
  };

  // 관심주택 삭제 요청
  const handleDelete = async (favoriteSn) => {
    try {
        await api.delete(`/favorites?favoriteSn=${favoriteSn}`);
        alert('관심 주택이 삭제되었습니다.');
        // 삭제 후 새로고침
        fetchFavorites();
    } catch (error) {
        console.error('관심 주택 삭제 중 오류 발생:', error);
        alert('삭제에 실패했습니다.');
    }
};

return (
  <>
      <Header />
      <Box sx={{ 
          display: 'flex',
          minHeight: '100vh',
          bgcolor: '#f5f5f5',
          p: 2 
      }}>
          <Sidebar />
          <Paper elevation={2} sx={{ flex: 1, p: 3, borderRadius: 3, ml: 2 }}>
              <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
                  나의 관심 주택 리스트
              </Typography>

              {Array.isArray(favorites) && favorites.length > 0 ? (
                  <>
                      <Grid container spacing={3} alignItems="stretch">
                      {currentItems.map((favorite, index) => (
                        <Grid item xs={12} sm={6} md={2.4} key={index}>
                            <Card 
                                sx={{ 
                                    height: 350,
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 3
                                    }
                                }}
                            >
                                {/* 이미지 영역 - RsltList의 방식 사용 */}
                                <Box
                                    sx={{
                                        height: 140,
                                        backgroundImage: favorite.jutaekImg && favorite.jutaekImg.length > 0
                                            ? `url(${JSON.parse(favorite.jutaekImg)[0]})`
                                            : "none",
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                        backgroundRepeat: "no-repeat",
                                        bgcolor: 'grey.200'
                                    }}
                                >
                                    {!favorite.jutaekImg && <HomeIcon sx={{ fontSize: 60, color: 'grey.400' }} />}
                                </Box>

                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Stack spacing={2}>
                                        <Typography 
                                            variant="h6" 
                                            gutterBottom
                                            noWrap
                                            sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                                        >
                                            {favorite.jutaekName}
                                        </Typography>
                                        
                                        <Chip 
                                            label={`${favorite.jutaekSize}m²`}
                                            size="small"
                                            sx={{ width: 'fit-content' }}
                                        />

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LocationOnIcon color="action" sx={{ fontSize: 20 }} />
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary"
                                                noWrap
                                                sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                                            >
                                                {favorite.jutaekAddress}
                                            </Typography>
                                        </Box>

                                        {/* 보증금, 월세 정보 추가 */}
                                        {favorite.guarantee && (
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                보증금: {Number(favorite.guarantee).toLocaleString('ko-KR')}원
                                            </Typography>
                                        )}
                                        {favorite.monthly && (
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                월세: {Number(favorite.monthly).toLocaleString('ko-KR')}원
                                            </Typography>
                                        )}

                                        <Chip 
                                            label={favorite.gongoType === "1" ? "청년안심주택" : "청년매입임대"}
                                            color={favorite.gongoType === "1" ? "primary" : "secondary"}
                                            size="small"
                                            sx={{ width: 'fit-content' }}
                                        />
                                    </Stack>
                                </CardContent>

                                <CardActions sx={{ p: 2, pt: 0 }}>
                                {/* <Button 
                                    size="small" 
                                    variant="outlined"
                                    sx={{ mr: 1 }}
                                    onClick={() => navigate(`/detail/${favorite.jutaekDtlSn}`)}  // 추가
                                >
                                    자세히 보기
                                </Button> */}
                                    <Button 
                                        size="small"
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDelete(favorite.favoriteSn)}
                                    >
                                        삭제
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                      </Grid>
                      
                      {/* 페이지네이션 */}
                      <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'center',
                          pt: 4 
                      }}>
                          <Pagination 
                              count={Math.ceil(favorites.length / itemsPerPage)}
                              page={page}
                              onChange={handlePageChange}
                              color="primary"
                              size="large"
                          />
                      </Box>
                  </>
              ) : (
                  <Typography variant="body1" color="text.secondary">
                      관심 주택이 없습니다.
                  </Typography>
              )}
          </Paper>
      </Box>
  </>
);
};

export default FavoritesPage;