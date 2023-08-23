import PropTypes from "prop-types";
import {
  createContext,
  useEffect,
  useReducer,
  useCallback,
  useState,
} from "react";
import { Alert, Snackbar } from "@mui/material";

import Loader from "components/Loader";
// reducer - state management
import { ACCOUNT_LIST, ACCOUNT_TO_EDIT } from "reducers/actions";
import bankReducer from "reducers/bank";

// project import
import axios from "utils/axios";

// constant
const initialState = {
  accountList: [],
  accountToEdit: null,
  isInitialized: false,
};

// ==============================|| Bank CONTEXT & PROVIDER ||============================== //

const BankContext = createContext(null);

export const BankProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bankReducer, initialState);

  // Snackbar Start
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("success");

  const onClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  // Snackbar End

  const setAccountList = useCallback((accountList) => {
    dispatch({
      type: ACCOUNT_LIST,
      payload: { accountList },
    });
  }, []);

  const setAccountToEdit = useCallback((accountToEdit) => {
    dispatch({
      type: ACCOUNT_TO_EDIT,
      payload: { accountToEdit },
    });
  }, []);

  const getAccounts = useCallback(async () => {
    try {
      const res = await axios.get("/accounts/");
      setAccountList(res?.data);
    } catch (err) {
      setAccountList([]);
    }
  }, [setAccountList]);

  const createAccount = useCallback(
    async (values) => {
      try {
        await axios.post("/accounts/", values);
        await getAccounts();
        setType("success");
        setMessage("Success to create a new account");
        setOpen(true);
        return true;
      } catch (err) {
        setType("error");
        setMessage(err?.message || "Unknown Error");
        setOpen(true);
        return false;
      }
    },
    [getAccounts]
  );

  const updateAccount = useCallback(
    async (id, values) => {
      try {
        await axios.patch(`/accounts/${id}`, values);
        await getAccounts();
        setType("success");
        setMessage("Success to update account");
        setOpen(true);
        return true;
      } catch (err) {
        setType("error");
        setMessage(err?.message || "Unknown Error");
        setOpen(true);
        return false;
      }
    },
    [getAccounts]
  );

  const deleteAccount = useCallback(
    async (id) => {
      try {
        await axios.delete(`/accounts/${id}`);
        await getAccounts();
        setType("success");
        setMessage("Success to delete account");
        setOpen(true);
        return true;
      } catch (err) {
        setType("error");
        setMessage(err?.message || "Unknown Error");
        setOpen(true);
        return false;
      }
    },
    [getAccounts]
  );

  const withdraw = useCallback(
    async (values) => {
      try {
        await axios.post("/transaction/withdraw", values);
        await getAccounts();
        setType("success");
        setMessage("Success to withdraw");
        setOpen(true);
        return true;
      } catch (err) {
        setType("error");
        setMessage(err?.message || "Unknown Error");
        setOpen(true);
        return false;
      }
    },
    [getAccounts]
  );

  const deposit = useCallback(
    async (values) => {
      try {
        await axios.post("/transaction/deposit", values);
        await getAccounts();
        setType("success");
        setMessage("Success to deposit");
        setOpen(true);
        return true;
      } catch (err) {
        setType("error");
        setMessage(err?.message || "Unknown Error");
        setOpen(true);
        return false;
      }
    },
    [getAccounts]
  );

  const transfer = useCallback(
    async (values) => {
      try {
        await axios.post("/transaction/transfer", values);
        getAccounts();
        setType("success");
        setMessage("Success to transfer");
        setOpen(true);
        return true;
      } catch (err) {
        setType("error");
        setMessage(err?.message || "Unknown Error");
        setOpen(true);
        return false;
      }
    },
    [getAccounts]
  );

  useEffect(() => {
    getAccounts();
  }, [getAccounts]);

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <BankContext.Provider
      value={{
        ...state,
        setAccountToEdit,
        createAccount,
        updateAccount,
        deleteAccount,
        withdraw,
        deposit,
        transfer,
      }}
    >
      {children}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={open}
        autoHideDuration={6000}
        onClose={onClose}
      >
        <Alert
          variant="filled"
          severity={type}
          onClose={onClose}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </BankContext.Provider>
  );
};

BankProvider.propTypes = {
  children: PropTypes.node,
};

export default BankContext;
