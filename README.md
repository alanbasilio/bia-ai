# Bia Sell — Painel de Gestão de Pedidos

Painel web para gerenciamento de pedidos e clientes de uma loja de acessórios, migrado de planilha Excel para banco de dados estruturado.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + shadcn/ui + Tailwind CSS v4 |
| Banco de dados | Supabase (PostgreSQL) |
| Estado / Cache | TanStack React Query v5 |
| Formulários | React Hook Form + Zod |
| Notificações | Sonner |
| Linting | Biome |

## Funcionalidades

- **Pedidos** — listagem, busca por produto/cliente, criação, edição e exclusão
- **Clientes** — listagem, busca por nome, criação, edição e exclusão
- Status de pedido com badge visual: `pago · pendente · enviado · cancelado`
- Sidebar de navegação com layout de dashboard
- Toasts de feedback para todas as operações

## Pré-requisitos

- Node.js 18+
- Projeto criado no [Supabase](https://supabase.com)

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais do Supabase (Settings → API):

```bash
cp .env.local.example .env
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyxxxxxxxxxxxxx

# Opcional — bypassa RLS. Se omitido, usa a anon key (funciona com RLS desabilitado)
SUPABASE_SERVICE_ROLE_KEY=eyxxxxxxxxxxxxx
```

### 3. Criar tabelas e importar dados

No Supabase Dashboard → **SQL Editor**, cole e execute o conteúdo de [`public/schema-seed.sql`](public/schema-seed.sql).

O script é idempotente e faz:
1. Cria os tipos ENUM (`status_pedido`, `forma_pagamento`)
2. Cria as tabelas `clientes` e `pedidos`
3. Desabilita RLS (painel admin sem autenticação)
4. Insere 33 clientes e 184 pedidos migrados da planilha original

### 4. Rodar em desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) — redireciona automaticamente para `/pedidos`.

## Estrutura do projeto

```
app/
  api/
    pedidos/          # GET (list+search), POST
    pedidos/[id]/     # GET, PUT, DELETE
    clientes/         # GET (list+search), POST
    clientes/[id]/    # GET, PUT, DELETE
  pedidos/page.tsx
  clientes/page.tsx
  layout.tsx

components/
  layout/             # Sidebar, PageHeader
  pedidos/            # PedidosTable, PedidoForm, PedidoDialog, StatusBadge
  clientes/           # ClientesTable, ClienteForm, ClienteDialog
  providers.tsx       # QueryClientProvider + ThemeProvider + Toaster
  ui/                 # Componentes shadcn

hooks/
  use-pedidos.ts      # useQuery + useMutation (create / update / delete)
  use-clientes.ts

lib/
  supabase.ts         # Cliente lazy (usa service_role ou anon key)
  types.ts            # Tipos TypeScript: Pedido, Cliente, ENUMs
  utils.ts            # cn()

public/
  bia-sell.xlsx         # Planilha original
  schema-seed.sql       # Schema + seed para Supabase
  migrar-supabase.py    # Script de normalização dos dados
  relatorio-formatacao.md
```

## Schema do banco

```sql
CREATE TYPE status_pedido   AS ENUM ('pago', 'pendente', 'enviado', 'cancelado');
CREATE TYPE forma_pagamento AS ENUM ('pix', 'cartao', 'dinheiro', 'transferencia');

CREATE TABLE clientes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        TEXT NOT NULL,
  instagram   TEXT,
  whatsapp    TEXT,
  endereco    TEXT,
  observacoes TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE pedidos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id      UUID REFERENCES clientes(id) ON DELETE SET NULL,
  produto         TEXT NOT NULL,
  quantidade      INTEGER NOT NULL DEFAULT 1,
  valor           NUMERIC(10,2) NOT NULL,
  status          status_pedido NOT NULL DEFAULT 'pendente',
  data_pedido     DATE NOT NULL,
  forma_pagamento forma_pagamento,
  observacoes     TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

## Scripts

```bash
npm run dev      # Servidor de desenvolvimento
npm run build    # Build de produção
npm run lint     # Biome check
npm run format   # Biome format
```

## Origem dos dados

Os dados foram migrados da planilha `public/bia-sell.xlsx` usando `public/migrar-supabase.py`, que normaliza 6 formatos de data, 5 formatos de valor monetário e 29 variações de status para os 4 valores canônicos do ENUM.
