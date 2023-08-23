import { useMemo, useRef, useState } from "react";
import {
  Box,
  IconButton,
  ListItemButton,
  ListItemText,
  Paper,
  ClickAwayListener,
  Popper,
  Modal,
} from "@mui/material";
import {
  MoreVertOutlined,
  EditOutlined,
  AddCardOutlined,
  SendOutlined,
  CreditCardOffOutlined,
} from "@mui/icons-material";

import Transitions from "components/third-party/Transitions";
import ReactTable from "components/ReactTable";
import MainCard from "components/MainCard";

import AccountModal from "./AccountModal";
import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawModal";
import TransferModal from "./TransferModal";

import { formatDate } from "utils/common";

import useBank from "hooks/useBank";

export default function AccountList() {
  const { accountList, setAccountToEdit } = useBank();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [openDeposit, setOpenDeposit] = useState(false);
  const handleDepositOpen = () => setOpenDeposit(true);
  const handleDepositClose = () => setOpenDeposit(false);

  const [openWithdraw, setOpenWithdraw] = useState(false);
  const handleWithdrawOpen = () => setOpenWithdraw(true);
  const handleWithdrawClose = () => setOpenWithdraw(false);

  const [openTransfer, setOpenTransfer] = useState(false);
  const handleTransferOpen = () => setOpenTransfer(true);
  const handleTransferClose = () => setOpenTransfer(false);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "account_id",
        Cell: ({ value }) => value,
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ value }) => value,
      },
      {
        Header: "Email",
        accessor: "email",
        Cell: ({ value }) => value,
      },
      {
        Header: "Balance",
        accessor: "balance",
        Cell: ({ value }) => value,
      },
      {
        Header: "Created At",
        accessor: "created_at",
        Cell: ({ value }) => formatDate(value),
      },
      {
        Header: "",
        accessor: "action",
        Cell: ({ row }) => {
          const anchorRef = useRef(null);
          const [open, setOpen] = useState(false);
          const handleToggle = () => {
            setOpen((prevOpen) => !prevOpen);
          };
          const handleClose = (event) => {
            if (anchorRef.current && anchorRef.current.contains(event.target)) {
              return;
            }
            setOpen(false);
          };
          // eslint-disable-next-line
          const account = row?.original;
          return (
            <Box sx={{ width: "100%", textAlign: "right" }}>
              <IconButton size="small" ref={anchorRef} onClick={handleToggle}>
                <MoreVertOutlined />
              </IconButton>
              <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
                popperOptions={{
                  modifiers: [
                    {
                      name: "offset",
                      options: {
                        offset: [0, 9],
                      },
                    },
                  ],
                }}
                sx={{ zIndex: 2 }}
              >
                {({ TransitionProps }) => (
                  <Transitions type="fade" in={open} {...TransitionProps}>
                    {open && (
                      <Paper
                        elevation={1}
                        sx={{
                          border: `solid 1px #ccc`,
                          width: 150,
                          minWidth: 150,
                          maxWidth: 150,
                        }}
                      >
                        <ClickAwayListener onClickAway={handleClose}>
                          <MainCard
                            elevation={0}
                            border={false}
                            content={false}
                          >
                            <ListItemButton
                              onClick={() => {
                                setAccountToEdit(account);
                                handleOpen();
                              }}
                              sx={{ px: 2, py: 0.75 }}
                            >
                              <EditOutlined sx={{ mr: 2 }} />
                              <ListItemText primary={"Edit"} />
                            </ListItemButton>
                            <ListItemButton
                              onClick={() => {
                                setAccountToEdit(account);
                                handleWithdrawOpen();
                              }}
                              sx={{ px: 2, py: 0.75 }}
                            >
                              <CreditCardOffOutlined sx={{ mr: 2 }} />
                              <ListItemText primary={"Withdraw"} />
                            </ListItemButton>
                            <ListItemButton
                              onClick={() => {
                                setAccountToEdit(account);
                                handleDepositOpen();
                              }}
                              sx={{ px: 2, py: 0.75 }}
                            >
                              <AddCardOutlined sx={{ mr: 2 }} />
                              <ListItemText primary={"Deposit"} />
                            </ListItemButton>
                            <ListItemButton
                              onClick={() => {
                                setAccountToEdit(account);
                                handleTransferOpen();
                              }}
                              sx={{ px: 2, py: 0.75 }}
                            >
                              <SendOutlined sx={{ mr: 2 }} />
                              <ListItemText primary={"Transfer"} />
                            </ListItemButton>
                          </MainCard>
                        </ClickAwayListener>
                      </Paper>
                    )}
                  </Transitions>
                )}
              </Popper>
            </Box>
          );
        },
      },
    ],
    [setAccountToEdit]
  );

  return (
    <>
      <ReactTable data={accountList} columns={columns} />
      <Modal open={open}>
        <AccountModal handleClose={handleClose} />
      </Modal>
      <Modal open={openDeposit}>
        <DepositModal handleClose={handleDepositClose} />
      </Modal>
      <Modal open={openWithdraw}>
        <WithdrawModal handleClose={handleWithdrawClose} />
      </Modal>
      <Modal open={openTransfer}>
        <TransferModal handleClose={handleTransferClose} />
      </Modal>
    </>
  );
}
