import React from "react";
import { createContext, useReducer } from "react";
export const InventoriesContext = createContext();

export const stocksReducer = (state, action) => {
  switch (action.type) {
    case "SET_STOCKS":
      return {
        stocks: action.payload,
      };
    case "CREATE_STOCK":
      return {
        stocks: [action.payload, ...state.stocks],
      };
    case "DELETE_STOCK":
      return {
        stocks: state.stocks.filter((w) => w._id !== action.payload._id),
      };
    default:
      return state;
  }
};

export const InventoryContextProvider = ({ children }) => {
  const [state, stockDispatch] = useReducer(stocksReducer, {
    stocks: null,
  });

  return (
    <InventoriesContext.Provider value={{ ...state, stockDispatch }}>
      {children}
    </InventoriesContext.Provider>
  );
};
