import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LangProvider } from './context/LangProvider'
import { ComingSoon } from './pages/ComingSoon'

export default function App() {
  return (
    <LangProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<ComingSoon />} />
        </Routes>
      </BrowserRouter>
    </LangProvider>
  )
}
