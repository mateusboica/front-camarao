# Front Camarão

Frontend Web do cardápio feito no Back-camarao para acompanhar e realizar o pagamento de pedidos

## Visao geral

Este projeto centraliza o frontend de um sistema de cardapio digital. A aplicacao oferece:

- cardapio completo dos produtos disponíveis na loja
- realização de pedido com pagamento seguro
- acompanhamento de pedido via mapa
- conversa com loja via chat/ou conexão via api Whatsapp

## Stack

- **React** (com **TypeScript**)
- **Vite** (Bundler)
- **HTML5 & CSS3**
- **JavaScript (ES6+)**

## Estrutura principal

```text
front-camarao/src
|- api           # conexao com api
|- assets        # imagens e logos
|- components    # componentes reutilizaveis e desacoplados
|- css           # estilização
|- pages         # páginas 
|- routes        # gerenciamento de rotas
|- main.tsx      # arquivo principal
```

## Requisitos

- Node 24.12.0+

## Variaveis de ambiente

O projeto depende destas variaveis:

| Variavel | Obrigatoria | Descricao |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Sim | String de conexao à api |

Exemplo no PowerShell:

```powershell
$env:VITE_API_BASE_URL="http::localhost:8080/back-camarao"
```

## Como rodar localmente

### 1. Baixar as dependências

```bash
npm install
```

  ### 2. Rodar o código

```bash
npm run dev
```

Por padrao, o front sobe em:

- `http://localhost:5173`
