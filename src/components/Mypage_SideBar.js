import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Person, Key, Star, PersonRemove } from "@mui/icons-material";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '20%', padding: 2, marginRight: 2 }}>
      <Paper elevation={2} sx={{ borderRadius: 3 }}>
        <nav aria-label="main mailbox folders">
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/Mypage")}>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="회원정보수정" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/PwChange")}>
                <ListItemIcon>
                  <Key />
                </ListItemIcon>
                <ListItemText primary="비밀번호변경" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/FavoritesPage")}>
                <ListItemIcon>
                  <Star />
                </ListItemIcon>
                <ListItemText primary="관심주택" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate("/")}>
                <ListItemIcon>
                  <PersonRemove />
                </ListItemIcon>
                <ListItemText primary="회원탈퇴" />
              </ListItemButton>
            </ListItem>
          </List>
        </nav>
      </Paper>
    </Box>
  );
};

export default Sidebar;
