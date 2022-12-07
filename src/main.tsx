import {
  faArrowsRotate,
  faCircleCheck,
  faThumbsUp,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./main.scss";
import About from "./pages/About";
import authzAction from "./pages/authz/action";
import AuthzConfiguration from "./pages/authz/AuthzConfiguration";
import authzLoader from "./pages/authz/loader";
import Callback from "./pages/callback/Callback";
import callbackLoader from "./pages/callback/loader";
import Error from "./pages/Error";
import Home from "./pages/Home";
import rootLoader from "./pages/root/loader";
import Root from "./pages/root/Root";
import tokenAction from "./pages/token/action";
import Token from "./pages/token/Token";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    loader: rootLoader,
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
        element: <AuthzConfiguration />,
        path: "authz",
        action: authzAction,
        loader: authzLoader,
        handle: {
          crumbs: [<FontAwesomeIcon icon={faUserCheck} />],
        },
      },
      {
        element: <Callback />,
        path: "callback",
        loader: callbackLoader,
        handle: {
          crumbs: [
            <FontAwesomeIcon icon={faUserCheck} />,
            <FontAwesomeIcon icon={faThumbsUp} />,
            <FontAwesomeIcon icon={faArrowsRotate} />,
          ],
        },
      },
      {
        element: <Token />,
        path: "token",
        action: tokenAction, // this is a bit of a hack, but loader can't do POST
        handle: {
          crumbs: [
            <FontAwesomeIcon icon={faUserCheck} />,
            <FontAwesomeIcon icon={faThumbsUp} />,
            <FontAwesomeIcon icon={faArrowsRotate} />,
            <FontAwesomeIcon icon={faCircleCheck} />,
          ],
        },
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
