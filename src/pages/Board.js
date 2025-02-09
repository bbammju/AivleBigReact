import React, { useState, useEffect } from "react";
import Header from "../components/headersub";
import api from "../utils/api";
import { useNavigate, useParams, useLocation  } from "react-router-dom";
import { Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, Box, Typography,
    Button, Paper,
  Pagination,
 } from "@mui/material";
import { useStore } from '../zustand/store';
import DOMPurify from 'dompurify';
import 'react-quill/dist/quill.snow.css';

// CustomTabs 컴포넌트
const CustomTabs = ({ tabs, activeTab, setActiveTab, setCurrentPage, setId}) => {
    const navigate = useNavigate();
    return (
      <Tabs
        value={activeTab}
        onChange={(event, newValue) => {
          setActiveTab(newValue);
          setCurrentPage(1);
          if (newValue !== activeTab) {
            setId(null);
            navigate("/userboard");
          }
        }}
        centered
        indicatorColor="primary"
        textColor="primary"
        sx={{
          width: "80%",
          margin: "0 auto",
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.label}
            value={tab.id}
            sx={{
              fontSize: "1.5rem",
              padding: "15px",
              minWidth: "150px",
            }}
          />
        ))}
      </Tabs>
    );
  };

const Board = () => {
    const location = useLocation();
    const tabs = [
      { id: "gongo", label: "공고게시판" },
      { id: "user", label: "유저게시판" },
    ];
    
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'gongo');
    const [data, setData] = useState({ "gongo": [], "user": []});
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const { id } = useParams();
    const [currentId, setId] = useState(id || null);
    const { userSn } = useStore();
    const [pdfFiles, setPdfFiles] = useState([]);
    const [images, setImages] = useState([]);
    const [post, setPost] = useState(null);
    const [isOwner, setIsOwner] = useState(false);

    // userboard 게시글 수정
    const handleEditPost = (post, imgs) => {
      navigate("/boardform", { state: { post, imgs } });
    };
    
    // userboard 게시글 삭제
    const handleDeletePost = async (boardSn) => {
      if (!window.confirm("정말 삭제하시겠습니까?")) return;
      try {
        await api.put(`/userboard/${boardSn}?userSn=${userSn}`);
        alert("게시글이 삭제되었습니다.");
        // 게시글 삭제 후 데이터 새로 불러오기
      if (activeTab === "user") {
        fetchUserBoardList(); // 사용자 게시판 새로고침
      }
        navigate("/userboard");
      } catch (error) {
        console.error("게시글 삭제 오류:", error);
        alert("게시글 삭제 중 오류가 발생했습니다.");
      }
    };
    
    const fetchUserBoardList = async () => {
      try {
        const response = await api.get("/userboard");
        setData((prevData) => ({
          ...prevData,
          user: response.data.boardListResponse || [],
        }));
      } catch (error) {
        console.error("Error fetching user board data:", error);
      }
    };

    // 게시판 리스트 로드
    useEffect(() => {
        const fetchData = async () => {
          try {
            if (activeTab === "user" && location.pathname.startsWith("/userboard")) {
              fetchUserBoardList(); // 사용자 게시판 로드
            } else if (activeTab === "gongo") {
              const response = await api.get("/gongoboard");
              setData((prevData) => ({ ...prevData, gongo: response.data.gongoListResponse || [] }));
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
        };
        fetchData();
    }, [activeTab, location.pathname]);

    // 페이지네이션 관련 데이터
    const itemsPerPage = 5;
    const activeTabData = data[activeTab] || [];
    const totalPages = Math.ceil((activeTabData.length) / itemsPerPage);
    const paginatedData = activeTabData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // 유저게시판 상세보기
    useEffect(() => {
      const fetchPostDetails = async () => {
        if (activeTab === "user" && location.pathname.startsWith("/userboard/") && id) {
          try {
            const response = await api.get(`/userboard/detail?boardSn=${id}&userSn=${userSn}`);
            setPost(response.data.post);
            setIsOwner(response.data.isOwner);
            setImages(response.data.imgs || []);
          } catch (error) {
            console.error("게시글을 가져오는 중 오류가 발생했습니다.", error);
          }
        } else {
          // id가 없으면 post, images 초기화
          setPost(null);
          setImages([]);
        }
      };
      fetchPostDetails();
    }, [activeTab, id, userSn, location.pathname]);

    // 공고게시판 상세보기
    useEffect(() => {
      const fetchPdfFiles = async () => {
        if (activeTab === "gongo" && location.pathname.startsWith("/gongoboard/") && id ) {
          try {
            const response = await api.get(`/gongoboard/detail?gongoSn=${id}`);
            setPdfFiles(response.data.pdfs || []);
          } catch (error) {
            console.error("PDF 파일 목록 불러오기 오류:", error);
          }
        } else {
          setPdfFiles([]);
        }
      };
      fetchPdfFiles();
    }, [activeTab, id, location.pathname]);

      if (activeTab === "user" && id ) {
        if (!post) return <Typography>Loading...</Typography>;
        return (
          <>
            <Header />
            <Box sx={{ width: "80%", margin: "0 auto", mt: 4 }}>
              <CustomTabs
                  tabs={tabs}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  setCurrentPage={setCurrentPage}
                  setId={setId}
              />
              <Paper
                elevation={2}
                sx={{
                  flex: 1,
                  padding: 4,
                  borderRadius: 3,
                  margin: 2,
                  backgroundColor: "white" }}>
            <Box sx={{ mt: 4, width: "80%", margin: "0 auto" }}>
              <Box sx={{ borderBottom: '1px solid #e0e0e0', pb: 1, mb: 1 }}>
                <Typography variant="h4" gutterBottom>
                  {post.title}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #e0e0e0',
                  pb: 1,
                  mb: 1,
                }}
              >
                <Typography variant="subtitle1">
                  작성자: {post.userName}
                </Typography>
                <Typography variant="subtitle1">
                  작성일: {post.createdDt}
                </Typography>
              </Box>

                <div
                  className="ql-editor"
                  style={{ whiteSpace: "pre-wrap", padding: "5px", height: "100%", borderBottom: '1px solid #e0e0e0', }}
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.content),
                  }}
                />
                  {/* 이미지 렌더링 */}
                  {images.length > 0 && (
                    <Box sx={{ mt: 4 }}>
                      <Typography variant="h6">첨부 이미지</Typography>
                      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                        {images.map((image) => (
                          <img
                            key={image.fileName}
                            src={`${image.path}${image.fileName}`}
                            alt={image.oriFileName}
                            style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {isOwner && (
                    <Box sx={{ mt: 2 }}>
                    <div style={{ marginTop: "20px" , textAlign: "center"}}>
                      <Button variant="outlined" onClick={() => handleEditPost(post, images)}>수정</Button>
                      <Button variant="contained" color="error" onClick={() => handleDeletePost(post.boardSn)} sx={{ ml: 2 }}>삭제</Button>
                    </div>
                    </Box>
                  )}
              <div style={{textAlign: "right"}}>
                <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate("/userboard")}>목록</Button>
              </div>
            </Box>
            </Paper>
        </Box>
        </>
        );
    }

    // 공고게시물 클릭시
    if (activeTab === "gongo" && id ) {
      const post = data[activeTab]?.find((item) => item.gongoSn === parseInt(id));
      if (!post) return <Typography>Loading...</Typography>;
      
      const downloadPdf = async (pdfSn, originalFileName) => {
        try {
          const response = await api.get(`/gongoboard/pdf/download/${pdfSn}`, {
            responseType: 'blob', // Expecting a binary file
          }
        );
          const blob = new Blob([response.data]);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = originalFileName;
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url); // 메모리 해제
        } catch (error) {
          console.error("PDF 다운로드 오류:", error);
          alert("PDF 다운로드 중 오류가 발생했습니다.");
        }
      };
    
      return (
        <>
          <Header />
          <Box sx={{ width: "80%", margin: "0 auto",  mt: 4 }}>
            <CustomTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setCurrentPage={setCurrentPage}
                setId={setId}
            />
          <Paper
            elevation={2}
            sx={{
              flex: 1,
              padding: 4,
              borderRadius: 3,
              margin: 2,
              backgroundColor: "white",
            }}>
          <Box sx={{ mt: 4, width: "80%", margin: "0 auto" }}>
            <Box sx={{ borderBottom: '1px solid #e0e0e0', pb: 1, mb: 2 }}>
              <Typography variant="h4" gutterBottom>
                {post.gongoName}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #e0e0e0',
                pb: 1, mb: 1 }}>
              <Typography variant="subtitle1">
                공고 유형: {post.gongoType === 0 ? "청년안심주택" : post.gongoType === 1 ? "청년매입임대" : "기타"}
              </Typography>
              <Typography variant="subtitle1">
                작성일: {post.createdDt}
              </Typography>
            </Box>
  
            <Box sx={{ borderBottom: '1px solid #e0e0e0', pb: 1, mb: 1 }}>
              <Typography variant="subtitle2" >
                시작일: {post.scheduleStartDt} | 종료일: {post.scheduleEndDt}
              </Typography>
            </Box>
            
          <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
             {pdfFiles.map((pdf) => (
                <li key={pdf.pdfSn}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    borderBottom: "1px solid #ddd", // 구분선을 추가
                    padding: "5px 0", // 항목 간격
                }}>
                  <span style={{ marginRight: "10px", fontWeight: "bold" }}>첨부</span>
                  <a
                    href="#"
                    style={{ color: "blue", textDecoration: "underline"}}
                    onClick={(e) => {
                      e.preventDefault();
                      downloadPdf(pdf.pdfSn, pdf.oriFileName);
                    }}
                  >
                    {pdf.oriFileName}
                  </a>
                </li>
              ))}
            </ul>

            <div
              style={{ whiteSpace: 'pre-wrap', marginTop: "16px" }}
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content, {
                ALLOWED_TAGS: ['p', 'strong', 'em', 'u', 's', 'blockquote', 'ol', 'ul', 'li', 'span', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
                ALLOWED_ATTR: ['style', 'class', 'size'],
                ALLOWED_CSS_PROPERTIES: ['color', 'font-size', 'font-weight', 'font-family', 'line-height'],
                ALLOWED_CLASSES: {
                  '*': ['ql-size-small', 'ql-size-large', 'ql-size-huge']
                }
              })}}
            />
                  {/*  __html: DOMPurify.sanitize(post.content) */}
              <div style={{textAlign: "right"}}>
                <Button sx={{ mt: 4 }} variant="contained" onClick={() => navigate("/gongoboard")}>목록</Button>
              </div>
          </Box>
          </Paper>
      </Box>
      </>
      );
  }

  // 게시판 리스트
  return (
    <>
      <Header />
      <Box sx={{ width: "80%", margin: "0 auto", textAlign: "center", mt: 4 }}>

      <CustomTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setCurrentPage={setCurrentPage}
        setId={setId}
      />

      {/* 게시판 내용 */}
      <Box sx={{ mt: 4 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>제목</TableCell>
              {activeTab === "user" && <TableCell>글쓴이</TableCell>}
              <TableCell sx={{ textAlign: "right", paddingRight: "14.5rem" }}>작성일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow 
                key={activeTab === "gongo" ? item.gongoSn : item.boardSn}
                onClick={() => {
                  if (activeTab === "gongo") {
                    navigate(`/gongoboard/${item.gongoSn}`,
                    );
                  } else {
                    navigate(`/userboard/${item.boardSn}`,
                    );
                  }
                }}
                  sx={{ cursor: "pointer" }}
              >
                <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{activeTab === "gongo" ? item.gongoName : item.title}</TableCell>
                {activeTab === "user" && <TableCell>{item.userName}</TableCell>}
                <TableCell sx={{ textAlign: "right", paddingRight: "10rem" }}>{item.createdDt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* 페이지네이션 */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
              color="primary"
            />
          </Box>
      </Box>
      
      {/* 유저게시판 탭일 때만 글쓰기 버튼 표시 */}
      {activeTab === "user" && (
        <>
          {/* 글쓰기 버튼 */}
          <Box sx={{ textAlign: "right", mt: 2 }}>
            <Button variant="contained" color="primary" 
            onClick={() => navigate("/boardform")}
            sx={{ mr: 2 }} >
              글쓰기
            </Button>
          </Box>
        </>
      )}
    </Box>
    </>
  );
};

export default Board;
