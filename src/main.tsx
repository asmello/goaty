import React from "react";
import ReactDOM from "react-dom/client";
import "./main.scss";
import { createBrowserRouter, Route, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Root from "./pages/Root";
import About from "./pages/About";
import Callback from "./pages/Callback";
import Configure, { loadState } from "./pages/configure/Configuration";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        element: <Home />,
        index: true,
      },
      {
        element: <Configure />,
        path: "configure",
        loader: loadState,
      },
      {
        element: <Callback />,
        path: "callback",
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
