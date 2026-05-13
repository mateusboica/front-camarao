import api from './api'

export type PedidoPayload = {
    lojaId: string
    cliente: {
        telefone: string
        nome: string
    }
    itens: Array<{
        produtoId: string
        quantidade: number
        nome?: string
        valorUnitario?: number
    }>
    enderecoEntrega: {
        cep: string
        rua: string
        numero: string
        bairro: string
        complemento?: string
        referencia?: string
    }
    pagamento: {
        metodo: string
        trocoPara?: number | null
    }
    subtotal: number
    taxaEntrega: number
    taxaServico: number
    total: number
}

type PedidoRequest = {
    lojaId: string
    nomeCliente: string
    telefoneCliente: string
    enderecoEntrega: string
    observacao?: string
    itens: Array<{
        produtoId: string
        quantidade: number
    }>
}

const montarObservacao = (pedido: PedidoPayload) => {
    const partes = [
        pedido.enderecoEntrega.numero ? `Numero: ${pedido.enderecoEntrega.numero}` : null,
        pedido.enderecoEntrega.complemento ? `Complemento: ${pedido.enderecoEntrega.complemento}` : null,
        pedido.enderecoEntrega.referencia ? `Referencia: ${pedido.enderecoEntrega.referencia}` : null,
        `Pagamento: ${pedido.pagamento.metodo}`,
        pedido.pagamento.trocoPara ? `Troco para: R$ ${pedido.pagamento.trocoPara}` : null,
    ].filter(Boolean)

    return partes.join(' | ')
}

const toPedidoRequest = (pedido: PedidoPayload): PedidoRequest => ({
    lojaId: pedido.lojaId,
    nomeCliente: pedido.cliente.nome,
    telefoneCliente: pedido.cliente.telefone,
    enderecoEntrega: pedido.enderecoEntrega.cep,
    observacao: montarObservacao(pedido),
    itens: pedido.itens.map((item) => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade,
    })),
})

const pedidoService = {
    post: async (pedido: PedidoPayload) => {
        const response = await api.post('/v1/pedidos', toPedidoRequest(pedido))
        return response.data
    }
}

export default pedidoService
