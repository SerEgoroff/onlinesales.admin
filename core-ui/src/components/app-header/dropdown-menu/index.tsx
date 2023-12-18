import React, { useState } from "react";
import {
  Box,
  Menu,
  MenuItem,
  Typography,
  Tooltip,
  IconButton,
  Avatar,
  Divider,
  ListItemIcon,
} from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useUserInfo } from "@providers/user-provider";
import { buildAbsoluteUrl } from "@lib/network/utils";
import { useAuthState } from "@providers/auth-provider";
import { useNavigate } from "react-router-dom";

export const DropdownMenu = () => {
  const { logout } = useAuthState();
  const userInfo = useUserInfo();
  const navigate = useNavigate();

  const displayName = (userInfo && userInfo?.details?.displayName) || "Unknown";
  const avatarUrl =
    (userInfo && userInfo?.details?.avatarUrl && buildAbsoluteUrl(userInfo?.details.avatarUrl)) ||
    undefined;

  const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorElement);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElement(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorElement(null);
  };

  const handleProfileClick = () => {
    navigate(`/users/${userInfo?.details?.id}/edit`);
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Typography sx={{ minWidth: 100 }}>{displayName}</Typography>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }} src={avatarUrl}>
              {displayName[0]}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorElement}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
        <MenuItem onClick={handleProfileClick} disabled={userInfo === null}>
          <Avatar
            sx={{ width: 32, height: 32, marginRight: 2.5, marginLeft: -1.5 }}
            src={avatarUrl}
          >
            {displayName[0]}
          </Avatar>
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={logout} disabled={userInfo === null}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};
