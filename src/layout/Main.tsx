import NotFound from "common/components/notFound";
import { useAppSelector } from "globalRedux/hooks";
import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import Topbar from "./Topbar";
import { isShowTopbar } from "./utils";
import Dashboard from "../features/dashboard";
import ConfigurationPage from "../features/configuration/ConfigurationPage";
import PurchaseLandingPage from "../features/purchase/components/PurchaseLandingPage/PurchaseLandingPage";
const Main = () => {
  const { isShow } = useAppSelector(
    (state) => state?.localStorage?.menus || {}
  );
  const responsiveInfo = useAppSelector(
    (state) => state?.localStorage?.responsiveInfo || {}
  );

  const mainRoutes = useRoutes([
    {
      path: "/",
      element: <Navigate to="/" replace />
    },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/sales", element: <h4>Sales</h4> },
    { path: "/purchase", element: <PurchaseLandingPage /> },
    { path: "/accounts", element: <h4>Accounts</h4> },
    { path: "/configuration", element: <ConfigurationPage /> },
    { path: "/reports", element: <h4>Reports</h4> },

    { path: "*", element: <NotFound /> }
  ]);

  return (
    <main
      className={isShow ? "" : "collapse"}
      style={
        responsiveInfo?.isMobileScreen && !responsiveInfo?.collapsed
          ? {
              marginLeft: "0px",
              width: "100%"
            }
          : {}
      }
    >
      {isShowTopbar() && <Topbar />}
      <React.Suspense fallback={<div>Loading...</div>}>
        <div className="main-content">{mainRoutes}</div>
      </React.Suspense>
    </main>
  );
};

export default Main;
