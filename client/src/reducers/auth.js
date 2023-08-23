// action - state management
import { LOGIN, LOGOUT } from "./actions";

// initial state
export const initialState = {
  isLoggedIn: false,
  isInitialized: false,
};

// ==============================|| AUTH REDUCER ||============================== //

const auth = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN: {
      return {
        isLoggedIn: true,
        isInitialized: true,
      };
    }
    case LOGOUT: {
      return {
        isInitialized: true,
        isLoggedIn: false,
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default auth;
