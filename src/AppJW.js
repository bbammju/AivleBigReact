import React from 'react';
import InputModal from './pages/InputModal'; // InputModal 컴포넌트를 import
import Main from './pages/Main'; // 메인 페이지
import EmailCheck from './pages/EmailCheck'; // 이메일 중복 체크 페이지
import Signup from './pages/Signup'; // 회원가입
import RsltList from './pages/RsltList';
import Mypage from './pages/Mypage'; // 마이 페이지
import FavoritesPage from "./pages/FavoritesPage"; // 관심주택 페이지
import PwChange from "./pages/PwChange";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/FavoritesPage" element={<FavoritesPage />} />
        <Route path="/PwChange" element={<PwChange />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;