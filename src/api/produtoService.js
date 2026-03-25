import api from "./api";

const ProdutoService = {

  listarTodos: (page = 0, size = 12) =>
    api.get(`/api/v1/produtos?page=${page}&size=${size}`),

  listarDisponiveis: (page = 0, size = 12) =>
    api.get(`/api/v1/produtos?disponivel=true&page=${page}&size=${size}`),

  buscarPorId: (id) =>
    api.get(`/api/v1/produtos/${id}`),

  buscarPorCategoria: (categoria, page = 0) =>
    api.get(`/api/v1/produtos/categoria/${categoria}?page=${page}`),

  buscar: (termo) =>
    api.get(`/api/v1/produtos/busca?termo=${termo}`),

  buscarPorSlug: (slug) =>
    api.get(`/api/v1/produtos/slug/${slug}`),

  criar: (dados) =>
    api.post("/api/v1/produtos", dados),

  atualizar: (id, dados) =>
    api.put(`/api/v1/produtos/${id}`, dados),

  alterarDisponibilidade: (id, disponivel) =>
    api.patch(`/api/v1/produtos/${id}/disponibilidade`, { isDisponivel: disponivel }),

  deletar: (id) =>
    api.delete(`/api/v1/produtos/${id}`),
};

export default ProdutoService;