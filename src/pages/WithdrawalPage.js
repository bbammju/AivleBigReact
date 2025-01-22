import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [userSn] = useState(102);
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
      // 비밀번호 확인 및 회원 탈퇴 API 호출
      const response = await fetch("http://localhost:7773/api/withdrawal", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userSn: userSn, // 실제 사용자 식별 번호
          currentPassword: password, // 비밀번호
        }),
      });

      if (response.ok) {
        alert("회원 탈퇴가 완료되었습니다.");
        navigate("/"); // 메인 페이지로 이동
      } else {
        const result = await response.json();
        setError(result.message || "회원 탈퇴 중 오류가 발생했습니다.");
        // alert("회원 탈퇴 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("회원 탈퇴 중 오류 발생:", error);
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Header />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          backgroundColor: "#f5f5f5",
          padding: 2,
        }}
      >
        {/* Left Sidebar */}
        <Sidebar />

        {/* Right Content */}
        <Paper
          elevation={2}
          sx={{ flex: 1, padding: 3, borderRadius: 3, textAlign: "center" }}
        >
          <Typography variant="h5" gutterBottom>
            탈퇴하기
          </Typography>
          <Typography variant="body1" color="textSecondary" gutterBottom mt={2}>
            탈퇴하시기 전에 모든 데이터를 삭제하고 복구가 불가능하다는 점을 확인해주세요.
          </Typography>

          {/* 체크박스 */}
          <FormControlLabel
            control={
              <Checkbox
                checked={isConfirmed}
                onChange={handleCheckboxChange}
                color="primary"
              />
            }
            label="모든 데이터를 삭제하고 더 이상 복구할 수 없습니다."
          />

          {/* 탈퇴 버튼 */}
          <Box sx={{ display: "flex", justifyContent: "center"}}>
          <Button
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
            onClick={handleOpenDialog}
            disabled={!isConfirmed}
          >
            탈퇴하기
          </Button>
          </Box>
        </Paper>
      </Box>

      {/* 비밀번호 확인 모달 */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>비밀번호 확인</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            탈퇴를 진행하려면 비밀번호를 입력해주세요.
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
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            취소
          </Button>
          <Button onClick={handleWithdrawal} color="error">
            탈퇴하기
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default WithdrawalPage;
