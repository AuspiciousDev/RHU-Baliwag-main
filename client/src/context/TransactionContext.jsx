import React from "react";
import { createContext, useReducer } from "react";
export const TransactionsContext = createContext();

export const transactionsReducer = (state, action) => {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return {
        transactions: action.payload,
      };
    case "CREATE_TRANSACTION":
      return {
        transactions: [action.payload, ...state.transactions],
      };
    case "DELETE_TRANSACTION":
      return {
        transactions: state.transactions.filter(
          (w) => w._id !== action.payload._id
        ),
      };
    default:
      return state;
  }
};

export const TransactionContextProvider = ({ children }) => {
  const [state, transactionDispatch] = useReducer(transactionsReducer, {
    transactions: null,
  });

  return (
    <TransactionsContext.Provider value={{ ...state, transactionDispatch }}>
      {children}
    </TransactionsContext.Provider>
  );
};
