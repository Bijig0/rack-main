
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { isAuthenticated } from "../services/auth";
import { PrivateRoutes } from "./AllRoutes";

const Auth = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/" />;
};

export const ProtectedRoutes = () => {
  return (
      <Routes>
        <Route element={<Auth />}>
          {PrivateRoutes.map((route, key) => (
            <Route key={key} path={route.path} element={<route.component />} />
          ))}
        </Route>
      </Routes>

  );
};

