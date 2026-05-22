import {useState} from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
        <Route path="/login" element={token ? <Navigate to='/dashboard' replace /> : <Login onLogin={setToken} />} />
        <Route path="/register" element={token ? <Navigate to='/dashboard' replace /> : <Register onLogin={setToken} />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard onLogout={setToken}/>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App