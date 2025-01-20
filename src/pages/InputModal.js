import React, { useState } from "react";
import { Modal, Box, Button, Typography, LinearProgress } from "@mui/material";
import axios from "axios";
const InputModal = ({ open, onClose, gongo }) => {
  
  const [step, setStep] = useState(1); 
  const [selectedType, setSelectedType] = useState(""); 
  const [selectedPriority, setSelectedPriority] = useState(0); 
  const [selectedConditions, setSelectedConditions] = useState([]); 
  const [totalScore, setTotalScore] = useState(0);


const handleSubmit = async () => {
  const as = calculateTotalScore()
  const data = {
    userSn: 1, 
    gongoSn: 1, 
    inputType:selectedType,
    inputRank:selectedPriority,
    inputScore: as
  };

  try {
    const response = await axios.post("http://localhost:7773/api/input", data);
    if(response){
      alert(`제출 완료! \n선택한 순위: ${selectedPriority}\n총점: ${as}점`);
      alert("데이터 전송 성공: " + response.data);
      }
  } catch (error) {
    console.error("데이터 전송 실패:", error);
    alert("데이터 전송 중 오류 발생: " + error.message);
  }
};
  


  // 모달 닫기 핸들러
  const handleClose = () => {
    onClose();  // 부모 컴포넌트의 close 함수 호출
  };

  // 스텝 이동 핸들러
  const handleNextStep = () => setStep(step + 1);
  const handlePreviousStep = () => setStep(step - 1);

  // STEP 1 선택 핸들러
  const handleSelectType = (type) => {
    setSelectedType(type); // STEP 1 선택된 유형 저장
  };

  // STEP 2 선택 핸들러
  const handleSelectPriority = (priority) => {
    const priorityMapping = {
      "1순위": 1,
      "2순위": 2,
      "3순위": 3,
    };
  
    const priorityValue = priorityMapping[priority]; // "1순위"를 숫자로 변환
    setSelectedPriority(priorityValue);
  };

  // STEP 3 조건 선택 핸들러
  const handleSelectCondition = (condition) => {
    setSelectedConditions((prevConditions) => {
      if (prevConditions.includes(condition)) {
        return prevConditions.filter((item) => item !== condition);
      } else {
        return [...prevConditions, condition];
      }
    }); 
  };
  const [savingScore, setSavingScore] = useState(""); // 드롭다운 값 상태

  const handleSavingScoreChange = (event) => {
    setSavingScore(event.target.value); // 드롭다운 값 업데이트
  };

  //가산점 계산기 함수
  const calculateTotalScore = () => {
    const scoreMap = {
      "생계, 의료급여 수급자 (3점)": 3,
      "보호대상 한부모가족 (3점)": 3,
      "신청자의 부모가 무주택자인 경우 (2점)": 2,
      "장애인등록증이 교부된 사람(본인) (2점)": 2,
      "신청자의 부모 중 장애인등록증이 교부된 사람이 있는 경우 (1점)": 1,
      "소득수준이 해당 순위 소득기준의 50%이하인 경우 (3점)": 3
    };
  
    // 선택된 조건의 점수를 합산
    const score = selectedConditions.reduce(
      (total, condition) => total + (scoreMap[condition] || 0),0);
      const savingScoreValue = parseInt(savingScore ||0);
    const total = score + savingScoreValue;
    setTotalScore(total);
    return total;
  };

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800,
            height: 700,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          {/* STEP 1: 청약 유형 선택 */}
          {step === 1 && (
            <>
              <Typography variant="h6" component="h2" marginBottom={2}>
                청약 조건 확인하기
              </Typography>

              {/* 진행률 바 */}
              <LinearProgress variant="determinate" value={33} sx={{ marginBottom: 2 }} />
              <Typography variant="body2" color="textSecondary">
                STEP 1 OF 3
              </Typography>

              {/* 설명 텍스트 */}
              <Typography variant="subtitle1" marginTop={3} marginBottom={3}>
                청약 유형을 선택해주세요
              </Typography>

              {/* 선택 버튼 */}
              <Box display="flex" justifyContent="space-around">
                {/* 청년 버튼 */}
                <Button
                  variant="outlined"
                  onClick={() => handleSelectType("청년")}
                  sx={{
                    width: "45%",
                    padding: "50px",
                    textAlign: "center",
                    flexDirection: "column",
                    backgroundColor: selectedType === "청년" ? "#e3f2fd" : "white",
                    borderColor: selectedType === "청년" ? "#90caf9" : "gray",
                    "&:hover": {
                      backgroundColor: selectedType === "청년" ? "#bbdefb" : "#f5f5f5",
                    },
                  }}
                >
                  <Typography variant="h6">청년</Typography>
                  <Typography variant="body2">만 19-39세 무주택 청년</Typography>
                </Button>

                {/* 신혼부부 버튼 */}
                <Button
                  variant="outlined"
                  onClick={() => handleSelectType("신혼부부")}
                  sx={{
                    width: "45%",
                    padding: "50px",
                    textAlign: "center",
                    flexDirection: "column",
                    backgroundColor: selectedType === "신혼부부" ? "#e3f2fd" : "white",
                    borderColor: selectedType === "신혼부부" ? "#90caf9" : "gray",
                    "&:hover": {
                      backgroundColor: selectedType === "신혼부부" ? "#bbdefb" : "#f5f5f5",
                    },
                  }}
                >
                  <Typography variant="h6">신혼부부</Typography>
                  <Typography variant="body2">혼인기간 7년 이내 무주택 세대구성원</Typography>
                </Button>
              </Box>

              <Button
                variant="contained"
                sx={{ marginTop: 8 }}
                onClick={handleNextStep}
                disabled={!selectedType} // 선택하지 않으면 비활성화
              >
                다음
              </Button>
            </>
          )}

          {/* STEP 2: 순위 선택 */}
          {step === 2 && (
            <>
              <Typography variant="h6" component="h2" marginBottom={2}>
                청약 자격 확인
              </Typography>

              {/* 진행률 바 */}
              <LinearProgress variant="determinate" value={67} sx={{ marginBottom: 2 }} />
              <Typography variant="body2" color="textSecondary">
                STEP 2 OF 3
              </Typography>

              {/* 설명 텍스트 */}
              <Typography variant="subtitle1" marginTop={3} marginBottom={3}>
                해당되는 순위를 선택해주세요
              </Typography>

              {/* 순위 선택 버튼 */}
              <Box display="flex" flexDirection="column" gap={3}>
                <Button
                  variant="outlined"
                  onClick={() => handleSelectPriority("1순위")}
                  sx={{
                    padding: "30px",
                    textAlign: "left",
                    justifyContent: "flex-start",
                    backgroundColor: selectedPriority === 1 ? "#e3f2fd" : "white",
                    borderColor: selectedPriority === 1 ? "#90caf9" : "gray",
                    "&:hover": {
                      backgroundColor: selectedPriority === 1 ? "#bbdefb" : "#f5f5f5",
                    },
                  }}
                >
                  <Typography variant="h6">1순위</Typography>
                  <Typography variant="body2" sx={{ marginLeft: "30px", lineHeight: "1.5" }}>
                    - 생계,의료,주거급여,수급자 가구
                    <br />- 보호대상 한부모 가족
                    <br />- 차상위계층 가구
                  </Typography>
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => handleSelectPriority("2순위")}
                  sx={{
                    padding: "40px",
                    textAlign: "left",
                    justifyContent: "flex-start",
                    backgroundColor: selectedPriority === 2 ? "#e3f2fd" : "white",
                    borderColor: selectedPriority === 2 ? "#90caf9" : "gray",
                    "&:hover": {
                      backgroundColor: selectedPriority === 2 ? "#bbdefb" : "#f5f5f5",
                    },
                  }}
                >
                  <Typography variant="h6">2순위</Typography>
                  <Typography variant="body2" sx={{ marginLeft: "30px", lineHeight: "1.5" }}>
                    - 본인과 부모의 월평균소득이 전년도 도시근로자 가구원수별 가구당 월평균소득의 100%이하
                    <br />- 본인과 부모의 자산이 총자산 34,500만원 이하, 개별 자동차 3,708만원 이하
                  </Typography>
                </Button>

                <Button
                  variant="outlined"
                  onClick={() => handleSelectPriority("3순위")}
                  sx={{
                    padding: "30px",
                    textAlign: "left",
                    justifyContent: "flex-start",
                    backgroundColor: selectedPriority === 3 ? "#e3f2fd" : "white",
                    borderColor: selectedPriority === 3 ? "#90caf9" : "gray",
                    "&:hover": {
                      backgroundColor: selectedPriority === 3 ? "#bbdefb" : "#f5f5f5",
                    },
                  }}
                >
                  <Typography variant="h6"
                  sx={{
                    width: "10%",
                    whiteSpace: "nowrap", // 줄바꿈 방지
                    overflow: "hidden", // 텍스트 넘침 방지
                  }}
                  >3순위</Typography>
                  <Typography variant="body2" sx={{ marginLeft: "30px", lineHeight: "1.5" }}>
                    - 1,2순위에 해당하지 아니하는 사람 중 본인의 월평균소득이 전년도 도시근로자 가구원수별 가구당 월평균소득의 100%이하
                    <br />- 본인의 총자산이 27,300만원 이하, 개별 자동차 3,708만원 이하
                  </Typography>
                </Button>
              </Box>

              {/* 이전/다음 버튼 */}
              <Box display="flex" justifyContent="space-between" marginTop={3}>
                <Button variant="outlined" onClick={handlePreviousStep}>
                  이전
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNextStep}
                  disabled={!selectedPriority} // 선택하지 않으면 비활성화
                >
                  다음
                </Button>
              </Box>
            </>
          )}

          {/* STEP 3: 1순위 조건 선택 */}
          {step === 3 && selectedPriority === 1 && (
            <>
              <Typography variant="h6" component="h2" marginBottom={2}>
                1순위 조건 선택 및 점수 계산
              </Typography>

              {/* 진행률 바 */}
              <LinearProgress variant="determinate" value={100} sx={{ marginBottom: 2 }} />
              <Typography variant="body2" color="textSecondary">
                STEP 3 OF 3
              </Typography>

              {/* 설명 텍스트 */}
              <Typography variant="subtitle1" marginTop={3} marginBottom={3}>
                아래의 조건을 선택하고 점수를 확인하세요
              </Typography>

              {/* 선택 조건 버튼 */}
              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => handleSelectCondition("생계, 의료급여 수급자 (3점)")}
                  sx={{
                    textAlign: "left",
                    padding: "15px",
                    backgroundColor: selectedConditions.includes("생계, 의료급여 수급자 (3점)")
                      ? "#e3f2fd"
                      : "white",
                    borderColor: selectedConditions.includes("생계, 의료급여 수급자 (3점)")
                      ? "#90caf9"
                      : "gray",
                    "&:hover": {
                      backgroundColor: "#bbdefb",
                    },
                  }}
                >
                  생계, 의료급여 수급자 (주거급여 수급자 가구는 해당되지 않음)
                  <Typography sx={{ marginLeft: "20px" }}>
                    <strong>3점</strong>
                  </Typography>
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleSelectCondition("보호대상 한부모가족 (3점)")}
                  sx={{
                    textAlign: "left",
                    padding: "15px",
                    backgroundColor: selectedConditions.includes("보호대상 한부모가족 (3점)")
                      ? "#e3f2fd"
                      : "white",
                    borderColor: selectedConditions.includes("보호대상 한부모가족 (3점)")
                      ? "#90caf9"
                      : "gray",
                    "&:hover": {
                      backgroundColor: "#bbdefb",
                    },
                  }}
                >
                  보호대상 한부모가족
                  <Typography sx={{ marginLeft: "20px" }}>
                    <strong>3점</strong>
                  </Typography>
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleSelectCondition("신청자의 부모가 무주택자인 경우 (2점)")}
                  sx={{
                    textAlign: "left",
                    padding: "15px",
                    backgroundColor: selectedConditions.includes("신청자의 부모가 무주택자인 경우 (2점)")
                      ? "#e3f2fd"
                      : "white",
                    borderColor: selectedConditions.includes("신청자의 부모가 무주택자인 경우 (2점)")
                      ? "#90caf9"
                      : "gray",
                    "&:hover": {
                      backgroundColor: "#bbdefb",
                    },
                  }}
                >
                  신청자의 부모가 무주택자인 경우
                  <Typography sx={{ marginLeft: "20px" }}>
                    <strong>2점</strong>
                  </Typography>
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleSelectCondition("장애인등록증이 교부된 사람(본인) (2점)")}
                  sx={{
                    textAlign: "left",
                    padding: "15px",
                    backgroundColor: selectedConditions.includes("장애인등록증이 교부된 사람(본인) (2점)")
                      ? "#e3f2fd"
                      : "white",
                    borderColor: selectedConditions.includes("장애인등록증이 교부된 사람(본인) (2점)")
                      ? "#90caf9"
                      : "gray",
                    "&:hover": {
                      backgroundColor: "#bbdefb",
                    },
                  }}
                >
                  장애인등록증이 교부된 사람(본인)
                  <Typography sx={{ marginLeft: "20px" }}>
                    <strong>2점</strong>
                  </Typography>
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleSelectCondition("신청자의 부모 중 장애인등록증이 교부된 사람이 있는 경우 (1점)")}
                  sx={{
                    textAlign: "left",
                    padding: "15px",
                    backgroundColor: selectedConditions.includes(
                      "신청자의 부모 중 장애인등록증이 교부된 사람이 있는 경우 (1점)"
                    )
                      ? "#e3f2fd"
                      : "white",
                    borderColor: selectedConditions.includes(
                      "신청자의 부모 중 장애인등록증이 교부된 사람이 있는 경우 (1점)"
                    )
                      ? "#90caf9"
                      : "gray",
                    "&:hover": {
                      backgroundColor: "#bbdefb",
                    },
                  }}
                >
                  신청자의 부모 중 장애인등록증이 교부된 사람이 있는 경우
                  <Typography sx={{ marginLeft: "20px" }}>
                    <strong>3점</strong>
                  </Typography>
                </Button>
              </Box>

              {/* 드롭다운: 청약저축 납입 횟수 */}
              <Box marginTop={3} textAlign="left">
                <Typography variant="subtitle1" marginBottom={1}>
                  청약저축 또는 주택청약종합저축 납입횟수(본인명의)
                </Typography>
                <select
                  style={{
                    width: "100%",
                    padding: "10px",
                    fontSize: "16px",
                    border: "1px solid gray",
                    borderRadius: "5px",
                  }}
                  onChange={handleSavingScoreChange} // 이벤트 핸들러
                  value={savingScore} // 드롭다운 상태 값
                >
                  <option value="">납입 횟수를 선택하세요</option>
                  <option value="3">24회 이상납입 (3점)</option>
                  <option value="2">12회 이상 24회 미만 납입 (2점)</option>
                  <option value="1">6회 이상 12회 미만 납입 (1점)</option>
                </select>
              </Box>

              {/* 이전/제출 버튼 */}
              <Box display="flex" justifyContent="space-between" marginTop={4}>
                <Button variant="outlined" onClick={handlePreviousStep}>
                  이전
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                      handleSubmit();
                      alert(`제출 완료! \n선택한 순위: ${selectedPriority}\n총점: ${totalScore}점`);
                    }}>
                  확인하기
                </Button>
              </Box>
            </>
          )}
          {step === 3 && (selectedPriority === 2 || selectedPriority === 3 ) && (
            <>
              
              <Typography variant="h6" component="h2" marginBottom={2}>
                2순위 또는 3순위 조건 선택 및 점수 계산
              </Typography>

              {/* 진행률 바 */}
              <LinearProgress variant="determinate" value={100} sx={{ marginBottom: 2 }} />
              <Typography variant="body2" color="textSecondary">
                STEP 3 OF 3
              </Typography>

              {/* 설명 텍스트 */}
              <Typography variant="subtitle1" marginTop={3} marginBottom={3}>
                아래의 조건을 선택하고 점수를 확인하세요
              </Typography>

              {/* 선택 조건 버튼 */}
              <Box display="flex" flexDirection="column" gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => handleSelectCondition("소득수준이 해당 순위 소득기준의 50%이하인 경우 (3점)")}
                  sx={{
                    textAlign: "left",
                    padding: "15px",
                    backgroundColor: selectedConditions.includes("소득수준이 해당 순위 소득기준의 50%이하인 경우 (3점)")
                      ? "#e3f2fd"
                      : "white",
                    borderColor: selectedConditions.includes("소득수준이 해당 순위 소득기준의 50%이하인 경우 (3점)")
                      ? "#90caf9"
                      : "gray",
                    "&:hover": {
                      backgroundColor: "#bbdefb",
                    },
                  }}
                >
                  소득수준이 해당 순위 소득기준의 50%이하인 경우
                  <Typography sx={{ marginLeft: "20px" }}>
                    <strong>3점</strong>
                  </Typography>
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleSelectCondition("신청자의 부모가 무주택자인 경우 (2점)")}
                  sx={{
                    textAlign: "left",
                    padding: "15px",
                    backgroundColor: selectedConditions.includes("신청자의 부모가 무주택자인 경우 (2점)")
                      ? "#e3f2fd"
                      : "white",
                    borderColor: selectedConditions.includes("신청자의 부모가 무주택자인 경우 (2점)")
                      ? "#90caf9"
                      : "gray",
                    "&:hover": {
                      backgroundColor: "#bbdefb",
                    },
                  }}
                >
                  신청자의 부모가 무주택자인 경우
                  <Typography sx={{ marginLeft: "20px" }}>
                    <strong>2점</strong>
                  </Typography>
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleSelectCondition("장애인등록증이 교부된 사람(본인) (2점)")}
                  sx={{
                    textAlign: "left",
                    padding: "15px",
                    backgroundColor: selectedConditions.includes("장애인등록증이 교부된 사람(본인) (2점)")
                      ? "#e3f2fd"
                      : "white",
                    borderColor: selectedConditions.includes("장애인등록증이 교부된 사람(본인) (2점)")
                      ? "#90caf9"
                      : "gray",
                    "&:hover": {
                      backgroundColor: "#bbdefb",
                    },
                  }}
                >
                  장애인등록증이 교부된 사람(본인)
                  <Typography sx={{ marginLeft: "20px" }}>
                    <strong>2점</strong>
                  </Typography>
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => handleSelectCondition("신청자의 부모 중 장애인등록증이 교부된 사람이 있는 경우 (1점)")}
                  sx={{
                    textAlign: "left",
                    padding: "15px",
                    backgroundColor: selectedConditions.includes(
                      "신청자의 부모 중 장애인등록증이 교부된 사람이 있는 경우 (1점)"
                    )
                      ? "#e3f2fd"
                      : "white",
                    borderColor: selectedConditions.includes(
                      "신청자의 부모 중 장애인등록증이 교부된 사람이 있는 경우 (1점)"
                    )
                      ? "#90caf9"
                      : "gray",
                    "&:hover": {
                      backgroundColor: "#bbdefb",
                    },
                  }}
                >
                  신청자의 부모 중 장애인등록증이 교부된 사람이 있는 경우
                  <Typography sx={{ marginLeft: "20px" }}>
                    <strong>1점</strong>
                  </Typography>
                </Button>
              </Box>

              {/* 드롭다운: 청약저축 납입 횟수 */}
              <Box marginTop={3} textAlign="left">
                <Typography variant="subtitle1" marginBottom={1}>
                  청약저축 또는 주택청약종합저축 납입횟수(본인명의)
                </Typography>
                <select
                  style={{
                    width: "100%",
                    padding: "10px",
                    fontSize: "16px",
                    border: "1px solid gray",
                    borderRadius: "5px",
                  }}
                  onChange={handleSavingScoreChange} // 이벤트 핸들러
                  value={savingScore} // 드롭다운 상태 값
                >
                  <option value="">납입 횟수를 선택하세요</option>
                  <option value="3">24회 이상납입 (3점)</option>
                  <option value="2">12회 이상 24회 미만 납입 (2점)</option>
                  <option value="1">6회 이상 12회 미만 납입 (1점)</option>
                </select>
              </Box>

              {/* 이전/제출 버튼 */}
              <Box display="flex" justifyContent="space-between" marginTop={4}>
                <Button variant="outlined" onClick={handlePreviousStep}>
                  이전
                </Button>
                <Button
                    variant="contained"
                    onClick={() => {
                      handleSubmit();
            
                    }}>
                  확인하기
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
};

export default InputModal;
