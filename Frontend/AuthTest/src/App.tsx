import HomePage from "./Components/Pages/HomePage";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from "./Components/Pages/LoginPage";
import LandingPage from "./Components/Pages/LadningPage";
import ProtectedRoutes from "./ProtectedRoutes";


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Login" element={<LoginPage />} />


          <Route element={<ProtectedRoutes />}>

            <Route path="/LandingPage" element={<LandingPage />} />


            <Route path="/LandingPage" element={<LandingPage />} />

          </Route>


        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
