import React, { useState, useEffect } from "react";
import Header from "../components/headersub";
import api from "../utils/api";
import { useNavigate, useParams, useLocation  } from "react-router-dom";
import { Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, Box, Typography,
    Button, Paper,
  Pagination,
 } from "@mui/material";
import { useStore } from '../zustand/store';
// import DOMPurify from 'dompurify';

// CustomTabs 컴포넌트
const CustomTabs = ({ tabs, activeTab, setActiveTab, setCurrentPage }) => {
    return (
      <Tabs
        value={activeTab}
        onChange={(event, newValue) => {
          setActiveTab(newValue);
          setCurrentPage(1);
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
  
  function sanitizeHtml(content) {
    return content
      .replace(/<p>\s*<\/p>/g, '')  // 빈 <p> 태그 제거
      .replace(/<\/?p>/g, '<br>')   // <p> 태그를 줄바꿈으로 변환
      .replace(/<(?!img)[^>]+>/g, '');  // img 태그 외 모든 태그 제거
  }
  
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
    const { userSn } = useStore();

    const handleEditPost = (post, imgs) => {
      navigate("/boardform", { state: { post, imgs } });
    };
    
    const handleDeletePost = async (boardSn) => {
      if (!window.confirm("정말 삭제하시겠습니까?")) return;
      try {
        await api.put(`/board/${boardSn}?userSn=${userSn}`);
        alert("게시글이 삭제되었습니다.");
        // 게시글 삭제 후 데이터 새로 불러오기
      if (activeTab === "user") {
        fetchUserBoardList(); // 사용자 게시판 새로고침
      }
        navigate("/board");
      } catch (error) {
        console.error("게시글 삭제 오류:", error);
        alert("게시글 삭제 중 오류가 발생했습니다.");
      }
    };
    
    const fetchUserBoardList = async () => {
      try {
        const response = await api.get("/board");
        setData((prevData) => ({
          ...prevData,
          user: response.data.boardListResponse || [],
        }));
      } catch (error) {
        console.error("Error fetching user board data:", error);
      }
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            if (activeTab === "user") {
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
    }, [activeTab]);

    // 페이지네이션 관련 데이터
    const itemsPerPage = 5;
    const activeTabData = data[activeTab] || [];
    const totalPages = Math.ceil((activeTabData.length) / itemsPerPage);
    const paginatedData = activeTabData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Render detailed post if an ID is provided
    const [images, setImages] = useState([]);
    const [post, setPost] = useState(null);
    const [isOwner, setIsOwner] = useState(false);

    // useEffect(() => {
    //   // 이미지 정보 가져오기
    //   const fetchImages = async () => {
    //     if (activeTab === "user" && id ) {
    //       try {
    //         const response = await api.get(`/board/images?boardSn=${id}`); // 서버 이미지 API 호출
    //         setImages(response.data);
    //       } catch (error) {
    //         console.error("이미지를 가져오는 중 오류가 발생했습니다.", error);
    //       }
    //     }
    //   };
    //   fetchImages();
    // }, [activeTab, id]);

      useEffect(() => {
        const fetchPostDetails = async () => {
          if (activeTab === "user" && id) {
            try {
              const response = await api.get(`/board/detail?boardSn=${id}&userSn=${userSn}`);
              setPost(response.data.post);
              setIsOwner(response.data.isOwner);
              setImages(response.data.imgs || []);
            } catch (error) {
              console.error("게시글을 가져오는 중 오류가 발생했습니다.", error);
            }
          }
        };
        fetchPostDetails();
      }, [activeTab, id, userSn]);

      if (activeTab === "user" && id ) {
        if (!post) return <Typography>Loading...</Typography>;
        return (
          <>
            <Header />
            <Box sx={{ width: "80%", margin: "0 auto", textAlign: "center", mt: 4 }}>
              <CustomTabs
                  tabs={tabs}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  setCurrentPage={setCurrentPage}
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
                <Typography variant="h4" gutterBottom>
                {post.title}
                </Typography>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                작성자: {post.userName} | 작성일: {post.createdDt}
                </Typography>
                <Typography variant="body1">
                  <div
                    style={{ whiteSpace: 'pre-wrap' }}
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content)}}
                  />
                  {/*  __html: DOMPurify.sanitize(post.content) */}
                  </Typography>
                  {/* 이미지 렌더링 */}
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
                  {isOwner && (
                    <div style={{ marginTop: "20px" }}>
                      <Button variant="outlined" onClick={() => handleEditPost(post, images)}>수정</Button>
                      <Button variant="contained" color="error" onClick={() => handleDeletePost(post.boardSn)}>삭제</Button>
                    </div>
              )}
                <Button sx={{ mt: 4 }} variant="contained" onClick={() => navigate("/board")}>뒤로가기</Button>
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

      return (
        <>
          <Header />
          <Box sx={{ width: "80%", margin: "0 auto", textAlign: "center", mt: 4 }}>
            <CustomTabs
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                setCurrentPage={setCurrentPage}
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
              <Typography variant="h4" gutterBottom>
                {post.gongoName}
              </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                공고 유형: {post.gongoType}
            </Typography>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                작성일: {post.createdDt}
              </Typography>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
              시작일: {post.scheduleStartDt} | 종료일: {post.scheduleEndDt}
            </Typography>
              <Button sx={{ mt: 4 }} variant="contained" onClick={() => navigate("/board")}>
              뒤로가기
              </Button>
          </Box>
          </Paper>
      </Box>
      </>
      );
  }

  return (
    <>
      <Header />
      <Box sx={{ width: "80%", margin: "0 auto", textAlign: "center", mt: 4 }}>

      <CustomTabs
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setCurrentPage={setCurrentPage}
      />

      {/* 게시판 내용 */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {tabs.find((tab) => tab.id === activeTab)?.label || ""}
        </Typography>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>No</TableCell>
              <TableCell>제목</TableCell>
              {activeTab === "user" && <TableCell>글쓴이</TableCell>}
              <TableCell>작성일</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow 
                key={activeTab === "gongo" ? item.gongoSn : item.boardSn}
                onClick={() => {
                  if (activeTab === "gongo") {
                    navigate(`/gongoboard/${item.gongoSn}`);
                  } else {
                    navigate(`/board/${item.boardSn}`);
                  }
                }}
                  sx={{ cursor: "pointer" }}
              >
                <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell>{activeTab === "gongo" ? item.gongoName : item.title}</TableCell>
                {activeTab === "user" && <TableCell>{item.userName}</TableCell>}
                <TableCell>{item.createdDt}</TableCell>
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
