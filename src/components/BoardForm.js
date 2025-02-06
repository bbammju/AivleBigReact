// src/components/BoardForm.js
import React, { useState, useMemo, useRef, useEffect } from 'react';
import api from '../utils/api';
// import apiFile from '../utils/apiFile';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Header from "../components/headersub";
import { Tabs, Tab, Box, Typography, Paper
 } from "@mui/material";
 import { useNavigate, useLocation  } from "react-router-dom";
 import { useStore } from '../zustand/store';

const BoardForm = () => {
  const [activeTab, setActiveTab] = useState('user');
  const navigate = useNavigate();
  const quillRef = useRef();
  const { userSn } = useStore();
  const location = useLocation();
  const post = location.state?.post; // 전달받은 게시글 데이터

  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [files, setFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deletedFileIds, setDeletedFileIds] = useState([]);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      fetchExistingImages();
    }
  }, [post]);

  const fetchExistingImages = async () => {
    try {
      const response = await api.get(`/board/images?boardSn=${post.boardSn}`);
      setExistingImages(response.data);
    } catch (error) {
      console.error('Failed to fetch existing images:', error);
    }
  };

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // 이미지 파일만 필터링
    const validFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
    if (validFiles.length < selectedFiles.length) {
      alert('이미지 파일만 업로드 가능합니다.');
    }
    setFiles(validFiles);
  };

  const handleDeleteExistingImage = (imageId) => {
    setDeletedFileIds(prevIds => [...prevIds, imageId]);
    setExistingImages(prevImages => prevImages.filter(img => img.id !== imageId));
  };

  // 게시글 등록 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // FormData 생성 및 데이터 추가
    const formData = new FormData();
    formData.append('boardSn', post?.boardSn || '');
    formData.append('title', title);
    formData.append('content', content);
    formData.append('userSn', userSn);

    // 다중 파일 추가
    files.forEach(file => formData.append('files', file));
    deletedFileIds.forEach(id => formData.append('deletedFileIds', id));
    
    try {
      if (post) {
        // 게시글 수정 요청
        await api.post(`/board`, formData,
          { headers: { 'Content-Type': "multipart/form-data" },
        }
        );
        alert("게시글이 수정되었습니다.");
      } else {
        // 새 게시글 등록 요청
        const response = await api.post('/post-board', formData,
          { headers: { 'Content-Type': "multipart/form-data" },
        });

        if (response.status === 200 || response.status === 201) {
          alert('게시글이 등록되었습니다!');
        } else {
          alert('게시글 등록에 실패했습니다.');
        }
      }
      navigate('/board', { state: { activeTab: 'user' } });
    } catch (error) {
      console.error('Error:', error);
      alert('오류가 발생했습니다.');
    }
  };

    const modules = useMemo(
      () => ({
          toolbar: { // 툴바에 넣을 기능들을 순서대로 나열하면 된다.
              container: [
                  ["bold", "italic", "underline", "strike", "blockquote"],
                  [{ size: ["small", false, "large", "huge"] }, { color: [] }],
                  [
                      { list: "ordered" },
                      { list: "bullet" },
                      { indent: "-1" },
                      { indent: "+1" },
                      { align: [] },
                  ],
              ],
          },
      }), []);

  // 탭 클릭 시 페이지 이동
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 'gongo') navigate('/board', { state: { activeTab: 'gongo' }});
    if (newValue === 'user') navigate('/board', { state: { activeTab: 'user' }});
    if (newValue === 'news') navigate('/board', { state: { activeTab: 'news' }});
  };

  return (
    <>
    <Header />
    <Box sx={{ width: "80%", margin: "0 auto", textAlign: "center", mt: 4 }}>
      <Tabs value={activeTab} onChange={handleTabChange} centered>
          {["공고게시판", "유저게시판", "청약뉴스"].map((label, id) => (
            <Tab key={id} label={label} value={label.toLowerCase()} />
          ))}
      </Tabs>

        {activeTab === "user" && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>유저게시판</Typography>
          </Box>
        )}
        
    <Paper
      elevation={2}
      sx={{
          flex: 1,
          padding: 4,
          borderRadius: 3,
          margin: 2,
          backgroundColor: "white",
      }}
    >
          
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>게시글 작성</h2>
      <form onSubmit={handleSubmit}>
        <div>
            <input
              id="title"
              type="text"
              placeholder="제목을 입력해 주세요"
              style={{padding:'7px', marginBottom:'10px',width:'100%',border:'1px solid lightGray', fontSize:'15px'}}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
        </div>
        <div style={{height:'650px'}}>
            <ReactQuill
              theme="snow"
              placeholder="내용을 입력해 주세요"
              value={content}
              modules={modules}
              onChange={setContent}
              ref={quillRef}
              style={{ height: "600px", marginBottom: "20px" }}
            />
        </div>
            <label htmlFor="file">파일 업로드:</label>
            <input id="file" type="file" multiple accept="image/*" onChange={handleFileChange} />
            {existingImages.map(img => (
                <div key={img.id}>
                  <img src={img.path} alt={img.oriFileName} style={{ maxWidth: '100px' }} />
                  <button type="button" onClick={() => handleDeleteExistingImage(img.id)}>삭제</button>
                </div>
              ))}
            <button type="submit" style={{ marginTop: "20px" }}>{post ? "수정하기" : "게시글 등록"}</button>
            <button sx={{ ml: 2 }} variant="outlined" onClick={() => navigate("/board")}>취소</button>
          </form>
    </div>
    </Paper>
    </Box>
    </>
  );
};

export default BoardForm;
