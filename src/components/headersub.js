import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/zipline.png';
import { useStore } from '../zustand/store';
import { useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Alert,
  Menu,
  MenuItem,
  Avatar,
  Stack  
} from '@mui/material'; 
import LoginModal from './LoginModal';
import api from '../utils/api';

const Headersub = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  // 드롭다운 메뉴를 위한 state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  // Zustand store에서 필요한 상태와 함수들 가져옴
  const { gongoSn, gongoName } = useStore();
  const { userSn } = useStore();  
  // Local Stroage 대신 Zustand store의 userSn 사용해 로그인 상태 확인
  const isLoggedIn = !!userSn;
  // 사용자 정보 상태 
  const [ userInfo, setUserInfo ] = useState(null);
  // 공고명을 표시할 경로들
  const showGongoRoutes = ['/', '/list']
  const shoutShowGongo = showGongoRoutes.includes(location.pathname);

  useEffect(() => {
    const initializeUserInfo = async () => {
      // userSn이 없는 상황
      if (!userSn) {
        try {
          const response = await api.get('users/me');
          if (response.data.resultCode === 200) {
            useStore.getState().setUserSn(response.data.user.userSn);
            setUserInfo({
              userName: response.data.user.userName
            });            
          }
        } catch (error) {
          // 401, 403 에러면 조용히 처리 (로그인 안된 상태)
          if (error.response?.status !== 401 && error.response?.status !== 403) {
            console.error('사용자 정보 초기화 실패:', error);
          }
        }      
      }
    };
    
    initializeUserInfo();
  }, []);

  // userSn이 있을 때 사용자 정보 조회
  useEffect(() => {
    const fetchUserInfo = async () => {
      if (userSn) {
        try {
          const response = await api.get('users/me');
          if (response.data.resultCode === 200){
          setUserInfo({
            userName: response.data.user.userName
          });
          }
        } catch (error) {
          if (error.response?.status !== 401 && error.response?.status !== 403) {
          console.error('사용자 정보 조회 중 오류 발생:', error);
          handleLogout();
          }
        }
      }
    };
    if (userSn){
      fetchUserInfo();
    }
  }, [userSn]);


  const handleLogout = async () => {
    try {
      // 로그아웃 API 호출
      await api.post('/users/logout');

      // 로그아웃 성공 시 클라이언트 처리 (현재는 무조건 backend에서 성공 응답, 추후 redis등 고도화 시 변경)
      
      // Zustand store 초기화
      useStore.getState().setUserSn(null); // userSn 초기화
      useStore.getState().setGongoInfo('',''); // gongo 정보 초기화
      // 로컬 상태 초기화
      setUserInfo(null);            

      // 성공 알림 표시
      setShowAlert(true); // Alert 표시
      handleMenuClose(); // 메뉴 닫기    
      // 3초 후 Alert 숨기기
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      navigate('/');
    } catch (error) {   
      console.error('로그아웃 중 오류 발생:', error);
      alert('로그아웃 중 문제가 발생했습니다. 다시 시도해주세요.');
    } finally {
      handleMenuClose(); // 메뉴 닫기
    }
  };

  const handleLogoClick = () => {
    navigate('/'); // 메인페이지로 이동동
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = (event) => {
    setAnchorEl(null);
  };

  const handleMyPage = () => {
    navigate('/mypage');
    handleMenuClose();
  };


  // 아바타 색상 생성 함수
  const stringToColor = (string) => {
    let hash = 0;
    let i;
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  // 아바타 속성 생성 함수
  const stringAvatar = (name) => {
    return {
      sx: {
        bgcolor: stringToColor(name),
        cursor: 'pointer',
      },
      children: name[0], // 이름의 첫 글자만 사용
    };
  };


  return (
    <>
      {/* Alert 컴포넌트 추가 */}
      {showAlert && (
        <Alert 
          severity="success"
          sx={{ 
            position: 'fixed', 
            top: 20, 
            left: '50%', 
            transform: 'translateX(-50%)',
            zIndex: 9999,
            boxShadow: 2
          }}
        >
          로그아웃 되었습니다.
        </Alert>
      )}
      <AppBar position="static">
        <Container maxWidth={false}>
          <Toolbar>
            <Box
              component="img"
              src={logo}
              alt="Logo"
              sx={{ 
                height: 50,
                cursor: 'pointer' 
              }}
              onClick={handleLogoClick}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Typography color="inherit"
            sx={{ 
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              textAlign: 'center',
              flexGrow: 1,
              marginRight: 'auto',
              // 조건부 표시
              display: isLoggedIn && shoutShowGongo ? 'block' : 'none'
            }}
          >
            {gongoName}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {isLoggedIn && userInfo ? (
                <>
                  {/* 커뮤니티 버튼 */}
                  <Button 
                    color="inherit"
                    onClick={() => navigate('/board')} 
                  >
                    커뮤니티
                  </Button>

                  {/* 사용자 이름 및 아바타 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography color="inherit">
                      {userInfo.userName}님
                    </Typography>
                    <Avatar
                      {...stringAvatar(userInfo.userName || '')}
                      onClick={handleMenuClick}
                    />
                  </Box>

                  {/* 드롭다운 메뉴 */}
                  <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <MenuItem onClick={() => {
                      navigate('/mypage');
                      handleMenuClose();
                    }}>
                      마이페이지
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      로그아웃
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  {/* 비로그인 상태 */}
                  <Button 
                    color="inherit"
                    onClick={() => navigate('/signup')}
                  >
                    회원가입
                  </Button>
                  <Button 
                    color="inherit"
                    onClick={() => setIsLoginModalOpen(true)}
                  >
                    로그인
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <LoginModal 
        open={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
};

export default Headersub;