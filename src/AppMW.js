import React from 'react';
import InputModal from './pages/InputModal'; // InputModal 컴포넌트를 import
import Main from './pages/Main'; // 메인 페이지
import EmailCheck from './pages/EmailCheck'; // 이메일 중복 체크 페이지
import Signup from './pages/Signup'; // 회원가입
import RsltList from './pages/RsltList';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/list4" element={<RsltList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;