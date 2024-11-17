import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import ContactDisplay from './components/ContactDisplay.tsx'
import ContactForm from './components/ContactForm.tsx'
const router= createBrowserRouter(
  createRoutesFromElements(
    <Route path='/'>
      <Route path='' element={<ContactDisplay/>}/>
      <Route path='create-contact' element={<ContactForm/>}/>
      <Route path='update-contact/:contact_id' element={<ContactForm/>}/>
    </Route>
  )
)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
