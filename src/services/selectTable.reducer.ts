import { BooksActionType } from "../types/actionTypes";

export default (name: string) =>
  (state = {}, action: BooksActionType) => {
    switch (action.type) {
      case `SET_CURRENT_TABLE_${name}`: {
        return {
          ...state,
          selectedTable: action.selectedTable,
        };
      }
      default:
        return state;
    }
  };
