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
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN'],
    },
    {
      text: 'Work',
      icon: null,
      path: null,
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN'],
    },
    {
      text: 'Projects',
      icon: <BurstModeOutlinedIcon />,
      path: '/projects',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN'],
    },
    {
      text: 'Tickets',
      icon: <ReceiptOutlinedIcon />,
      path: '/tickets',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN'],
    },
    {
      text: 'Manage',
      icon: null,
      path: null,
      access: ['DEVELOPER', 'ADMIN'],
    },
    {
      text: 'Project Users',
      icon: <Groups2OutlinedIcon />,
      path: '/manage-users/none',
      access: ['ADMIN'],
    },
    {
      text: 'User Roles',
      icon: <AdminPanelSettingsOutlinedIcon />,
      path: '/manage-roles',
      access: ['ADMIN'],
    },
    {
      text: 'Account',
      icon: null,
      path: null,
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN'],
    },
    {
      text: 'Account Info',
      icon: <AccountBoxOutlinedIcon />,
      path: '/account-info',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN'],
    },
  ],
  developer: [
    {
      text: 'Dashboard',
      icon: <DashboardOutlinedIcon />,
      path: '/dashboard',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN'],
    },
    {
      text: 'Work',
      icon: null,
      path: null,
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN'],
    },
    {
      text: 'Projects',
      icon: <BurstModeOutlinedIcon />,
      path: '/projects',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN'],
    },
    {
      text: 'Tickets',
      icon: <ReceiptOutlinedIcon />,
      path: '/tickets',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN'],
    },
    // {
    //   text: 'Manage',
    //   icon: null,
    //   path: null,
    //   access: ['DEVELOPER', 'ADMIN'],
    // },
    // {
    //   text: 'User Roles',
    //   icon: <AdminPanelSettingsOutlinedIcon />,
    //   path: '/manage-roles',
    //   access: ['ADMIN'],
    // },
    {
      text: 'Account',
      icon: null,
      path: null,
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN'],
    },
    {
      text: 'Account Info',
      icon: <AccountBoxOutlinedIcon />,
      path: '/account-info',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN'],
    },
  ],
  submitter: [
    {
      text: 'Dashboard',
      icon: <DashboardOutlinedIcon />,
      path: '/dashboard',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN'],
    },
    {
      text: 'Work',
      icon: null,
      path: null,
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN'],
    },
    // {
    //   text: 'Projects',
    //   icon: <BurstModeOutlinedIcon />,
    //   path: '/projects',
    //   access: ['SUBMITTER', 'DEVELOPER', 'ADMIN'],
    // },
    {
      text: 'Tickets',
      icon: <ReceiptOutlinedIcon />,
      path: '/tickets',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN'],
    },
    {
      text: 'Account',
      icon: null,
      path: null,
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN'],
    },
    {
      text: 'Account Info',
      icon: <AccountBoxOutlinedIcon />,
      path: '/account-info',
      access: ['SUBMITTER', 'DEVELOPER', 'ADMIN'],
    },
  ],
};
