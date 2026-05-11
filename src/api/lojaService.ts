import api from './api'

export type StoreInfo = {
  id?: string
  nome: string
  sigla: string
  descricao: string
  capa: string
  logo?: string | null
  aberto: boolean
  avaliacao?: number | null
  tempoEntrega: string
  pedidoMinimo: number
  taxaEntrega: number
  taxaServico: number
  telefone?: string | null
  whatsapp?: string | null
  email?: string | null
  instagram?: string | null
  endereco?: string | null
  horarioResumo?: string | null
  horarioHoje?: string | null
  statusDetalhe?: string | null
  horarios: StoreScheduleDay[]
}

export type StoreScheduleDay = {
  dia: number
  label: string
  abre?: string | null
  fecha?: string | null
  fechado: boolean
  isHoje: boolean
}

type ApiStore = {
  id?: string | number
  nome?: string | null
  name?: string | null
  razaoSocial?: string | null
  nomeFantasia?: string | null
  titulo?: string | null
  descricao?: string | null
  description?: string | null
  sobre?: string | null
  segmento?: string | null
  categoria?: string | null
  capa?: string | null
  banner?: string | null
  cover?: string | null
  coverUrl?: string | null
  imagemCapa?: string | null
  logo?: string | null
  logoUrl?: string | null
  imagem?: string | null
  img?: string | null
  aberto?: boolean | null
  isAberto?: boolean | null
  aberta?: boolean | null
  status?: string | null
  avaliacao?: string | number | null
  rating?: string | number | null
  nota?: string | number | null
  tempoEntrega?: string | number | null
  prazoEntrega?: string | number | null
  deliveryTime?: string | number | null
  tempoMinimoEntrega?: string | number | null
  tempoMaximoEntrega?: string | number | null
  pedidoMinimo?: string | number | null
  valorMinimoPedido?: string | number | null
  minimumOrder?: string | number | null
  taxaEntrega?: string | number | null
  valorEntrega?: string | number | null
  deliveryFee?: string | number | null
  taxaServico?: string | number | null
  serviceFee?: string | number | null
  telefone?: string | null
  phone?: string | null
  celular?: string | null
  whatsapp?: string | null
  email?: string | null
  instagram?: string | null
  enderecoCompleto?: string | null
  endereco?: string | null
  address?: string | null
  horarioFuncionamento?: ApiSchedule | string | null
  horariosFuncionamento?: ApiSchedule | string | null
  horarios?: ApiSchedule | string | null
  funcionamento?: ApiSchedule | string | null
  businessHours?: ApiSchedule | string | null
}

type ApiSchedule = ApiScheduleDay[] | Record<string, ApiScheduleDay | string | null>

type ApiScheduleDay = {
  dia?: string | number | null
  diaSemana?: string | number | null
  day?: string | number | null
  semana?: string | number | null
  abertura?: string | null
  abre?: string | null
  aberto?: string | boolean | null
  horarioAbertura?: string | null
  horaAbertura?: string | null
  fechamento?: string | null
  fecha?: string | null
  horarioFechamento?: string | null
  horaFechamento?: string | null
  fechado?: boolean | null
  isFechado?: boolean | null
}

type StoreResponse =
  | ApiStore
  | ApiStore[]
  | {
      content?: ApiStore[]
      data?: ApiStore | ApiStore[]
      item?: ApiStore
      items?: ApiStore[]
      loja?: ApiStore
      lojas?: ApiStore[]
      store?: ApiStore
    }

const fallbackCover =
  'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1600&q=80'

export const defaultStoreInfo: StoreInfo = {
  nome: 'Delicia Potiguar',
  sigla: 'DP',
  descricao: 'Camarao, frutos do mar e cozinha nordestina',
  capa: fallbackCover,
  logo: null,
  aberto: true,
  avaliacao: 4.8,
  tempoEntrega: '35-50 min',
  pedidoMinimo: 25,
  taxaEntrega: 7.9,
  taxaServico: 1.99,
  telefone: null,
  whatsapp: null,
  email: null,
  instagram: null,
  endereco: null,
  horarioResumo: null,
  horarioHoje: null,
  statusDetalhe: null,
  horarios: [],
}

