import api from './api'

export type CepResponse = {
  cep: string
  logradouro: string
  complemento?: string | null
  bairro: string
  cidade: string
  estado: string
}

export type FreteResponse = {
  cep: string
  enderecoEntrega: string
  distanciaKm: number
  valorPorKm: number
  taxaEntrega: number
}

type RawFreteResponse = unknown

const toNumber = (value: string | number | null | undefined) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0
  }

  if (!value) {
    return 0
  }

  const normalized = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\.(?=\d{3}(?:\D|$))/g, '')
    .replace(',', '.')

  return Number(normalized) || 0
}

const preferredFreightKeys = [
  'valor',
  'valorFrete',
  'frete',
  'taxa',
  'taxaFrete',
  'taxaEntrega',
  'valorEntrega',
  'deliveryFee',
  'deliveryTax',
  'fee',
  'preco',
  'price',
  'total',
]

const getFreteValue = (data: RawFreteResponse): number | null => {
  if (data === null || data === undefined) {
    return null
  }

  if (typeof data === 'number') {
    return Number.isFinite(data) ? data : null
  }

  if (typeof data === 'string') {
    const value = toNumber(data)
    return Number.isFinite(value) ? value : null
  }

  if (Array.isArray(data)) {
    for (const item of data) {
      const value = getFreteValue(item)

      if (value !== null) {
        return value
      }
    }

    return null
  }

  if (typeof data !== 'object') {
    return null
  }

  const record = data as Record<string, unknown>

  for (const key of ['data', 'resultado', 'result', 'frete']) {
    if (key in record && typeof record[key] === 'object' && record[key] !== null) {
      const value = getFreteValue(record[key])

      if (value !== null) {
        return value
      }
    }
  }

  for (const key of preferredFreightKeys) {
    const value = record[key]

    if (typeof value === 'number' || typeof value === 'string') {
      return toNumber(value)
    }
  }

  const numericValues = Object.values(record).filter(
    (value): value is string | number => typeof value === 'number' || typeof value === 'string',
  )

  return numericValues.length === 1 ? toNumber(numericValues[0]) : null
}

const freteService = {
  calcular: async ({ lojaId, cep }: { lojaId: string; cep: string }) => {
    const params = new URLSearchParams({
      lojaId,
      cep,
    })

    const response = await api.get<RawFreteResponse>(`/v1/pedidos/frete?${params.toString()}`)
    const valor = getFreteValue(response.data)

    if (valor === null || valor < 0) {
      throw new Error('Resposta de frete invalida')
    }

    if (typeof response.data === 'object' && response.data !== null && !Array.isArray(response.data)) {
      return {
        ...(response.data as FreteResponse),
        taxaEntrega: valor,
      }
    }

    return {
      cep,
      enderecoEntrega: '',
      distanciaKm: 0,
      valorPorKm: 0,
      taxaEntrega: valor,
    }
  },

  buscarEnderecoPorCep: async (cep: string) => {
    const response = await api.get<CepResponse>(`/v1/pedidos/cep/${cep}`)
    return response.data
  },
}

export default freteService
