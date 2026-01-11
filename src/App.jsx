import { Navigate, Route, Routes } from "react-router-dom"
import PowerDashboard from "./components/PowerDashboard"
import { Login } from "./login"
import { AuthenticationPage } from "./auth/AuthenticationPage"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<AuthenticationPage />}>
        <Route index element={<PowerDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

// Onctionadminmonitoring