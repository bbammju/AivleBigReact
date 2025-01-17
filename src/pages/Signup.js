import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
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

function Signup() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  
  const [formData, setFormData] = useState({
    email: "",
    userName: "",
    password: "",
    passwordConfirm: "",
    address: "",
    telnoMiddle: "",
    telnoLast: "",
    zipCode: "",
    gender: "",
  });

  useEffect(() => {
    if (!location.state?.email) {
      navigate('/email-check');
      return;
    }
    setFormData(prev => ({ ...prev, email: location.state.email }));

    if (!window.daum || !window.daum.Postcode) {
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      document.head.appendChild(script);
    }
  }, [location.state, navigate]);

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
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let errors = { ...fieldErrors };
    
    switch (fieldName) {
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
        if (value.length < 2) {
          errors.userName = '이름은 최소 2자 이상이어야 합니다.';
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

      default:
        break;
    }
    
    setFieldErrors(errors);
  };

  const validateForm = () => {
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

    try {
      const response = await fetch('http://localhost:7773/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          telno: fullPhoneNumber,
        })
      });

      const textResponse = await response.text();
      console.log('Server Response:', textResponse);
      
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        throw new Error('Invalid JSON response from server');
      }

      if (response.ok && data.resultCode === 200) {
        alert('회원가입이 완료되었습니다.');
        navigate('/main');
      } else {
        throw new Error(data.resultMsg || '회원가입 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setAlertMessage(error.message || '서버와의 통신 중 오류가 발생했습니다.');
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="email"
                label="이메일"
                name="email"
                value={formData.email}
                disabled
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
                <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
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