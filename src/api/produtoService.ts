import api from './api'

export type ProductPayload = {
  nome: string
  slug: string
  preco: number
  descricao: string
  img: string | null
  categoria: string
  isDisponivel: boolean
  tags: string[]
}

export type Product = {
  id: string
  nome: string
  slug: string
  preco: number
  descricao?: string | null
  img?: string | null
  categoria: string
  isDisponivel?: boolean
  disponivel?: boolean
  tags?: string[]
}

type ProductListResponse = {
  content?: Product[]
}

const produtoService = {
  list: async (): Promise<Product[]> => {
    const response = await api.get<ProductListResponse>('/v1/produtos?size=50')
    return response.data?.content || []
  }
}

export default produtoService