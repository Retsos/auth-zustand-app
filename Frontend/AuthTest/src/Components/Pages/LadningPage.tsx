import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import { useAuthStore } from '../../Store'

const LandingPage = () => {
  // Παίρνουμε username, token, και τη συνάρτηση logout() από το Zustand store
  const username = useAuthStore((state) => state.username)
  const token = useAuthStore((state) => state.token)
  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  // Αν το token γίνει null  κάνουμε redirect στο /Login
  useEffect(() => {
    if (!token) {
      navigate('/Login')
    }
  }, [token, navigate])

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-950 space-y-4">
      <p className="text-2xl font-bold text-white">
        {username ? `Welcome, ${username}!` : 'Welcome!'}
      </p>

      <h2 className="text-2xl font-bold text-white">You Successfully Landed!</h2>

      <Button variant="contained" color="error" onClick={logout}>
        Log out
      </Button>
    </div>
  )
}

export default LandingPage
