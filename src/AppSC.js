import React from 'react';
// import InputModal from './pages/InputModal'; // InputModal 컴포넌트를 import
// import Main from './pages/Main'; // 메인 페이지
// import EmailCheck from './pages/EmailCheck'; // 이메일 중복 체크 페이지
// import Signup from './pages/Signup'; // 회원가입
import FindPassword  from './pages/FindPassword'; // 비밀번호 찾기
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/find-password" element={< FindPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;