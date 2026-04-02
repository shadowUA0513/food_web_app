import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '../../pages/home-page'
import { ProductDetailsPage } from '../../pages/product-details-page'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<HomePage />} />
        <Route path="/product/:productId" element={<ProductDetailsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
