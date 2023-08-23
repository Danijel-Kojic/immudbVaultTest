import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import { AddOutlined } from "@mui/icons-material";

import BankHeader from "sections/bank/Header";
import AccountList from "sections/bank/AccountList";
import AccountModal from "sections/bank/AccountModal";
import { useState } from "react";

import useBank from "hooks/useBank";

export default function Bank() {
  const { setAccountToEdit } = useBank();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <BankHeader />
      <Box sx={{ width: 1100, p: 2.5, pt: "90px", margin: "auto" }}>
        <Stack spacing={3}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ pt: 5 }}
          >
            <Typography variant="h5">Account List</Typography>
            <Button
              variant="contained"
              startIcon={<AddOutlined />}
              onClick={() => {
                setAccountToEdit(null);
                handleOpen();
              }}
            >
              New Account
            </Button>
          </Stack>
          <AccountList />
        </Stack>
      </Box>
      <Modal open={open}>
        <AccountModal handleClose={handleClose} />
      </Modal>
    </>
  );
}
