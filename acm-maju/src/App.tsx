
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HeroSection from './Components/Hero'
import AboutSection from './Pages/About'
const App = () => {
  return (
    <>
    
      <BrowserRouter>
      <HeroSection/>
   
        <Routes>
          <Route to="/" element={<HeroSection/>}/>
          <Route to="/about" element={<AboutSection/>}/>
        </Routes>
    

      </BrowserRouter>
    </>
  )
}

export default App