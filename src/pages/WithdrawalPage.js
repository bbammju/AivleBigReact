import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Header from "../components/header";
import Sidebar from "../components/Mypage_SideBar"; // Sidebar 컴포넌트 임포트
import {
  Box,
  Paper,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@mui/material";

const WithdrawalPage = () => {
  const navigate = useNavigate();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleCheckboxChange = (event) => {
    setIsConfirmed(event.target.checked);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setPassword(""); // 비밀번호 초기화
    setError(""); // 에러 메시지 초기화
  };

  const handleWithdrawal = async () => {
    if (!password) {
        setError("비밀번호를 입력해주세요.");
        return;
      }
    try {
      const response = await api.post('/users/withdrawal',{
        
        currentPassword: password        
      });

      if (response.data.resultCode === 200) {
        alert("회원 탈퇴가 완료되었습니다.");        
        navigate("/"); // 메인 페이지로 이동
      } else {
        setError(response.data.resultMsg || "회원 탈퇴 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("회원 탈퇴 중 오류 발생:", error);
      setError(error.response?.data?.resultMsg || "회원 탈퇴 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Header />
      <Box sx={{
        display: "flex",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        padding: 2,
      }}>
        <Sidebar />

        <Paper
          elevation={2}
          sx={{ 
            flex: 1, 
            padding: 3, 
            borderRadius: 3, 
            ml: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Box sx={{ maxWidth: '600px', width: '100%' }}>
            <Typography variant="h5" gutterBottom>
              탈퇴하기
            </Typography>

            <Box sx={{ 
              bgcolor: 'grey.50',  // 배경색을 더 부드럽게
              p: 3, 
              borderRadius: 2,
              mb: 3,
              border: '1px solid',
              borderColor: 'grey.200'
            }}>
              <Typography variant="subtitle1" sx={{ 
                mb: 2,
                fontWeight: 500,
                color: 'text.primary'  // 제목 색상
              }}>
                회원 탈퇴 시 주의사항:
              </Typography>
              <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5
              }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  • 모든 개인정보가 삭제되며 복구할 수 없습니다.
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  • 작성한 게시물과 댓글은 삭제되지 않습니다.
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  • 동일한 이메일로 즉시 재가입이 불가능할 수 있습니다.
                </Typography>
              </Box>
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  checked={isConfirmed}
                  onChange={handleCheckboxChange}
                  color="primary"  // error에서 primary로 변경
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'text.primary' }}>
                  위 사항을 모두 확인했으며, 이에 동의합니다.
                </Typography>
              }
              sx={{ mt: 2 }}
            />

            <Box sx={{ 
              display: "flex", 
              justifyContent: "center", 
              mt: 4 
            }}>
              <Button
                variant="contained"
                color="error"
                onClick={handleOpenDialog}
                disabled={!isConfirmed}
                sx={{
                  px: 4,
                  py: 1
                }}
              >
                회원 탈퇴
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* 비밀번호 확인 모달 */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #eee',
          pb: 2
        }}>
          <Typography variant="h6" component="div">
            비밀번호 확인
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            회원님의 안전한 탈퇴를 위해 비밀번호를 한 번 더 입력해주세요.
          </Typography>
          <TextField
            label="비밀번호"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error}
            autoComplete="current-password"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        
        <DialogActions sx={{ 
          p: 2,
          pt: 1,
          borderTop: '1px solid #eee',
          gap: 1 
        }}>
          <Button 
            onClick={handleCloseDialog} 
            variant="outlined"
            sx={{ 
              px: 3,
              borderColor: 'grey.300',
              color: 'grey.700',
              '&:hover': {
                borderColor: 'grey.400',
                backgroundColor: 'grey.50'
              }
            }}
          >
            취소
          </Button>
          <Button 
            onClick={handleWithdrawal} 
            variant="contained" 
            color="error"
            sx={{ px: 3 }}
          >
            탈퇴하기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WithdrawalPage;
