import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { LogoutOutlined } from "@mui/icons-material";

import useAuth from "hooks/useAuth";

export default function BankHeader() {
  const theme = useTheme();
  const { logout } = useAuth();

  const appBar = {
    position: "fixed",
    color: "inherit",
    elevation: 0,
    sx: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      zIndex: 1200,
      width: "100%",
    },
  };
  return (
    <AppBar {...appBar}>
      <Box sx={{ width: 1100, p: 2.5, margin: "auto" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h4">ImmuBank</Typography>
          <Stack direction="row" alignItems="center" spacing={3}>
            <Typography>Admin</Typography>
            <IconButton size="large" onClick={() => logout()}>
              <LogoutOutlined />
            </IconButton>
          </Stack>
        </Stack>
      </Box>
    </AppBar>
  );
}
