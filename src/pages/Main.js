import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Header from '../components/header';
import Footer from '../components/footer';
import LoginModal from '../components/LoginModal';
import InputModal from './InputModal';
import { useStore } from '../zustand/store';
import apartmentImage from '../assets/apartmentimage.png';
import {
  Box, 
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Collapse,
  IconButton,
  Grid
 
 } from '@mui/material';
 import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
 import { styled } from '@mui/material/styles';

// ExpandMore 아이콘 애니메이션을 위한 스타일 컴포넌트
const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const Main = () => {
 const navigate = useNavigate();
 const [activeGongos, setActiveGongos] = useState([]);
 const { setGongoname } = useStore();
 const [isInputModalOpen, setIsInputModalOpen] = useState(false);
 const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
 const [isDataFetched, setIsDataFetched] = useState(false);
 const [selectedGongo, setSelectedGongo] = useState("");

 // Zustand 스토어에서 필요한 상태와 액션 가져오기
 const { userSn, setGongoInfo } = useStore();

 const [expanded1, setExpanded1] = useState(false);
 const [expanded2, setExpanded2] = useState(false);


const fetchActiveGongos = async () => {
if (isDataFetched) return;

try {
    console.log('공고 목록 조회 요청');
    const response = await api.get('/gongo/active');
    console.log('공고 목록 조회 응답:', response);

    // SUCCESS는 code가 0, Spring BaseMsg에 이렇게 되어있어서 그럼. 
    if (response.data?.resultCode === 0) {
        setActiveGongos(response.data.data || []);
        setIsDataFetched(true);
    } else {
        console.error('공고 목록 조회 실패:', response.data?.resultMsg);
    }
} catch (error) {
    console.error('공고 목록 조회 실패:', error);
    console.error('에러 상세:', error.response);
}
};



 const handleGongoChange = (event) => {
    const selectedGongo = event.target.value;
   setSelectedGongo(selectedGongo);
   // Zustand 스토어에 공고 정보 저장
   setGongoInfo(selectedGongo.gongoSn, selectedGongo.gongoName);
 };

 const handlePredict = () => {
  // 공고 선택 여부 확인
   if (!selectedGongo) {
     alert('공고를 선택해주세요.');
     return;
   }
   
  // 로그인 체크 (state 사용)
  if(!userSn) {
    setIsLoginModalOpen(true);
    return;
  }

    //로그인 된 경우 입력 모달 열기
    setIsInputModalOpen(true);
   
 };

 return (
  <>
    <Header  />
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        background: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${apartmentImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        pb: 10,
      }}
    >
      <Container sx={{ pt: 15 }}>
      <Grid container spacing={12}>
      {/* 왼쪽 영역 - 기존 컨텐츠 */}
      <Grid item xs={12} md={6}>
        <Box sx={{ maxWidth: '600px', color: 'white', mb: 6 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            AI가 분석한
          </Typography>
          <Typography variant="h4" sx={{ mb: 2 }}>
            가장 정확한 청약주택 커트라인
          </Typography>
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
            ZIPLINE
          </Typography>

        </Box>

        
        <Box sx={{ 
          backgroundColor: 'transparent',                             
          p: 4,
          borderRadius: 2,
          maxWidth: '600px',
          marginTop: 20,  
          marginLeft: -4,
        }}>
          <FormControl  fullWidth 
            variant="standard"  
            sx={{ 
              mb: 3,
              borderBottom: '1px solid #fff',
              '& .MuiInputLabel-root.Mui-focused': {  // 포커스 됐을 때
                color: 'rgba(255, 255, 255, 0.9)'  // 더 진한 흰색
              },
              '& .MuiInputLabel-root.MuiInputLabel-shrink': {  // float 상태일 때
                color: 'rgba(255, 255, 255, 0.9)',  // 더 진한 흰색
                fontSize: '1rem'  // 글자 크기 조정
              }
            }}>
            <InputLabel sx={{ 
               color: '#fff',
               fontWeight: 'bold',
               fontSize: '1.2rem'
             }}>현재 진행중인 공고</InputLabel>
            <Select
              disableUnderline
              disableScrollLock={true}
              MenuProps={{
                disableScrollLock: true,
                PaperProps: {
                  sx: {
                    backgroundColor: 'rgba(33, 33, 33, 0.9)',
                    color: '#fff'
                  }
                }
              }}
              sx={{
                color: '#fff',
                '& .MuiSelect-icon': {
                  color: '#fff',
                },
                '& .MuiSelect-select': {
                  fontWeight: 'bold',
                  fontSize: '1.2rem'
                },
                paddingY: 0.5,
              }}
              value={selectedGongo || ""} 
              label="현재 진행중인 공고"
              onChange={handleGongoChange}
              onOpen={fetchActiveGongos}
            >
              {activeGongos && activeGongos.length > 0 ? (
                activeGongos.map((gongo) => (
                  <MenuItem key={gongo.gongoSn} value={gongo}>
                    {gongo.gongoName}
                  </MenuItem>
                ))
                ) : (
                <MenuItem disabled>
                  공고가 없습니다.
                </MenuItem>
                )}
            </Select>
          </FormControl>

          {selectedGongo && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" gutterBottom sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  공고명: {selectedGongo.gongoName}
                </Typography>
                <Typography variant="body2" sx={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2rem' }}>
                  공고 기간: {selectedGongo.scheduleStartDt} ~ {selectedGongo.scheduleEndDt}
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                onClick={handlePredict}
                fullWidth
                sx={{
                  backgroundColor: '#2B4155',
                  padding: '12px 24px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  '&:hover': {
                    backgroundColor: '#3A5268',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s'
                  }
                }}
              >
                당첨 예측하기
              </Button>
            </>
          )}
        </Box>
      </Grid>
      {/* 오른쪽 영역 - 정보 카드 */}
      <Grid item xs={12} md={6}>
      <Card sx={{ 
              mb: 3, 
              backgroundColor: 'rgba(33, 33, 33, 0.9)',
              backdropFilter: 'blur(10px)',
              color: 'white'
            }}>
          <CardContent>
            <Typography variant="h5" component="div" sx={{ color: 'white' }}>
              청년안심주택(공공임대)
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              무주택 청년, 신혼부부 계층을 위한 임대주택
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <ExpandMore
              expand={expanded1}
              onClick={() => setExpanded1(!expanded1)}
              aria-expanded={expanded1}
              aria-label="show more"
              sx={{ 
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded1} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                📏 전용면적: 14㎡ ~ 57㎡
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                ⏳ 거주 기간: 최대 10년 (입주 후 혼인한 경우 최대 20년)
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                💰 임대료: 시중 임대료의 30~85% 수준
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                📜 계약 방식: 보증금 + 월 임대료 방식
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                🎯 지원 대상: 만 19~39세 청년 (무주택자)
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                🏦 보증금 무이자 지원: 보증금의 30~50% (최대 4,500만원)
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                📞 문의처: SH 청약센터 (☎ 1600-3456)
              </Typography>
            </CardContent>
          </Collapse>
        </Card>

        <Card sx={{ 
              mb: 3,
              backgroundColor: 'rgba(33, 33, 33, 0.9)',
              backdropFilter: 'blur(10px)',
              color: 'white'
            }}>
          <CardContent>
            <Typography variant="h5" component="div" sx={{ color: 'white' }}>
              청년매입임대
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              무주택 청년 계층을 위한 임대주택
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            <ExpandMore
              expand={expanded2}
              onClick={() => setExpanded2(!expanded2)}
              aria-expanded={expanded2}
              aria-label="show more"
              sx={{ 
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <ExpandMoreIcon />
            </ExpandMore>
          </CardActions>
          <Collapse in={expanded2} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                📏 전용면적: 20㎡ ~ 40㎡
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                ⏳ 거주 기간: 최대 10년 
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                💰 임대료: 시중 전세가의 30~50% 수준
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                📜 계약 방식: 보증금 + 월 임대료
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                🎯 지원 대상: 대학생, 사회 초년생, 취업준비생
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                📞 문의처: SH 청약센터 (☎ 1600-3456)
              </Typography>
            </CardContent>
          </Collapse>
        </Card>

 
        </Grid>
        </Grid>
      </Container>

      <InputModal
        open={isInputModalOpen}
        onClose={() => setIsInputModalOpen(false)}
                 
      />

      <LoginModal
        open={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </Box>
    <Footer />
   </>
 );
};

export default Main;
