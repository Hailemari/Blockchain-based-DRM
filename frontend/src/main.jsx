import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from "./redux/store.js";
// import userReducer from "./redux/userState";
// import { configureStore } from "@reduxjs/toolkit";
// import { userSaga } from "./redux/userSaga";
// import createSagaMiddleware from "redux-saga";

// const sagaMiddleware = createSagaMiddleware();
// const store = configureStore({
//   reducer: {
//     user: userReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware().concat(sagaMiddleware),
// });

// sagaMiddleware.run(userSaga);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
     {/* <React.StrictMode>  */}
      <App />
      <ToastContainer />
     {/* </React.StrictMode>  */}
   </Provider>
);
