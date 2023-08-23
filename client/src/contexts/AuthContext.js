import PropTypes from "prop-types";
import { createContext, useEffect, useReducer } from "react";

import Loader from "components/Loader";
// reducer - state management
import { LOGIN, LOGOUT } from "reducers/actions";
import authReducer from "reducers/auth";

// project import
import axios from "utils/axios";

import { setSession, setRefresh, verifyToken } from "utils/common";

// constant
const initialState = {
  isLoggedIn: false,
  isInitialized: false,
};

// ==============================|| Auth CONTEXT & PROVIDER ||============================== //

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (values) => {
    const response = await axios.post("/token/", values);
    const { refresh, access } = response.data;
    setSession(access);
    setRefresh(refresh);
    dispatch({ type: LOGIN });
  };

  const logout = () => {
    setSession(null);
    setRefresh(null);
    dispatch({ type: LOGOUT });
  };

  useEffect(() => {
    const refresh = window.localStorage.getItem("refresh-token");
    if (refresh && verifyToken(refresh)) {
      axios.post("/token/refresh/", { refresh }).then((res) => {
        const { refresh, access } = res.data;
        setSession(access);
        setRefresh(refresh);
        dispatch({ type: LOGIN });
      });
    } else {
      dispatch({ type: LOGOUT });
    }
  }, []);

  if (state.isInitialized !== undefined && !state.isInitialized) {
    return <Loader />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthContext;
