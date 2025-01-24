import React from 'react';
import InputModal from './pages/InputModal'; // Input모달창창
import Main from './pages/Main'; // 메인 페이지
import RsltList from './pages/RsltList';
// import EmailCheck from './pages/EmailCheck'; // 이메일 중복 체크 페이지
import Signup from './pages/Signup'; // 회원가입
import ForgotPassword  from './pages/ForgotPassword'; // 비밀번호 찾기
import Mypage from './pages/Mypage'; // 마이페이지
import FavoritesPage from './pages/FavoritesPage'; // 관심주택 페이지
import PwChange from './pages/PwChange';
import EditProfile from "./pages/EditProfile";
import WithdrawalPage from "./pages/WithdrawalPage";
import Board from './pages/Board'; // 게시판
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>        
        <Route path="/" element={<Main />} />
        <Route path="/input" element={<InputModal />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/list" element={<RsltList />} />
        <Route path="/forgot-password" element={< ForgotPassword />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/editprofile" element={<EditProfile />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/pwchange" element={<PwChange />} />
        <Route path="/withdrawal" element={<WithdrawalPage />} />
        <Route path="/board" element={<Board />} />
        <Route path="/board/:id" element={<Board />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;