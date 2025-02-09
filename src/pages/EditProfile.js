import React, { useEffect, useState } from 'react';
// import Mypage_Container from '../components/MyPage_Container'; //React 컴포넌트 이름은 대문자로 시작해야 정상적으로 렌더링
import { useNavigate } from 'react-router-dom';
import Header from '../components/headersub';
import Sidebar from '../components/MypageSideBar';
import api from '../utils/api';
import { 
  Box, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';

const EditProfile = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    gender: '',
    address: '',
    detailAddress: '',
    zipcode: '',
    telnoMiddle: '',
    telnoLast: ''
  });

  useEffect(() => {
    // 다음(Daum) 주소 검색 스크립트 로드
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    document.head.appendChild(script);
    
    fetchUserInfo();

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // 사용자 정보를 가져오는 함수
  const fetchUserInfo = async () => {
    try {
      const response = await api.get('/users/profile');

      if (response.data.resultCode === 200) {
        const userInfo = response.data.data;
        const telno = userInfo.telno || '';

        // 주소를 기본주소와 상세주소로 분리
        const [baseAddress, detailAddress] = (userInfo.address || '').split(',').map(str => str.trim());
        


        setFormData({
          userName: userInfo.userName,
          email: userInfo.email,
          gender: userInfo.gender,
          address: baseAddress,
          detailAddress: detailAddress || '',
          zipCode: userInfo.zipCode,
          telnoMiddle: telno.substring(3, 7),
          telnoLast: telno.substring(7)
        });
      } else {
        showAlertMessage('사용자 정보를 가져오는 데 실패했습니다.', 'error');
      }
     } catch (error) {
      console.error('사용자 정보를 가져오는 중 오류 발생:', error);
      showAlertMessage('사용자 정보를 가져오는 데 실패했습니다.', 'error');
    }
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    // 숫자만 입력 가능하도록
    const numbersOnly = value.replace(/[^\d]/g, '');
    
    if (numbersOnly.length <= 4) {
      setFormData(prev => ({ 
        ...prev, 
        [name]: numbersOnly,
        telno: `010${name === 'telnoMiddle' ? numbersOnly : prev.telnoMiddle}${name === 'telnoLast' ? numbersOnly : prev.telnoLast}`
      }));
    }
  };

  const handleAddressSearch = () => {
    if (window.daum?.Postcode) {
      new window.daum.Postcode({
        oncomplete: function(data) {
          setFormData(prev => ({
            ...prev,
            address: data.address,
            zipCode: data.zonecode
          }));
        }
      }).open();
    } else {
      showAlertMessage('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.', 'error');
    }
  };

  // TextField의 입력 처리
  const handleDetailAddressChange = (e) => {
    const value = e.target.value
      .replace(/,/g, '') // 쉼표 제거
      .replace(/\s+/g, ' '); // 연속된 공백을 하나의 공백으로 변경
    setFormData(prev => ({
      ...prev,
      detailAddress: value
    }));
  };  

  // Alert 메시지 표시 함수
  const showAlertMessage = (message, severity = 'success') => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);  // 3초 후 알림 닫기
  };
  

  // 수정 버튼 클릭 핸들러
  const handleUpdate = async () => {
    try {
      const trimmedDetailAddress = formData.detailAddress.trim();
      const fullAddress = formData.address
      ? `${formData.address}, ${trimmedDetailAddress}`.trim()
      : '';

      const updateData = {
        address: fullAddress,
        zipCode: formData.zipCode,
        telno: `010${formData.telnoMiddle}${formData.telnoLast}`
      };

      const response = await api.put('/users/editprofile', updateData);
      
      if (response.data.resultCode === 200) {
        showAlertMessage('수정이 완료되었습니다.');
        setTimeout(() => {
          navigate('/mypage');
        }, 1500);
      } else {
        showAlertMessage(response.data.resultMsg || '수정에 실패했습니다.', 'error');
      }
    } catch (error) {
      console.error('수정된 데이터를 저장하는 중 오류 발생:', error);
      showAlertMessage('수정 중 오류가 발생했습니다.', 'error');
    }
  };
  
  return (
    <>
      <Header />
      {showAlert && (
        <Alert 
          severity={alertSeverity}
          sx={{ 
            position: 'fixed', 
            top: 20, 
            left: '50%', 
            transform: 'translateX(-50%)',
            zIndex: 9999,
            boxShadow: 2
          }}
          onClose={() => setShowAlert(false)}
        >
          {alertMessage}
        </Alert>
      )}
      <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5', p: 2 }}>
        <Sidebar />
        <Paper elevation={2} sx={{ flex: 1, p: 3, borderRadius: 3, ml: 2 }}>
          <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
            회원정보 수정
          </Typography>
          
          <Box sx={{ mt: 3,
                     maxWidth: '600px',
                     mx: 'auto',
                     px: 4
           }}>
            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 1 }}>이름</Typography>
              <TextField
                fullWidth
                size="small"
                name="userName"
                value={formData.userName}
                disabled
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 1 }}>성별</Typography>
              <RadioGroup
                row
                name="gender"
                value={formData.gender}
              >
                <FormControlLabel 
                  value="male" 
                  control={<Radio />} 
                  label="남성" 
                  disabled 
                />
                <FormControlLabel 
                  value="female" 
                  control={<Radio />} 
                  label="여성" 
                  disabled 
                />
              </RadioGroup>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 1 }}>이메일</Typography>
              <TextField
                fullWidth
                size="small"
                name="email"
                value={formData.email}
                disabled
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 1 }}>우편번호</Typography>
              <TextField
                size="small"
                value={formData.zipCode}
                disabled
              />
            </Box>            

            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 1 }}>주소</Typography>
              <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    value={formData.address}
                    disabled
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddressSearch}
                    fullWidth
                    sx={{ 
                      borderColor: '#2B4155',
                      color: '#2B4155',
                      '&:hover': {
                        borderColor: '#3A5268',
                        backgroundColor: 'rgba(43, 65, 85, 0.04)'
                      }
                    }}
                  >
                    주소 검색
                  </Button>
                </Box>
                <TextField
                  fullWidth
                  size="small"
                  name="detailAddress"
                  value={formData.detailAddress}
                  onChange={handleDetailAddressChange}
                  placeholder="상세 주소를 입력해주세요 (쉼표 입력 불가)"
                  inputProps={{
                    pattern: '[^,]*' // HTML5 validation으로 쉼표 막기
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2B4155'
                      }
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#2B4155'
                    }
                  }}
                />
              </Box>
            </Box>



            <Box sx={{ mb: 2 }}>
              <Typography sx={{ mb: 1 }}>전화번호</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  size="small"
                  value="010"
                  disabled
                  sx={{ width: 80 }}
                />
                <TextField
                  size="small"
                  name="telnoMiddle"
                  value={formData.telnoMiddle}
                  onChange={handlePhoneChange}
                  inputProps={{ maxLength: 4 }}
                  sx={{
                    width: 100,
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2B4155'
                      }
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#2B4155'
                    }
                  }}
                />
                <TextField
                  size="small"
                  name="telnoLast"
                  value={formData.telnoLast}
                  onChange={handlePhoneChange}
                  inputProps={{ maxLength: 4 }}
                  sx={{
                    width: 100,
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2B4155'
                      }
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#2B4155'
                    }
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button 
                variant="contained"
                sx={{
                  backgroundColor: '#2B4155', // 더 어두운 파란색
                  '&:hover': {
                    backgroundColor: '#3A5268', // hover 시 좀 더 밝은 톤
                  },
                  transition: 'background-color 0.3s' // 부드러운 색상 전환 효과
                }} 
                onClick={handleUpdate}
              >
                수정완료
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default EditProfile;