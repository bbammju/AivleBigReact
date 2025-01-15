import axios from "axios";
import React, {useState} from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaBolt } from "react-icons/fa";
import Header from '../components/header';
import { useStore } from "../zustand/store";

const Login = () => {
  const { keyword, setKeyword } = useStore();
  const navigate = useNavigate()
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [list, setList] = useState([])
  const idHandler = (e) => {
		setId(e.target.value);
	};
  const passwordHandler = (e) => {
		setPassword(e.target.value);
	};
  const loginHandler = async () => {
    const token = await axios.post('http://localhost:7773/api/list-test',
       {employeeName: id
        , email: 'stwin@naver.com'
        , phone: '01065683055'
        , gender: 'M'
      })
    if (token) {
      setList(token)
    }
    // if (token.data) {
    //   window.localStorage.setItem('accessToken', token.data)
    //   navigate('/main')
    // }
    // else {
    //   alert('로그인에 실패했습니다.')
    // }
  }
  const listconsole = () => {
		console.log(list);
	};
  return (
    <>
      <Header />
      <LoginContainer>
      <LoginBox>
        <Title>
          <FaBolt style={{ marginRight: "10px" }} />
          로그인
        </Title>
        <InputBox>
          <Input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <Input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputBox>
        {/* <CheckboxContainer>
          <Checkbox
            type="checkbox"
            checked={autoLogin}
            onChange={() => setAutoLogin(!autoLogin)}
          />
          자동로그인
        </CheckboxContainer> */}
        <GuideBox>
          <GuideText>
            <strong>회원로그인 안내</strong>
            <br />
            회원아이디 및 비밀번호가 기억 안나실 때는 아이디/비밀번호 찾기를
            이용하십시오.
            <br />
            아직 회원이 아니시라면 회원으로 가입 후 이용해 주십시오.
          </GuideText>
        </GuideBox>
        <LoginButton onClick={loginHandler}>로그인</LoginButton>
        <LoginButton onClick={listconsole}>로그인</LoginButton>
        <EtcContainer>
          <EtcText>아직 회원이 아니세요?</EtcText>
          <EtcText>아이디/비밀번호를 잊으셨나요?</EtcText>
        </EtcContainer>
      </LoginBox>
    </LoginContainer>
    </>
    
  );
};

export default Login;

const LoginContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
`;

const LoginBox = styled.div`
  width: 400px;
  padding: 20px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: #444;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const Input = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const GuideBox = styled.div`
  padding: 10px;
  background-color: #fff5d9;
  border: 1px solid #ffd580;
  border-radius: 4px;
  margin-bottom: 20px;
`;

const GuideText = styled.p`
  font-size: 12px;
  color: #666;
  line-height: 1.5;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 10px;
  font-size: 16px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const EtcContainer = styled.div`
  margin-top: 15px;
  text-align: center;
`;

const EtcText = styled.p`
  font-size: 12px;
  color: #007bff;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;