const endpointCandidates = [
  '/v1/loja',
  '/v1/lojas',
  '/v1/store',
  '/v1/stores',
  '/v1/estabelecimento',
  '/v1/estabelecimentos',
  '/v1/configuracao/loja',
]

const firstText = (...values: Array<string | null | undefined>) =>
  values.find((value) => value && value.trim())?.trim()

const toNumber = (value: string | number | null | undefined, fallback = 0) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : fallback
  }

  if (!value) {
    return fallback
  }

  const normalized = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\.(?=\d{3}(?:\D|$))/g, '')
    .replace(',', '.')

  return Number(normalized) || fallback
}

const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

const dayAliases: Record<string, number> = {
  domingo: 0,
  dom: 0,
  sunday: 0,
  seg: 1,
  segunda: 1,
  'segunda-feira': 1,
  monday: 1,
  ter: 2,
  terca: 2,
  terça: 2,
  'terca-feira': 2,
  'terça-feira': 2,
  tuesday: 2,
  qua: 3,
  quarta: 3,
  'quarta-feira': 3,
  wednesday: 3,
  qui: 4,
  quinta: 4,
  'quinta-feira': 4,
  thursday: 4,
  sex: 5,
  sexta: 5,
  'sexta-feira': 5,
  friday: 5,
  sab: 6,
  sabado: 6,
  sábado: 6,
  saturday: 6,
}

const normalizeDay = (value: string | number | null | undefined, fallback: number) => {
  if (typeof value === 'number') {
    return value >= 0 && value <= 6 ? value : Math.max(0, Math.min(6, value - 1))
  }

  if (!value) {
    return fallback
  }

  const key = value.trim().toLowerCase()
  const numeric = Number(key)

  if (!Number.isNaN(numeric)) {
    return normalizeDay(numeric, fallback)
  }

  return dayAliases[key] ?? fallback
}

