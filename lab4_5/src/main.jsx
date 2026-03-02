import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App'
import Login from './page/Login'
import Register from './page/Register'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

import HomePage from './page/HomePage'
import Cart from './page/Cart' // ensure we import Cart
import OrderHistory from './page/OrderHistory'
import ProtectedRoute from './components/ProtectedRoute'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, 
    children: [
      {
        path: "login", 
        element: <Login />,
      },
      {
        path: "register", 
        element: <Register />,
      },
      {
        path: "cart",
        element: <Cart />
      },
      {
        path: "order-history",
        element: (
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        )
      },
      {
        index: true, 
        element: <HomePage />,
      }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </StrictMode>
)