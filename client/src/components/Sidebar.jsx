import React from 'react';
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from '@mui/material';
import { SidebarItems } from './sidebarItems';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FlexBetween from './FlexBetween';

const Sidebar = ({ drawerWidth, isSidebarOpen, setIsSidebarOpen, isNonMobile, user }) => {
  const [active, setActive] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();

  const navItems = SidebarItems[user.role.toLowerCase()];

  return (
    <Box component='nav'>
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant='persistent'
          anchor='left'
          sx={{
            width: drawerWidth,
            '& .MuiDrawer-paper': {
              backgroundColor: theme.palette.background.alt,
              boxSizing: 'border-box',
              borderWidth: isNonMobile ? 0 : '2px',
              width: drawerWidth,
            },
          }}
        >
          <Box width='100%'>
            <Box m='1.5rem 2rem 2rem 3rem'>
              <FlexBetween color={theme.palette.primary.main}>
                <Box
                  display='flex'
                  alignItems='center'
                  gap='0.5rem'
                >
                  <BugReportOutlinedIcon sx={{ height: '2rem', width: '2rem' }} />
                  <Typography
                    variant='h4'
                    fontWeight='bold'
                  >
                    Bug Tracker
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeftOutlinedIcon />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon, path, access }) => {
                if (access.includes(user.role))
                  if (!icon) {
                    return (
                      <Typography
                        key={text}
                        sx={{ m: '2.25rem 0 1rem 3rem' }}
                      >
                        {text}
                      </Typography>
                    );
                  }
                const lcText = text.toLowerCase();

                return (
                  <ListItem
                    key={text}
                    disablePadding
                  >
                    <ListItemButton
                      onClick={() => {
                        navigate(`${path}`);
                        setActive(text.toLowerCase());
                      }}
                      sx={{
                        backgroundColor: active === lcText ? theme.palette.neutral.light : 'transparent',
                        color: active === lcText ? theme.palette.primary.main : theme.palette.neutral.main,
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: '2rem',
                          color: active === lcText ? theme.palette.primary.main : theme.palette.neutral.main,
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === lcText && <ChevronRightOutlinedIcon sx={{ ml: 'auto' }} />}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
