// action - state management
import { ACCOUNT_LIST, ACCOUNT_TO_EDIT } from "./actions";

// initial state
export const initialState = {
  accountList: [],
  accountToEdit: null,
  isInitialized: false,
};

// ==============================|| AUTH REDUCER ||============================== //

const bank = (state = initialState, action) => {
  switch (action.type) {
    case ACCOUNT_LIST: {
      const { accountList } = action.payload;
      return {
        ...state,
        accountList,
        isInitialized: true,
      };
    }
    case ACCOUNT_TO_EDIT: {
      const { accountToEdit } = action.payload;
      return {
        ...state,
        accountToEdit,
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default bank;
