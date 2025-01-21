import React from 'react';
import InputModal from './pages/InputModal'; // InputModal 컴포넌트를 import
import Main from './pages/Main'; // 메인 페이지
import Mypage from './pages/Mypage'; // 마이 페이지
import EmailCheck from './pages/EmailCheck'; // 이메일 중복 체크 페이지
import Signup from './pages/Signup'; // 회원가입
import ForgotPassword  from './pages/ForgotPassword'; // 비밀번호 찾기
import RsltList from './pages/RsltList';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*<Route path="/signup" element={<Signup />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/" element={<Main />} />
        <Route path="/input" element={<InputModal />} />
        <Route path="/email-check" element={<EmailCheck />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/list" element={<RsltList />} />
        <Route path="/forgot-password" element={< ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;