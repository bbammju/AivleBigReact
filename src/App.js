import React from 'react';
import InputModal from './pages/InputModal'; // InputModal 컴포넌트를 import
//import Signup from './pages/Signup'; // 회원가입
import Login from './pages/Login'; // 로그인
import Main from './pages/Main'; // 메인 페이지
import Mypage from './pages/Mypage'; // 마이 페이지
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 경로("/")에 InputModal 컴포넌트를 렌더링 */}
        <Route path="/" element={<InputModal />} />
        <Route path="/main" element={<Main />} />
        {/*<Route path="/signup" element={<Signup />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<Mypage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;