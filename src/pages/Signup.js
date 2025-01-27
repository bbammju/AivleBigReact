import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Header from "../components/header";
import {
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Alert,  
} from "@mui/material";

const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const handleEmailCheck = async () => {
    const email = formData.email;

    // 이메일 유효성 검증
    validateField('email', email);
  
    if (fieldErrors.email) {
      return; // 오류가 있으면 요청하지 않음
    }
  
    try {
      const response = await api.post('/users/check-email', {
        email: formData.email
      });
      
      if (!response.data.exists) {
        setIsEmailVerified(true);        
        setFieldErrors({});
      } else {
        setIsEmailVerified(false);
        setFieldErrors(prev => ({ ...prev, email: '이미 사용 중인 이메일입니다.' }));
      }
    } catch (error) {
      setIsEmailVerified(false);
      setAlertMessage('이메일 중복 확인 중 오류가 발생했습니다.');
      setShowAlert(true);
    }
  };
  
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    password: "",
    passwordConfirm: "",
    address: "",
    detailAddress: "",
    telnoMiddle: "",
    telnoLast: "",
    zipCode: "",
    gender: "",
  });

  useEffect(() => {
    // 다음(Daum) 주소 검색 스크립트 로드
    if (!window.daum || !window.daum.Postcode) {
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      document.head.appendChild(script);
    }
}, []);

  const handleAddressSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      setAlertMessage('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      setShowAlert(true);
      return;
    }

    new window.daum.Postcode({
      oncomplete: function(data) {
        setFormData(prev => ({
          ...prev,
          address: data.address,
          zipCode: data.zonecode
        }));
      }
    }).open();
  };

  const handlePhoneChange = (e) => {
    const { name, value } = e.target;
    const numbersOnly = value.replace(/[^\d]/g, '');
    
    if (numbersOnly.length <= 4) {
      setFormData(prev => ({ ...prev, [name]: numbersOnly }));
      
      const middle = name === 'telnoMiddle' ? numbersOnly : formData.telnoMiddle;
      const last = name === 'telnoLast' ? numbersOnly : formData.telnoLast;
      
      if (middle.length === 4 && last.length === 4) {
        setFieldErrors(prev => ({ ...prev, telno: "" }));
      } else if (middle.length > 0 || last.length > 0) {
        setFieldErrors(prev => ({ 
          ...prev, 
          telno: "전화번호를 완성해주세요." 
        }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'email') {
      setIsEmailVerified(false);
    }
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let errors = { ...fieldErrors };
    
    switch (fieldName) {

      case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // 이메일 유효성 검증 정규식
      if (!value) {
        errors.email = '이메일을 입력해주세요.';
      } else if (!emailRegex.test(value)) {
        errors.email = '올바른 이메일 형식이 아닙니다.';
      } else {
        delete errors.email;
      }
      break;

      case 'password':
        if (value.length < 8) {
          errors.password = '비밀번호는 최소 8자 이상이어야 합니다.';
        } else if (!/(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])/.test(value)) {
          errors.password = '비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 합니다.';
        } else {
          delete errors.password;
        }
        break;
        
      case 'passwordConfirm':
        if (value !== formData.password) {
          errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
        } else {
          delete errors.passwordConfirm;
        }
        break;
        
      case 'userName':
        const koreanRegex = /^[가-힣]+$/; // 한글만 허용
        if (!value.trim()) {
          errors.userName = '이름을 입력해주세요.';
        } else if (value.length < 2) {
          errors.userName = '이름은 최소 2자 이상이어야 합니다.';
        } else if (!koreanRegex.test(value)) {
          errors.userName = '이름은 한글만 입력 가능합니다.';
        } else {
          delete errors.userName;
        }
        break;

      case 'gender':
        if (!value) {
          errors.gender = '성별을 선택해주세요.';
        } else {
          delete errors.gender;
        }
        break;
                
      case 'detailAddress':
        if (value.trim() === '') {
          errors.detailAddress = '상세 주소를 입력해주세요.';
        } else {
          delete errors.detailAddress;
        }
        break;
    
      default:
        break;
        
    }

    
    setFieldErrors(errors);
  };

  const validateForm = () => {

    if (!isEmailVerified) {
      setFieldErrors(prev => ({ ...prev, email: '이메일 중복 확인이 필요합니다.' }));
      return false;
    }

    const requiredFields = ['email', 'password', 'userName', 'telnoMiddle', 'telnoLast', 'gender'];
    let isValid = true;
    let errors = { ...fieldErrors };

    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = '필수 입력 항목입니다.';
        isValid = false;
      }
    });

    if (formData.password) {
      if (formData.password.length < 8) {
        errors.password = '비밀번호는 최소 8자 이상이어야 합니다.';
        isValid = false;
      } else if (!/(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])/.test(formData.password)) {
        errors.password = '비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 합니다.';
        isValid = false;
      }
    }

    if (formData.password !== formData.passwordConfirm) {
      errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
      isValid = false;
    }

    if (!formData.telnoMiddle || !formData.telnoLast) {
      errors.telno = "전화번호를 입력해주세요.";
      isValid = false;
    } else if (formData.telnoMiddle.length !== 4 || formData.telnoLast.length !== 4) {
      errors.telno = "올바른 전화번호 형식이 아닙니다.";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setAlertMessage('입력 정보를 다시 확인해주세요.');
      setShowAlert(true);
      return;
    }

    const fullPhoneNumber = `010${formData.telnoMiddle}${formData.telnoLast}`;
    const fullAddress = `${formData.address} ${formData.detailAddress}`;

    try {
      const response = await api.post('/users/signup', {
        ...formData,
        telno: fullPhoneNumber,
        address: fullAddress
      });
      
      if (response.data.resultCode === 200) {
        alert('회원가입이 완료되었습니다.');
        navigate('/');
      } else {
        setAlertMessage(response.data.message || '회원가입 중 오류가 발생했습니다.');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Signup error:', error);
      // axios 에러 응답 처리
      const errorMessage = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
      setAlertMessage(errorMessage);
      setShowAlert(true);
    }
  };

  return (
    <>
      <Header />
      {showAlert && (
        <Alert 
          severity="error"
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
      <Box
        sx={{
          maxWidth: 500,
          mx: "auto",
          mt: 5,
          p: 3,
          border: "1px solid #ddd",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          회원가입
        </Typography>
        <form onSubmit={handleSubmit}>
  <Grid container spacing={2}>  {/* 최상위 Grid container */}
    
    {/* 이메일 입력 필드와 중복 확인 버튼 */}
    <Grid item xs={12}>
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <Box sx={{ position: 'relative' }}>
            <TextField
              fullWidth
              type="email"
              label="이메일"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
            />              
            {isEmailVerified && (
              <Typography color="success">
                ✓ 사용 가능한 이메일입니다
              </Typography>
            )}
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="outlined"
            onClick={handleEmailCheck}
            fullWidth
            sx={{ height: '100%' }}
          >
            중복 확인
          </Button>
        </Grid>
      </Grid>
    </Grid>

    {/* 나머지 폼 필드들 */}
    <Grid item xs={12}>
      <TextField
        fullWidth
        type="password"
        label="비밀번호"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
        error={!!fieldErrors.password}
        helperText={fieldErrors.password}
      />
    </Grid>


            <Grid item xs={12}>
              <TextField
                fullWidth
                type="password"
                label="비밀번호 확인"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                required
                error={!!fieldErrors.passwordConfirm}
                helperText={fieldErrors.passwordConfirm}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="이름"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
                error={!!fieldErrors.userName}
                helperText={fieldErrors.userName}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1 }}>전화번호</Typography>
              <Grid container spacing={1}>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    value="010"
                    disabled
                    size="small"
                    inputProps={{ style: { textAlign: 'center' } }}
                  />
                </Grid>
                <Grid item xs={4.5}>
                  <TextField
                    fullWidth
                    name="telnoMiddle"
                    value={formData.telnoMiddle}
                    onChange={handlePhoneChange}
                    required
                    error={!!fieldErrors.telno}
                    size="small"
                    inputProps={{ 
                      maxLength: 4,
                      style: { textAlign: 'center' }
                    }}
                  />
                </Grid>
                <Grid item xs={4.5}>
                  <TextField
                    fullWidth
                    name="telnoLast"
                    value={formData.telnoLast}
                    onChange={handlePhoneChange}
                    required
                    error={!!fieldErrors.telno}
                    size="small"
                    inputProps={{ 
                      maxLength: 4,
                      style: { textAlign: 'center' }
                    }}
                  />
                </Grid>
              </Grid>
              {fieldErrors.telno && (
                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                  {fieldErrors.telno}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="우편번호"
                name="zipCode"
                value={formData.zipCode}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Button
                variant="outlined"
                onClick={handleAddressSearch}
                fullWidth
              >
                주소 검색
              </Button>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="주소"
                name="address"
                value={formData.address}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="상세 주소"
                name="detailAddress"
                value={formData.detailAddress}
                onChange={handleChange}
                placeholder="상세 주소를 입력해주세요"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl component="fieldset" error={!!fieldErrors.gender}>
                <Typography component="legend" sx={{ mb: 1 }}>성별</Typography>
                <RadioGroup
                  row
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <FormControlLabel 
                    value="male" 
                    control={<Radio required />} 
                    label="남성"
                  />
                  <FormControlLabel 
                    value="female" 
                    control={<Radio required />} 
                    label="여성"
                  />
                </RadioGroup>
                {fieldErrors.gender && (
                  <Typography color="error" variant="caption">
                    {fieldErrors.gender}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
              >
                가입하기
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </>
  );
}

export default Signup;