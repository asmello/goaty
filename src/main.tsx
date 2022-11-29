import React from "react";
import ReactDOM from "react-dom/client";
import "./main.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Root from "./pages/Root";
import About from "./pages/About";
import Callback, { loader as callbackLoader } from "./pages/Callback";
import Configuration, {
  loader as configurationLoader,
} from "./pages/configure/Configuration";
import Error from "./pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: (
      <Root>
        <Error />
      </Root>
    ),
    children: [
      {
        element: <Home />,
        index: true,
      },
      {
        element: <Configuration />,
        path: "configure",
        loader: configurationLoader,
      },
      {
        element: <Callback />,
        path: "callback",
        loader: callbackLoader,
      },
      {
        element: <About />,
        path: "about",
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
