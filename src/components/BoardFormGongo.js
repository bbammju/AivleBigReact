import React, { useState, useMemo, useRef } from "react";
import api from "../utils/api";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Header from "../components/headersub";
import { Button, TextField, Box, Paper, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useStore, userRole } from '../zustand/store';
import DOMPurify from "dompurify";

const BoardFormGongo = () => {
    const [gongoName, setGongoName] = useState("");
    const [content, setContent] = useState("");
    const [scheduleStartDt, setScheduleStartDt] = useState("");
    const [scheduleEndDt, setScheduleEndDt] = useState("");
    const [gongoType, setGongoType] = useState(null);
    const [files, setFiles] = useState([]);
    const quillRef = useRef();
    const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter(file => file.type === "application/pdf");
    if (validFiles.length < selectedFiles.length) {
      alert("PDF 파일만 업로드 가능합니다.");
    }
    setFiles(validFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ["p", "strong", "em", "u", "br", "h1", "h2", "h3"],
    });

    const formData = new FormData();
    formData.append("gongoName", gongoName);
    formData.append("content", sanitizedContent);
    formData.append("gongoType", gongoType);
    formData.append("scheduleStartDt", scheduleStartDt);
    formData.append("scheduleEndDt", scheduleEndDt);

    files.forEach(file => formData.append("files", file));

    try {
      const response = await api.post("/post-gongoboard", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        alert("공고 게시글이 등록되었습니다!");
        navigate("/gongoboard");
      } else {
        alert("게시글 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("오류가 발생했습니다.");
    }
  };

  const modules = useMemo(() => ({
    toolbar: [["bold", "italic", "underline"], [{ size: [] }]],
  }), []);

  return (
    <>
    <Header />
    <Box sx={{ width: "80%", margin: "0 auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>공고 게시글 작성</Typography>
      <Paper elevation={2} sx={{ padding: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="공고 제목"
            value={gongoName}
            onChange={(e) => setGongoName(e.target.value)}
            required
            sx={{ mb: 3 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="gongo-type-label" sx={{ zIndex: 1, backgroundColor: "white", paddingRight: "4px" }}>공고 유형</InputLabel>
            <Select
              labelId="gongo-type-label"
              value={gongoType}
              onChange={(e) => setGongoType(e.target.value)}
              required
            >
              <MenuItem value={0}>청년안심주택</MenuItem>
              <MenuItem value={1}>청년매입임대</MenuItem>
              <MenuItem value={2}>기타</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="시작일 (YYYY-MM-DD)"
            value={scheduleStartDt}
            onChange={(e) => setScheduleStartDt(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="종료일 (YYYY-MM-DD)"
            value={scheduleEndDt}
            onChange={(e) => setScheduleEndDt(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            ref={quillRef}
            style={{ height: "300px", marginBottom: "20px" }}
          />
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 5,  }}>
            <input type="file" multiple accept="application/pdf" onChange={handleFileChange} />
            <Box sx={{ display: "flex" , gap: 1 }}>
                <Button variant="contained" type="submit" style={{ marginTop: "20px" }}>게시글 등록</Button>
                <Button sx={{ ml: 2 }} variant="outlined" onClick={() => navigate("/gongoboard")} style={{ marginTop: "20px" }}>취소</Button>
            </Box>
          </Box>
          
          
        </form>
      </Paper>
    </Box>
    </>
  );
};

export default BoardFormGongo;
