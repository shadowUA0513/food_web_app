export interface Product {
  id: string
  company_id: string
  category_id: string
  name_uz: string
  name_ru: string
  description: string
  price: number
  discounted_price?: number | null
  image_url: string
  stock_quantity: number
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface MenuCategory {
  id: string
  company_id: string
  name_uz: string
  name_ru: string
  sort_order: number
  created_at: string
  updated_at: string
}

export interface MenuCategoryWithProducts {
  category: MenuCategory
  products: Product[]
}

export interface CompanyMenuResponse {
  error: boolean
  data: {
    categories: MenuCategoryWithProducts[]
  }
}
