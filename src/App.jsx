import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from "./components/pages/LoginPage"
import RegisterPage from "./components/pages/RegisterPage"
import InventoryPage from "./components/inventory/InventoryPage"
import AdminUserSelector from "./components/admin/AdminUserSelector"
import "./Index.css"
import Home from "./components/pages/Home"
import { AdminProvider } from "./context/AdminContext"
import { UsersProvider } from "./context/UsersContext"

function App() {
  return (
    <>
      <BrowserRouter>
        <AdminProvider>
          <UsersProvider>
            <Routes>
              <Route path="/" element={<Home></Home>}></Route>
              <Route path="/login" element={<LoginPage></LoginPage>}></Route>
              <Route path="/register" element={<RegisterPage></RegisterPage>}></Route>
              <Route path="/dashboard" element={<AdminUserSelector></AdminUserSelector>}></Route>
              <Route path="/inventario" element={<InventoryPage></InventoryPage>}></Route>
            </Routes>
          </UsersProvider>
        </AdminProvider>   
      </BrowserRouter>
        
      {/* <AddItemModal></AddItemModal> */}
    </>
  )
}

export default App
