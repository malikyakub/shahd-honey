import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LangProvider } from './context/LangProvider'
import { CartProvider } from './context/CartProvider'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Shop } from './pages/Shop'
import { ProductPage } from './pages/ProductPage'
import { Cart } from './pages/Cart'
import { Checkout } from './pages/Checkout'
import { OrderConfirmation } from './pages/OrderConfirmation'
import { NotFound } from './pages/NotFound'
import { AdminGuard } from './components/admin/AdminGuard'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminOrders } from './pages/admin/AdminOrders'
import { AdminOrderDetail } from './pages/admin/AdminOrderDetail'
import { AdminProducts } from './pages/admin/AdminProducts'

export default function App() {
  return (
    <LangProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Admin Section */}
            <Route path="/admin" element={<AdminGuard />}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="orders/:id" element={<AdminOrderDetail />} />
              <Route path="products" element={<AdminProducts />} />
            </Route>

            {/* Public Storefront */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order/:id" element={<OrderConfirmation />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </LangProvider>
  )
}
