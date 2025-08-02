import React from 'react'
import './App.css'
import { MemeGenerator } from './components/MemeGenerator'
import { Landing } from './components/Landing'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SelectedProvider from './context/SelectedContext'

function App() {

  return (
    <SelectedProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/meme' element={<MemeGenerator/>}/>
      </Routes>
      </BrowserRouter>
    </SelectedProvider>
  )
}

export default App