const normalizeTime = (value: string | null | undefined) => {
  if (!value) {
    return null
  }

  const match = value.match(/(\d{1,2})[:h](\d{2})|(\d{1,2})h?/)

  if (!match) {
    return null
  }

  const hour = Number(match[1] || match[3])
  const minute = Number(match[2] || 0)

  if (hour > 23 || minute > 59) {
    return null
  }

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

const timeToMinutes = (value?: string | null) => {
  if (!value) {
    return null
  }

  const [hour, minute] = value.split(':').map(Number)

  return hour * 60 + minute
}

const formatScheduleLabel = (day: StoreScheduleDay) =>
  day.fechado || !day.abre || !day.fecha ? 'Fechado' : `${day.abre} as ${day.fecha}`

const getCurrentDay = () => new Date().getDay()

const isWithinSchedule = (day: StoreScheduleDay) => {
  const open = timeToMinutes(day.abre)
  const close = timeToMinutes(day.fecha)

  if (day.fechado || open === null || close === null) {
    return false
  }

  const now = new Date()
  const current = now.getHours() * 60 + now.getMinutes()

  if (close < open) {
    return current >= open || current <= close
  }

  return current >= open && current <= close
}

const getStatusFromSchedule = (horarios: StoreScheduleDay[]) => {
  const today = horarios.find((day) => day.isHoje)

  if (!today) {
    return horarios.length > 0
      ? {
          aberto: false,
          horarioHoje: 'Hoje: Fechado',
          statusDetalhe: 'Fechado hoje',
        }
      : null
  }

  const aberto = isWithinSchedule(today)
  const horarioHoje = `${today.label}: ${formatScheduleLabel(today)}`
  const statusDetalhe = today.fechado
    ? 'Fechado hoje'
    : aberto
      ? `Fecha as ${today.fecha}`
      : `Abre as ${today.abre}`

  return {
    aberto,
    horarioHoje,
    statusDetalhe,
  }
}

const normalizeScheduleDay = (
  value: ApiScheduleDay | string | null,
  fallbackDay: number,
): StoreScheduleDay => {
  const today = getCurrentDay()

  if (typeof value === 'string') {
    const times = value.match(/(\d{1,2}[:h]\d{2}|\d{1,2}h?)\s*(?:-|as|às|a)\s*(\d{1,2}[:h]\d{2}|\d{1,2}h?)/i)
    const closed = /fechado|closed/i.test(value)
    const abre = normalizeTime(times?.[1])
    const fecha = normalizeTime(times?.[2])

    return {
      dia: fallbackDay,
      label: dayLabels[fallbackDay],
      abre,
      fecha,
      fechado: closed || !abre || !fecha,
      isHoje: fallbackDay === today,
    }
  }

  const day = normalizeDay(
    value?.diaSemana ?? value?.dia ?? value?.day ?? value?.semana,
    fallbackDay,
  )
  const abre = normalizeTime(
    value?.abertura || value?.abre || value?.horarioAbertura || value?.horaAbertura || null,
  )
  const fecha = normalizeTime(
    value?.fechamento || value?.fecha || value?.horarioFechamento || value?.horaFechamento || null,
  )
  const closedText = typeof value?.aberto === 'string' ? /fechado|closed/i.test(value.aberto) : false
  const fechado = Boolean(value?.fechado || value?.isFechado || closedText || !abre || !fecha)

  return {
    dia: day,
    label: dayLabels[day],
    abre,
    fecha,
    fechado,
    isHoje: day === today,
  }
}

const normalizeSchedule = (schedule: ApiSchedule | string | null | undefined) => {
  if (!schedule) {
    return []
  }

  if (typeof schedule === 'string') {
    return []
  }

  const days = Array.isArray(schedule)
    ? schedule.map((day, index) => normalizeScheduleDay(day, index))
    : Object.entries(schedule).map(([key, value], index) =>
        normalizeScheduleDay(value, normalizeDay(key, index)),
      )

  return days.sort((a, b) => a.dia - b.dia)
}

const getScheduleSummary = (store: ApiStore, horarios: StoreScheduleDay[]) => {
  const explicit = firstText(
    typeof store.horarioFuncionamento === 'string' ? store.horarioFuncionamento : null,
    typeof store.horariosFuncionamento === 'string' ? store.horariosFuncionamento : null,
    typeof store.horarios === 'string' ? store.horarios : null,
    typeof store.funcionamento === 'string' ? store.funcionamento : null,
    typeof store.businessHours === 'string' ? store.businessHours : null,
  )

  if (explicit) {
    return explicit
  }

  if (horarios.length === 0) {
    return null
  }

  return horarios.map((day) => `${day.label}: ${formatScheduleLabel(day)}`).join(' | ')
}

const getStoreFromResponse = (data: StoreResponse): ApiStore | null => {
  if (Array.isArray(data)) {
    return data[0] || null
  }

  if ('loja' in data && data.loja) {
    return data.loja
  }

  if ('store' in data && data.store) {
    return data.store
  }

  if ('item' in data && data.item) {
    return data.item
  }

  if ('data' in data && data.data) {
    return Array.isArray(data.data) ? data.data[0] || null : data.data
  }

  if ('content' in data && data.content) {
    return data.content[0] || null
  }

  if ('items' in data && data.items) {
    return data.items[0] || null
  }

  if ('lojas' in data && data.lojas) {
    return data.lojas[0] || null
  }

  return data as ApiStore
}

const getInitials = (name: string) => {
  const words = name
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)

  return words.slice(0, 2).join('').toUpperCase() || defaultStoreInfo.sigla
}

