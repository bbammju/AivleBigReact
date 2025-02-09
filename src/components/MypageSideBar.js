import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Box, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Divider,
  styled
} from "@mui/material";
import { Person, Key, Star, PersonRemove, PersonAddAlt } from "@mui/icons-material";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

// MUI 스타일드 컴포넌트
const SidebarListItemButton = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(2),
  '&.Mui-selected': {
    backgroundColor: 'rgba(43, 65, 85, 0.1)', // #2B4155 with opacity
    '&:hover': {
      backgroundColor: 'rgba(43, 65, 85, 0.15)',
    },
  },
  '&:hover': {
    backgroundColor: 'rgba(43, 65, 85, 0.05)',
  },
}));

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/mypage', icon: <Person />, text: '내 정보' },
    { path: '/favorites', icon: <Star />, text: '관심주택' },
    { path: '/editprofile', icon: <ManageAccountsIcon />, text: '회원정보수정' },
    { path: '/pwchange', icon: <Key />, text: '비밀번호변경' },    
    { path: '/withdrawal', icon: <PersonRemove />, text: '회원탈퇴' }
  ];

  return (
    <Box
      sx={(theme) => ({
        width: 240,
        backgroundColor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
      })}
    >
      <List>
        {menuItems.map((item, index) => (
          <React.Fragment key={item.path}>
            <ListItem disablePadding>
              <SidebarListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon 
                  sx={(theme) => ({
                    color: location.pathname === item.path 
                      ? '#2B4155'  // 선택된 아이콘 색상
                      : theme.palette.text.primary,
                    minWidth: 40
                  })}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={(theme) => ({
                    '& .MuiTypography-root': {
                      fontWeight: location.pathname === item.path ? 600 : 400,
                      color: location.pathname === item.path 
                        ? '#2B4155'  // 선택된 텍스트 색상
                        : theme.palette.text.primary,
                    }
                  })}
                />
              </SidebarListItemButton>
            </ListItem>
            {index < menuItems.length - 1 && (
              <Divider variant="middle" />
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;