import { Badge, IconButton, Menu, MenuItem } from '@mui/material';
import React, { useState } from 'react';

const Noficiations = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <IconButton>
        <Badge
          color='red'
          badgeContent={1}
        ></Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MenuItem onClick={handleLogout}>Notifs</MenuItem>
      </Menu>
    </>
  );
};

export default Noficiations;
