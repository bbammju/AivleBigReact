import React from 'react';
import InputModal from './pages/InputModal'; // InputModal 컴포넌트를 import
import Main from './pages/Main'; // 메인 페이지
import EmailCheck from './pages/EmailCheck'; // 이메일 중복 체크 페이지
import Signup from './pages/Signup'; // 회원가입
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 경로("/")에 InputModal 컴포넌트를 렌더링 */}
        <Route path="/input" element={<InputModal />} />
        <Route path="/" element={<Main />} />
        <Route path="/email-check" element={<EmailCheck />} />
        <Route path="/signup" element={<Signup />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;