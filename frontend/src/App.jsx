import React from 'react'
import './App.css'
import { MemeGenerator } from './components/MemeGenerator'
import { Landing } from './components/Landing'
import { ImageProvider } from './providers/image-provider'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {

  return (
    <ImageProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/meme' element={<MemeGenerator/>}/>
      </Routes>
      </BrowserRouter>
    </ImageProvider>
  )
}

export default App
