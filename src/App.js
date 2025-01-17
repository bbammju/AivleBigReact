import React from 'react';
import InputModal from './pages/InputModal'; // InputModal 컴포넌트를 import
import Main from './pages/Main'; // 메인 페이지
<<<<<<< HEAD
import Mypage from './pages/Mypage'; // 마이 페이지
=======
import EmailCheck from './pages/EmailCheck'; // 이메일 중복 체크 페이지
import Signup from './pages/Signup'; // 회원가입
>>>>>>> 61dc31c14cfee2ad8dd218174e5bcf72b5d069d9
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 경로("/")에 InputModal 컴포넌트를 렌더링 */}
        <Route path="/" element={<InputModal />} />
        <Route path="/main" element={<Main />} />
<<<<<<< HEAD
        {/*<Route path="/signup" element={<Signup />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<Mypage />} />
=======
        <Route path="/email-check" element={<EmailCheck />} />
        <Route path="/signup" element={<Signup />} />
        
>>>>>>> 61dc31c14cfee2ad8dd218174e5bcf72b5d069d9
      </Routes>
    </BrowserRouter>
  );
}

export default App;