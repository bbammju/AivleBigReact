import React from 'react';
import styled from 'styled-components';
import logo from '../assets/testlogo.png'

const Header = () => {
  return (
    <HeaderContainer>
      <LogoContainer>
        <LogoImage src={logo} alt="Logo" />
      </LogoContainer>
      <NavContainer>
        <NavItem>협회안내</NavItem>
        <NavItem>협회업무</NavItem>
        <NavItem>입회안내</NavItem>
        <NavItem>저작권종합</NavItem>
        <NavItem>커뮤니티</NavItem>
      </NavContainer>
      <AuthContainer>
        <AuthLink>회원가입1</AuthLink>
        <AuthLink>로그인1</AuthLink>
      </AuthContainer>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f8f9fa;
  padding: 10px 20px;
  border-bottom: 1px solid #ddd;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoImage = styled.img`
  height: 50px;
`;

const LogoText = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-top: 5px;
`;

const LogoSubText = styled.div`
  font-size: 12px;
  color: #666;
`;

const NavContainer = styled.nav`
  display: flex;
  gap: 15px;
`;

const NavItem = styled.div`
  font-size: 14px;
  cursor: pointer;
  &:hover {
    color: #007bff;
  }
`;

const AuthContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const AuthLink = styled.div`
  font-size: 14px;
  cursor: pointer;
  &:hover {
    color: #007bff;
  }
`;