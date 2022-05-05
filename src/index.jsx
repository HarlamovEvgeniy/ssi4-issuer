import "./index.scss";
import "bootstrap";

import {StyledEngineProvider} from "@mui/material/styles";
import {SnackbarProvider} from "notistack";
import React from "react";
import ReactDOM from "react-dom";
import {QueryClient, QueryClientProvider} from "react-query";
import {Provider} from "react-redux";
import {createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";

import App from "./App";
import rootReducer from "./store/reducers";

export const store = createStore(rootReducer, composeWithDevTools());

const queryClient = new QueryClient();

ReactDOM.render(
  <Provider store={store}>
    <StyledEngineProvider injectFirst>
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={10000}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        {/* <React.StrictMode> */}
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
        {/* </React.StrictMode> */}
      </SnackbarProvider>
    </StyledEngineProvider>
  </Provider>,
  document.getElementById("root"),
);
