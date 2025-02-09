// src/components/BoardForm.js
import React, { useState, useMemo, useRef, useEffect } from 'react';
import api from '../utils/api';
// import apiFile from '../utils/apiFile';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Header from "../components/headersub";
import { Tabs, Tab, Box, Typography, Paper, Button
 } from "@mui/material";
 import { useNavigate, useLocation  } from "react-router-dom";
 import { useStore } from '../zustand/store';
 import DOMPurify from 'dompurify';

const BoardForm = () => {
  const [activeTab, setActiveTab] = useState('user');
  const tabs = [
    { id: "gongo", label: "공고게시판" },
    { id: "user", label: "유저게시판" },
  ];
  const navigate = useNavigate();
  const quillRef = useRef();
  const { userSn } = useStore();
  const location = useLocation();
  const post = location.state?.post; // 전달받은 게시글 데이터
  const imgs = location.state?.imgs;

  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [files, setFiles] = useState([]); // 사용자가 새로 추가한 이미지 파일 목록
  const [existingImages, setExistingImages] = useState([]); // 서버로부터 받은 이미지
  const [deletedFileIds, setDeletedFileIds] = useState([]);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    }
    if (imgs) {
      setExistingImages(imgs);
    }
  }, [post, imgs]);

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // 이미지 파일만 필터링
    const validFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
    if (validFiles.length < selectedFiles.length) {
      alert('이미지 파일만 업로드 가능합니다.');
    }
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  };

  const handleDeleteExistingImage = (imageId) => {
    setDeletedFileIds(prevIds => [...prevIds, imageId]);
    setExistingImages(prevImages => prevImages.filter(img => img.imgSn !== imageId));
    console.log(`이미지 ${imageId} 삭제 요청됨`);
  };

  // 게시글 등록 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // DOMPurify로 content를 안전하게 처리하면서, 스타일과 필요한 속성들을 허용하도록 설정
    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['p', 'strong', 'em', 'u', 's', 'blockquote', 'ol', 'ul', 'li', 'span', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'], // 허용할 태그
      ALLOWED_ATTR: ['style', 'class', 'size'], // 허용할 속성 (style 포함)
      ALLOWED_CSS_PROPERTIES: ['color', 'font-size', 'font-weight', 'font-family'], // 허용할 CSS 속성
      ALLOWED_CLASSES: {
        '*': ['ql-size-small', 'ql-size-large', 'ql-size-huge']
      }
    });

    // FormData 생성 및 데이터 추가
    const formData = new FormData();
    formData.append('boardSn', post?.boardSn || '');
    formData.append('title', title);
    formData.append('content', content);
    formData.append('userSn', userSn);
    // formData.append('existingImages', imgs);

    // 다중 파일 추가
    files.forEach(file => formData.append('files', file));
    deletedFileIds.forEach(id => formData.append('deletedFileIds', id));
    
    try {
      if (post) {
        // 게시글 수정 요청
        await api.post(`/userboard`, formData,
          { headers: { 'Content-Type': "multipart/form-data" },
        }
        );
        alert("게시글이 수정되었습니다.");
      } else {
        // 새 게시글 등록 요청
        const response = await api.post('/post-userboard', formData,
          { headers: { 'Content-Type': "multipart/form-data" },
        });

        if (response.status === 200 || response.status === 201) {
          alert('게시글이 등록되었습니다!');
        } else {
          alert('게시글 등록에 실패했습니다.');
        }
      }
      navigate('/userboard', { state: { activeTab: 'user' } });
    } catch (error) {
      console.error('Error:', error);
      alert('오류가 발생했습니다.');
    }
  };

    const modules = useMemo(
      () => ({
          toolbar: { // 툴바에 넣을 기능들을 순서대로 나열하면 된다.
              container: [
                  ["bold", "italic", "underline", "strike"],
                  [{ size: ["small", false, "large", "huge"] }, { color: [] }],
                  // [
                  //     { list: "ordered" },
                  //     { list: "bullet" },
                  //     { indent: "-1" },
                  //     { indent: "+1" },
                  //     { align: [] },
                  // ],
              ],
          },
      }), []);

  // 탭 클릭 시 페이지 이동
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 'gongo') navigate('/gongoboard', { state: { activeTab: 'gongo' }});
    if (newValue === 'user') navigate('/userboard', { state: { activeTab: 'user' }});
  };

  return (
    <>
    <Header />
    <Box sx={{ width: "80%", margin: "0 auto", textAlign: "center", mt: 4 }}>
      <Tabs value={activeTab} onChange={handleTabChange} centered
      indicatorColor="primary"
      textColor="primary"
      sx={{
        width: "80%",
        margin: "0 auto",
      }}>
          {tabs.map((tab) => (
            <Tab key={tab.id} label={tab.label} value={tab.id}
            sx={{
              fontSize: "1.5rem",
              padding: "15px",
              minWidth: "150px",
            }}
            />
          ))}
      </Tabs>
        
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
          
    <div style={{ maxWidth: '100%', margin: '0 auto' }}>
      <h2>게시글 작성</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ width: '100%', marginBottom: '10px' }}>
            <input
              id="title"
              type="text"
              placeholder="제목을 입력해 주세요"
              style={{padding:'7px', marginBottom:'10px', width:'100%', border:'1px solid lightGray', fontSize:'15px', boxSizing: 'border-box'}}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
        </div>
        <div style={{height:'650px', width: '100%'}}>
            <ReactQuill
              theme="snow"
              placeholder="내용을 입력해 주세요"
              value={content}
              modules={modules}
              onChange={setContent}
              ref={quillRef}
              style={{ height: "600px", marginBottom: "20px" ,width: '100%', boxSizing: 'border-box'}}
            />
        </div>
        <div style={{ width: '100%', marginBottom: '10px' }}>
            <label htmlFor="file">파일 업로드: </label>
            <input id="file" type="file" multiple accept="image/*" onChange={handleFileChange} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px', marginBottom: '10px' }}>
              {files.map((file, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src={URL.createObjectURL(file)} alt={file.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                  <span>{file.name}</span>
                </div>
              ))}
            </div>
            <div style={{ width: '100%', marginBottom: '10px', display: 'flex', flexWrap: 'wrap', }}>
              {existingImages && existingImages.map(img => (
                  img && img.path ? (
                    <div key={img.imgSn} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <img src={`${img.path}${img.fileName}`} alt={img.oriFileName || '이미지'} style={{ maxWidth: '100px', objectFit: 'cover' }} />
                      <Button type="button" variant="contained" onClick={() => handleDeleteExistingImage(img.imgSn)}>삭제</Button>
                    </div>
                  ) : null
                ))}
            </div>
        </div>
            <Button variant="outlined" type="submit" style={{ marginTop: "20px" }}>{post ? "수정하기" : "게시글 등록"}</Button>
            <Button sx={{ ml: 2 }} variant="outlined" style={{ marginTop: "20px" }} onClick={() => navigate("/userboard", {state: {activeTab: "user"}})}>취소</Button>
          </form>
    </div>
    </Paper>
    </Box>
    </>
  );
};

export default BoardForm;
