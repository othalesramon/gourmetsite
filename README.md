# gourmetsite

Loja gourmet web para equipe de revendedores, com:

- Login por loja.
- Vitrine com produtos liberados conforme a loja.
- Preços personalizados por loja.
- Carrinho com envio do pedido para WhatsApp.

## Testar no navegador (sem instalar nada local)

A forma mais simples é usar **GitHub Pages**. Este repositório já inclui workflow de deploy automático.

### Passo a passo (1x)

1. Publique o projeto no GitHub.
2. Vá em **Settings → Pages**.
3. Em **Build and deployment**, selecione **Source: GitHub Actions**.
4. Faça push para a branch `main`.
5. Aguarde a execução do workflow **"Deploy static site to GitHub Pages"** em **Actions**.
6. Abra a URL publicada, no formato:
   - `https://<seu-usuario>.github.io/<nome-do-repo>/`

> Depois disso, todo novo push na `main` atualiza o site automaticamente.

## Como validar rapidamente no site publicado

1. Acesse a URL do Pages.
2. Faça login com uma loja de exemplo:

| Código da loja      | Senha         |
|---------------------|---------------|
| `loja-centro`       | `gourmet123`  |
| `loja-zona-sul`     | `premium456`  |
| `loja-bairro-norte` | `sabor789`    |

3. Confirme que:
   - A vitrine muda de acordo com a loja.
   - Os preços mudam de acordo com a loja.
   - O carrinho soma corretamente.
   - O botão de WhatsApp abre com a mensagem do pedido preenchida.

## Execução local (opcional)

Se quiser rodar localmente também:

```bash
python3 -m http.server 4173
```

Depois acesse `http://localhost:4173`.

Os números de WhatsApp de destino e regras por loja estão no `app.js`.
