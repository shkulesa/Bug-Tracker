import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import BurstModeOutlinedIcon from '@mui/icons-material/BurstModeOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import AccountBoxOutlinedIcon from '@mui/icons-material/AccountBoxOutlined';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';

export const SidebarItems = {
  admin: [
    {
      text: 'Dashboard',
      icon: <DashboardOutlinedIcon />,
      path: '/dashboard',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
    {
      text: 'Work',
      icon: null,
      path: null,
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
    {
      text: 'Projects',
      icon: <BurstModeOutlinedIcon />,
      path: '/projects',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
    {
      text: 'Tickets',
      icon: <ReceiptOutlinedIcon />,
      path: '/tickets',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
    {
      text: 'Manage',
      icon: null,
      path: null,
      access: ['DEVELOPER', 'ADMIN', 'VIEWER'],
    },
    {
      text: 'Project Users',
      icon: <Groups2OutlinedIcon />,
      path: '/manage-users/none',
      access: ['ADMIN', 'VIEWER'],
    },
    {
      text: 'User Roles',
      icon: <AdminPanelSettingsOutlinedIcon />,
      path: '/manage-roles',
      access: ['ADMIN', 'VIEWER'],
    },
    {
      text: 'Account',
      icon: null,
      path: null,
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
    {
      text: 'Account Info',
      icon: <AccountBoxOutlinedIcon />,
      path: '/account-info',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
  ],
  developer: [
    {
      text: 'Dashboard',
      icon: <DashboardOutlinedIcon />,
      path: '/dashboard',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
    {
      text: 'Work',
      icon: null,
      path: null,
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
    {
      text: 'Projects',
      icon: <BurstModeOutlinedIcon />,
      path: '/projects',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
    {
      text: 'Tickets',
      icon: <ReceiptOutlinedIcon />,
      path: '/tickets',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
    {
      text: 'Manage',
      icon: null,
      path: null,
      access: ['DEVELOPER', 'ADMIN', 'VIEWER'],
    },
    {
      text: 'Project Users',
      icon: <Groups2OutlinedIcon />,
      path: '/manage-users/none',
      access: ['ADMIN', 'VIEWER'],
    },
    {
      text: 'Account',
      icon: null,
      path: null,
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
    {
      text: 'Account Info',
      icon: <AccountBoxOutlinedIcon />,
      path: '/account-info',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
  ],
  submitter: [
    {
      text: 'Dashboard',
      icon: <DashboardOutlinedIcon />,
      path: '/dashboard',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
    {
      text: 'Work',
      icon: null,
      path: null,
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
    {
      text: 'Tickets',
      icon: <ReceiptOutlinedIcon />,
      path: '/tickets',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
    {
      text: 'Account',
      icon: null,
      path: null,
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
    {
      text: 'Account Info',
      icon: <AccountBoxOutlinedIcon />,
      path: '/account-info',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
  ],
  viewer: [
    {
      text: 'Dashboard',
      icon: <DashboardOutlinedIcon />,
      path: '/dashboard',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
    {
      text: 'Work',
      icon: null,
      path: null,
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
    {
      text: 'Projects',
      icon: <BurstModeOutlinedIcon />,
      path: '/projects',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
    {
      text: 'Tickets',
      icon: <ReceiptOutlinedIcon />,
      path: '/tickets',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
    {
      text: 'Manage',
      icon: null,
      path: null,
      access: ['DEVELOPER', 'ADMIN', 'VIEWER'],
    },
    {
      text: 'Project Users',
      icon: <Groups2OutlinedIcon />,
      path: '/manage-users/none',
      access: ['ADMIN', 'VIEWER'],
    },
    {
      text: 'Account',
      icon: null,
      path: null,
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
    {
      text: 'Account Info',
      icon: <AccountBoxOutlinedIcon />,
      path: '/account-info',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN', 'VIEWER'],
    },
  ],
};
