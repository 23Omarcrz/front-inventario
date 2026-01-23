import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import LoginPage from "./components/pages/LoginPage"
import RegisterPage from "./components/pages/RegisterPage"
import InventoryPage from "./components/inventory/InventoryPage"
import AdminUserSelector from "./components/admin/AdminUserSelector"
import "./Index.css"
import { AdminProvider } from "./context/AdminContext"
import { UsersProvider } from "./context/UsersContext"
import ProtectedRouteAdmin from "./hooks/useProtectedAdmin"
import ProtectedRouteUser from "./hooks/useProtectedUser"
import Navbar from "./components/Navbar"
import ForgotPassword from "./components/pages/ForgotPassword"
import ResetPassword from "./components/pages/ResetPassword"

function App() {
  return (
    <>
      <BrowserRouter>
        <Main></Main>
      </BrowserRouter>
    </>
  )
}

function Main() {
  const location = useLocation() 
  const hideNavbarPaths = ["/login", "/register", "/", "/forgot-password"]
  const hideNavbar =
  hideNavbarPaths.includes(location.pathname) ||
  location.pathname.startsWith("/reset-password");


  return (
    <AdminProvider>
      <UsersProvider>
        {/* Mostrar Navbar solo en ciertas rutas */}
        {!hideNavbar && <Navbar />}

        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route element={<ProtectedRouteAdmin />}>
            <Route path="/dashboard" element={<AdminUserSelector />} />
          </Route>

          <Route element={<ProtectedRouteAdmin />}>
            <Route element={<ProtectedRouteUser />}>
              <Route path="/inventario" element={<InventoryPage />} />
            </Route>
          </Route>
        </Routes>
      </UsersProvider>
    </AdminProvider>
  )
}

export default App


