//main.jsx

import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import App from './App'
import './index.css'
import { ThemeProvider } from './theme/ThemeProvider.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import TodoPage from './Pages/TodoPage.jsx'
import AuthLayout from './store/AuthLayout.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/vipani-Delat",
    element: 
    (
      <AuthLayout authentication={true}>
        <TodoPage />
      </AuthLayout>
  
    )}
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
      <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
)