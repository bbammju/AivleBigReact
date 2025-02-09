import React, { useEffect, useState } from "react";
import { Typography, Box, Button, Avatar, Card, Divider } from "@mui/material";
import Header from "../components/header";
import api from "../utils/api";
import MyPageMainLayout from "../components/MypageLayout";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const MyPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await api.get("/users/mypage");
        if (response.data.resultCode === 200) {
          setUserInfo(response.data.data);
          setProfileImage(response.data.data.profileImage);
        } else {
          setError(response.data.resultMsg);
        }
      } catch (error) {
        setError(error.response?.data?.resultMsg || "사용자 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  // 프로필 이미지 업로드
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("userSn", userInfo?.userSn);
    formData.append("profileImage", file);

    try {
      setUploading(true);
      const response = await api.post("/users/profile-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.resultCode === 200) {
        setProfileImage(response.data.data.profileImage);
      } else {
        alert("프로필 이미지 업로드 실패: " + response.data.resultMsg);
      }
    } catch (error) {
      alert("이미지 업로드 중 오류 발생: " + error.response?.data?.resultMsg);
    } finally {
      setUploading(false);
    }
  };

    // ✅ 프로필 이미지 삭제
    const handleDeleteProfileImage = async () => {
        if (!userInfo?.userSn) return;
    
        if (!window.confirm("프로필 사진을 삭제하시겠습니까?")) {
          return;
        }
    
        try {
          setUploading(true);
          const response = await api.delete("/users/delete-profile", {
            data: { userSn: userInfo.userSn },
          });
    
          if (response.data.resultCode === 200) {
            setProfileImage(null); // 기본 프로필 이미지로 변경
          } else {
            alert("프로필 이미지 삭제 실패: " + response.data.resultMsg);
          }
        } catch (error) {
          alert("이미지 삭제 중 오류 발생: " + error.response?.data?.resultMsg);
        } finally {
          setUploading(false);
        }
      };
    

    // ✅ 가입일 포맷 (YYYY-MM-DD)
    const formatDate = (dateTime) => {
        if (!dateTime) return "정보 없음";
        return new Date(dateTime).toISOString().split("T")[0];
      };
    
    // ✅ 전화번호 포맷 (010-1234-5678)
    const formatPhoneNumber = (telno) => {
        if (!telno) return "정보 없음";
        return telno.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    };

    return (
        <>
          <Header />
          <MyPageMainLayout>
            <Box sx={{ maxWidth: 500, mx: "auto", mt: 5 }}>
              {loading ? (
                <Typography>사용자 정보를 불러오는 중...</Typography>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : userInfo ? (
                <Card sx={{ p: 4, textAlign: "center", boxShadow: 3 }}>
                  {/* 프로필 이미지 */}
                  <Avatar
                    src={profileImage || "/default-profile.png"} // 기본 이미지 설정
                    sx={{ width: 100, height: 100, mx: "auto", mb: 2 }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {userInfo.userName || "이름 없음"}
                  </Typography>
                  <Typography sx={{ color: "gray" }}>{userInfo.email || "이메일 없음"}</Typography>
    
                  {/* 프로필 이미지 관리 버튼 */}
                  <Box sx={{ mt: 2, display: "flex", justifyContent: "center", gap: 2 }}>
                    <input type="file" accept="image/*" id="upload-profile" style={{ display: "none" }} onChange={handleFileChange} />
                    <label htmlFor="upload-profile">
                      <Button component="span" variant="outlined" startIcon={<EditIcon />} disabled={uploading}>
                        {uploading ? "업로드 중..." : "프로필 변경"}
                      </Button>
                    </label>
                    {profileImage && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={handleDeleteProfileImage}
                        disabled={uploading}
                      >
                        삭제
                      </Button>
                    )}
                  </Box>
    
                  {/* 기본 정보 섹션 */}
                  <Divider sx={{ my: 3 }} />
                  <Box sx={{ textAlign: "left" }}>
                    <Typography>
                      <strong>이름:</strong> {userInfo.userName || "정보 없음"}
                    </Typography>
                    <Typography>
                      <strong>이메일:</strong> {userInfo.email || "정보 없음"}
                    </Typography>
                    <Typography>
                      <strong>가입일:</strong> {formatDate(userInfo.createdDt)}
                    </Typography>
                    <Typography>
                      <strong>휴대폰 번호:</strong> {formatPhoneNumber(userInfo.telno)}
                    </Typography>
                  </Box>
                </Card>
              ) : null}
            </Box>
          </MyPageMainLayout>
        </>
      );
    };
    

export default MyPage;
