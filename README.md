# gourmetsite

Loja gourmet web para equipe de revendedores, com:

- Login por loja.
- Login de administrador.
- Cadastro de empresas (código + senha).
- Cadastro de produtos mestre.
- Liberação de produtos e preços por empresa.
- Carrinho com envio do pedido para WhatsApp.

## Credenciais de exemplo

### Administrador

- Usuário: `admin`
- Senha: `admin123`

### Revendedores

| Código da loja      | Senha         |
|---------------------|---------------|
| `loja-centro`       | `gourmet123`  |
| `loja-zona-sul`     | `premium456`  |
| `loja-bairro-norte` | `sabor789`    |

## Execução local

```bash
python3 -m http.server 4173
```

Abra `http://localhost:4173`.

> Os dados de empresas e catálogo são persistidos no `localStorage` do navegador.
