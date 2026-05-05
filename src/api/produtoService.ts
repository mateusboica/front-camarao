import api from './api'

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

type ApiProduct = Partial<Omit<Product, 'id' | 'preco' | 'categoria'>> & {
  id?: string | number
  preco?: string | number
  valor?: string | number
  price?: string | number
  categoria?: string | null | {
    nome?: string | null
    name?: string | null
    titulo?: string | null
  }
  categoriaNome?: string | null
  imageUrl?: string | null
  imagem?: string | null
}

type ProductListResponse =
  | ApiProduct[]
  | {
      content?: ApiProduct[]
      data?: ApiProduct[]
      items?: ApiProduct[]
      produtos?: ApiProduct[]
    }

const getProductsFromResponse = (data: ProductListResponse): ApiProduct[] => {
  if (Array.isArray(data)) {
    return data
  }

  return data.content || data.data || data.items || data.produtos || []
}

const toNumber = (value: string | number | undefined) => {
  if (typeof value === 'number') {
    return value
  }

  if (!value) {
    return 0
  }

  return Number(value.replace(',', '.')) || 0
}

const getCategory = (category: ApiProduct['categoria'], fallback?: string | null) => {
  if (typeof category === 'string') {
    return category
  }

  return category?.nome || category?.name || category?.titulo || fallback || 'Outros'
}

const normalizeProduct = (product: ApiProduct): Product => {
  const id = String(product.id ?? product.slug ?? product.nome ?? crypto.randomUUID())
  const nome = product.nome || product.slug || 'Produto'

  return {
    id,
    nome,
    slug: product.slug || id,
    preco: toNumber(product.preco ?? product.valor ?? product.price),
    descricao: product.descricao,
    img: product.img || product.imageUrl || product.imagem || null,
    categoria: getCategory(product.categoria, product.categoriaNome),
    isDisponivel: product.isDisponivel,
    disponivel: product.disponivel,
    tags: product.tags,
  }
}

const produtoService = {
  list: async (): Promise<Product[]> => {
    const response = await api.get<ProductListResponse>('/v1/produtos?size=50')
    return getProductsFromResponse(response.data).map(normalizeProduct)
  }
}

export default produtoService
