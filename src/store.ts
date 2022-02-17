import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import setSelectedTableReducer from "./services/selectTable.reducer";

const rootReducer = combineReducers({
  selectedTableBooks: setSelectedTableReducer("BOOKS"),
  selectedTableMyBooks: setSelectedTableReducer("MY_BOOKS"),
});

export default createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
