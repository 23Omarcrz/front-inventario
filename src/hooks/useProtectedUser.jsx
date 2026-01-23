import { Navigate, Outlet } from "react-router-dom";
import { useContext} from "react";
import UsersContext from "../context/UsersContext";

const ProtectedRouteUser = () => {
  const { validUser } = useContext(UsersContext);

  if (!validUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet/>;
};

export default ProtectedRouteUser;
