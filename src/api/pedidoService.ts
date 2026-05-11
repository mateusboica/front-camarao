import api from './api'

type Pedido = {
    id: string
    cliente: {
        telefone: string
        nome: string
    }
    itens: {
        produtoId: string
        quantidade: number
    }
    total: number
    localRetirada: string
    createdAt: string
    updatedAt: string
}

const pedidoService = {
    post: async (pedido: Pedido) => {
        const response = await api.post('/pedidos', pedido)
        return response.data
    }
}

export default pedidoService
