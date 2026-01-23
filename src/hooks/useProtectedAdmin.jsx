import { Navigate, Outlet } from "react-router-dom";
import { useContext} from "react";
import AdminContext from "../context/AdminContext";

const ProtectedRouteAdmin = () => {
  const { admin } = useContext(AdminContext);

  if (!admin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet/>;
};

export default ProtectedRouteAdmin;
