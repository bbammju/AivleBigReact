// src/components/BoardForm.js
import React, { useState, useMemo, useCallback, useRef } from 'react';
import api from '../utils/api';
import apiFile from '../utils/apiFile';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Header from "../components/header";
import { Tabs, Tab, Box, Typography, Paper
 } from "@mui/material";
 import { useNavigate } from "react-router-dom";
 import { useStore } from '../zustand/store';

const BoardForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState('user');
  const navigate = useNavigate();
  const quillRef = useRef();
  const { userSn } = useStore();

  // 파일 선택 핸들러
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // const tabs = [
  //   { id: "gongo", label: "공고게시판" },
  //   { id: "user", label: "유저게시판" },
  //   { id: "news", label: "청약뉴스" }
  // ];

  // 게시글 등록 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // FormData 생성 및 데이터 추가
    const formData = new FormData();
    formData.append('title', title);
    // const sanitizedContent = content.replace(/<img[^>]*>/g, ''); // 이미지 태그 제거
    // formData.append('content', sanitizedContent);
    formData.append('content', content);
    formData.append('userSn', userSn);
    
    try {
      // 파일 업로드 진행률 관리 예시
      let uploadedFileUrl = null;
      if (file) {
        const response = await apiFile.uploadFile(file);
        uploadedFileUrl = response.url; // 서버에서 반환하는 URL 사용
      }

      formData.append('fileUrl', uploadedFileUrl);
      const response = await api.post('/post-board', formData,
        { headers: { 'Content-Type': "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        alert('게시글이 등록되었습니다!');
        // 게시글 등록 성공 후 /board 페이지로 리다이렉트
        navigate('/board', { state: { activeTab: 'user' } });
      } else {
        alert('게시글 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('오류가 발생했습니다.');
    }
  };

// 이미지 핸들러
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append("image", file);

      try {
        const refSn = 28;
        const res = await apiFile.uploadFile(file);
        // const res = await api.post(`/files/upload?refTable=board&refSn=${refSn}`, formData); // 이미지 업로드 API 경로
        const url = res.data?.url || res.url || res.fileUrl;
        if (!url) {
          alert("이미지 업로드 실패: 유효한 URL을 받지 못했습니다.");
          return;
        }

        const quill = quillRef.current.getEditor();
        const range = quill.getSelection()?.index;
        if (typeof range !== "number") return;
        quill.setSelection(range, 1);
        quill.clipboard.dangerouslyPasteHTML(
          range,
          `<img src=${url} alt="image" />`
        );
      } catch (error) {
        alert("이미지 업로드에 실패했습니다.");
      }
    };
  }, []);

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
                  ["image"],
              ],
              handlers: { // 위에서 만든 이미지 핸들러 사용하도록 설정
                  image: imageHandler,
              },
          },
      }), [imageHandler]);

  return (
    <>
    <Header />
    <Box sx={{ width: "80%", margin: "0 auto", textAlign: "center", mt: 4 }}>
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} centered>
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
            <input id="file" type="file" onChange={handleFileChange} />
            <button type="submit" style={{ marginTop: "20px" }}>
              게시글 등록
            </button>
          </form>
    </div>
    </Paper>
    </Box>
    </>
  );
};

export default BoardForm;
