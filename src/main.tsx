import React from "react";
import ReactDOM from "react-dom/client";
import "./main.scss";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Root from "./pages/Root";
import About from "./pages/About";
import Callback from "./pages/callback/Callback";
import callbackLoader from "./pages/callback/loader";
import authzAction from "./pages/authz/action";
import Error from "./pages/Error";
import AuthzConfiguration from "./pages/authz/AuthzConfiguration";
import Token from "./pages/token/Token";
import tokenAction from "./pages/token/action";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsRotate,
  faCircleCheck,
  faThumbsUp,
  faUserCheck,
} from "@fortawesome/free-solid-svg-icons";

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
        element: <AuthzConfiguration />,
        path: "authz",
        action: authzAction,
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
