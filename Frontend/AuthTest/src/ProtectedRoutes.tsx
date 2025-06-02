import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from './Store' // named import

const ProtectedRoutes = () => {
  const token = useAuthStore((state) => state.token)

  return <>{token ? <Outlet /> : <Navigate to="/Login" replace />}</>
}

export default ProtectedRoutes