const formatDeliveryTime = (store: ApiStore) => {
  const explicit = firstText(
    typeof store.tempoEntrega === 'string' ? store.tempoEntrega : null,
    typeof store.prazoEntrega === 'string' ? store.prazoEntrega : null,
    typeof store.deliveryTime === 'string' ? store.deliveryTime : null,
  )

  if (explicit) {
    return explicit
  }

  const min = toNumber(store.tempoMinimoEntrega, 0)
  const max = toNumber(store.tempoMaximoEntrega, 0)

  if (min && max) {
    return `${min}-${max} min`
  }

  const singleTime = toNumber(
    store.tempoEntrega ?? store.prazoEntrega ?? store.deliveryTime,
    0,
  )

  return singleTime ? `${singleTime} min` : defaultStoreInfo.tempoEntrega
}

const isOpen = (store: ApiStore) => {
  if (typeof store.aberto === 'boolean') {
    return store.aberto
  }

  if (typeof store.isAberto === 'boolean') {
    return store.isAberto
  }

  if (typeof store.aberta === 'boolean') {
    return store.aberta
  }

  if (store.status) {
    return !['fechado', 'closed', 'inativo', 'offline'].includes(
      store.status.trim().toLowerCase(),
    )
  }

  return defaultStoreInfo.aberto
}

const normalizeStore = (store: ApiStore): StoreInfo => {
  const nome =
    firstText(
      store.nome,
      store.nomeFantasia,
      store.name,
      store.titulo,
      store.razaoSocial,
    ) || defaultStoreInfo.nome

  const descricao =
    firstText(store.descricao, store.description, store.sobre, store.segmento, store.categoria) ||
    defaultStoreInfo.descricao
  const horarios = normalizeSchedule(
    store.horarioFuncionamento ||
      store.horariosFuncionamento ||
      store.horarios ||
      store.funcionamento ||
      store.businessHours,
  )
  const scheduleStatus = getStatusFromSchedule(horarios)

  return {
    id: store.id ? String(store.id) : undefined,
    nome,
    sigla: getInitials(nome),
    descricao,
    capa:
      firstText(store.capa, store.banner, store.coverUrl, store.cover, store.imagemCapa) ||
      defaultStoreInfo.capa,
    logo: firstText(store.logo, store.logoUrl, store.imagem, store.img) || null,
    aberto: scheduleStatus?.aberto ?? isOpen(store),
    avaliacao: toNumber(store.avaliacao ?? store.rating ?? store.nota, defaultStoreInfo.avaliacao || 0),
    tempoEntrega: formatDeliveryTime(store),
    pedidoMinimo: toNumber(
      store.pedidoMinimo ?? store.valorMinimoPedido ?? store.minimumOrder,
      defaultStoreInfo.pedidoMinimo,
    ),
    taxaEntrega: toNumber(
      store.taxaEntrega ?? store.valorEntrega ?? store.deliveryFee,
      defaultStoreInfo.taxaEntrega,
    ),
    taxaServico: toNumber(store.taxaServico ?? store.serviceFee, defaultStoreInfo.taxaServico),
    telefone: firstText(store.telefone, store.phone, store.celular) || null,
    whatsapp: firstText(store.whatsapp) || null,
    email: firstText(store.email) || null,
    instagram: firstText(store.instagram) || null,
    endereco: firstText(store.enderecoCompleto, store.endereco, store.address) || null,
    horarioResumo: getScheduleSummary(store, horarios),
    horarioHoje: scheduleStatus?.horarioHoje || null,
    statusDetalhe: scheduleStatus?.statusDetalhe || null,
    horarios,
  }
}

const lojaService = {
  get: async (): Promise<StoreInfo> => {
    let lastError: unknown

    for (const endpoint of endpointCandidates) {
      try {
        const response = await api.get<StoreResponse>(endpoint)
        const store = getStoreFromResponse(response.data)

        if (store) {
          return normalizeStore(store)
        }
      } catch (error) {
        lastError = error
      }
    }

    throw lastError instanceof Error ? lastError : new Error('Loja nao encontrada')
  },
}

export default lojaService
