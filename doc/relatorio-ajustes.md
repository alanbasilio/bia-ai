# Relatório de Formatação — bia-sell.xlsx

**Arquivo analisado:** `public/bia-sell.xlsx`
**Data da análise:** 2026-06-15
**Total de pedidos:** 193 linhas | **Abas:** Pedidos, NÃO MEXER, Contatos clientes
**Objetivo:** Padronizar dados para migração ao Supabase

---

## Sumário de Problemas

| # | Coluna / Área | Severidade | Problema |
|---|---------------|------------|---------|
| 1 | Status do Pedido | 🔴 Crítico | 29 valores únicos para 4 categorias reais |
| 2 | Data | 🔴 Crítico | 6 formatos diferentes; 17 registros sem ano |
| 3 | Valor | 🟠 Alto | 5 formatos misturados; 1 valor textual ("GRÁTIS") |
| 4 | Aba "NÃO MEXER" | 🟠 Alto | Fórmulas SUMIF calculando faturamento incorreto |
| 5 | Forma de Pagamento | 🟡 Médio | 10 variações para 4 métodos distintos |
| 6 | Campos Vazios | 🟡 Médio | 19 pedidos sem forma de pagamento |
| 7 | Contatos clientes | 🔵 Info | Muitos campos NULL; sem chave ligando às abas |

---

## 1. Status do Pedido — 🔴 Crítico

**Problema:** 29 valores únicos representando apenas 4 categorias reais. Capitalização inconsistente, emojis, abreviações e texto livre.

| Categoria Canônica | Valores encontrados na planilha | Ocorrências |
|--------------------|---------------------------------|-------------|
| `pago` | `Pago`, `pago`, `PAGO`, `pago!`, `pago` (com espaço), `pg`, `OK`, `✅`, `Pago via PIX`, `pago - confirmado` | ≈ 78 |
| `pendente` | `PENDENTE`, `Pendente`, `pendente`, `aguardando`, `aguardando pix`, `falta pagar`, `⏳` | ≈ 32 |
| `enviado` | `Enviado`, `enviado`, `ENVIADO`, `enviado correios`, `postado`, `saiu hj` | ≈ 30 |
| `cancelado` | `Cancelado`, `CANCELADO`, `cancelou`, `desistiu` | ≈ 19 |
| ⚠️ **revisar** | `t` (linha 134), `devolvido` | 7 |

**Impacto direto:** A aba "NÃO MEXER" usa `=SUMIF` com `"pago"`, `"Pago"` e `"PAGO"` em linhas separadas e ainda assim ignora `✅`, `OK`, `pg`, `pago!`, entre outros. Os totais mensais de faturamento estão **subestimados**.

**Ajuste sugerido:** Usar `ENUM` no Supabase com os 4 valores canônicos:

```sql
CREATE TYPE status_pedido AS ENUM ('pago', 'pendente', 'enviado', 'cancelado');
```

> Decidir se `devolvido` merece uma 5ª categoria antes de migrar.

---

## 2. Data — 🔴 Crítico

**Problema:** 6 formatos de data diferentes coexistindo na mesma coluna.

| Formato | Exemplo | Ocorrências | Problema |
|---------|---------|-------------|---------|
| `DD/MM/YYYY` | `02/02/2025` | 32 | ✅ Mais consistente |
| `DD-MM-YYYY` | `09-02-2025` | 35 | Separador incorreto (traço) |
| `YYYY-MM-DD` (ISO) | `2025-02-11` | 30 | Ordem invertida |
| `DD Mês YYYY` | `22 Feb 2025` | 30 | Mês em inglês, texto livre |
| `D/M/YYYY` ou `DD/MM/YY` | `5/3/2025`, `08/04/25` | 48 | Sem zero à esquerda / ano abreviado |
| `DD/MM` *(sem ano)* | `03/02` | **17** | ⚠️ **Ano ausente — dados incompletos** |

**Ajuste sugerido:** Normalizar tudo para `DATE` (`YYYY-MM-DD`) no Supabase. As 17 datas sem ano precisam de **revisão manual** (provavelmente 2025, mas não é possível confirmar automaticamente).

---

## 3. Valor — 🟠 Alto

**Problema:** 5 formatos de valor monetário misturados; a coluna não é numérica.

| Formato | Exemplo | Ocorrências | Problema |
|---------|---------|-------------|---------|
| Com símbolo `R$` | `R$ 45.00`, `R$ 55,00` | 103 | Símbolo incluso — não é número; mistura ponto e vírgula |
| Decimal com vírgula (BR) | `150,00` | 34 | Vírgula como separador decimal |
| Decimal com ponto | `35.0`, `240.0` | 29 | Compatível, mas inconsistente |
| Inteiro | `86`, `165` | 25 | OK, mas misturado com os outros |
| Texto | `GRÁTIS` | **1** | ⚠️ Não é número (linha 134) |

**Ajuste sugerido:**

- Remover `R$` e espaços
- Substituir vírgula por ponto
- Converter para `NUMERIC(10,2)` no Supabase
- `GRÁTIS` → inserir como `0.00` e registrar em `observacoes`

```sql
valor NUMERIC(10,2) NOT NULL
```

---

## 4. Aba "NÃO MEXER" — 🟠 Alto

**Problema:** As fórmulas de faturamento mensal usam `SUMIF` com comparação de texto case-sensitive:

```
Janeiro:   =SUMIF(Pedidos!E:E,"pago",Pedidos!D:D)
Fevereiro: =SUMIF(Pedidos!E:E,"Pago",Pedidos!D:D)
Março:     =SUMIF(Pedidos!E:E,"PAGO",Pedidos!D:D)
```

Essas fórmulas ignoram `✅`, `OK`, `pg`, `pago!`, `pago` (com espaço), `Pago via PIX`, etc. O faturamento calculado está **incorreto e subestimado**.

**Ajuste sugerido:** Após migrar para o Supabase, substituir por uma query SQL simples:

```sql
SELECT
  DATE_TRUNC('month', data_pedido) AS mes,
  SUM(valor)                        AS faturamento
FROM pedidos
WHERE status = 'pago'
GROUP BY 1
ORDER BY 1;
```

---

## 5. Forma de Pagamento — 🟡 Médio

**Problema:** 10 variações para 4 métodos de pagamento distintos.

| Variações na planilha | Valor canônico | Ocorrências |
|-----------------------|----------------|-------------|
| `pix`, `Pix`, `PIX`, `pix nubank`, `PIX - Banco Inter` | `pix` | 86 |
| `Cartão`, `cartao`, `cartão` | `cartao` | 60 |
| `dinheiro` | `dinheiro` | 18 |
| `transferência` | `transferencia` | 10 |
| *(vazio)* | `NULL` | **19** |

**Ajuste sugerido:**

```sql
CREATE TYPE forma_pagamento AS ENUM ('pix', 'cartao', 'dinheiro', 'transferencia');
```

> Avaliar se `pix nubank` e `PIX - Banco Inter` precisam ser rastreados separadamente (banco do recebimento). Se sim, adicionar coluna `banco_recebimento TEXT`.

---

## 6. Campos Vazios — 🟡 Médio

| Coluna | Vazios | Total | % faltando |
|--------|--------|-------|-----------|
| Observações | 71 | 193 | 37% — aceitável (campo opcional) |
| Forma de Pagamento | **19** | 193 | 10% — requer atenção |
| Nome cliente | 1 | 193 | revisar linha |
| Qtd | 1 | 193 | revisar linha |
| Valor | 1 | 193 | revisar linha |
| Status | 1 | 193 | revisar linha |
| Data | 1 | 193 | revisar linha |

---

## 7. Aba "Contatos clientes" — 🔵 Info

**Problema:** Tabela de 15 clientes com muitos campos NULL e sem chave estrangeira ligando à aba Pedidos.

| Campo | Situação |
|-------|---------|
| WhatsApp | Formato `(81) 9XXXX-XXXX` consistente nos preenchidos. Muitos NULL. |
| Instagram | Formato `@handle` consistente. Muitos NULL. |
| Endereço | Texto livre, sem CEP/bairro estruturado. Maioria NULL. |
| Nome | **Sem ID único** — join com Pedidos depende de nome exato (risco de duplicatas). |

**Ajuste sugerido:** Criar tabela `clientes` com `id UUID` como chave primária e referenciar em `pedidos.cliente_id`.

---

## Schema Supabase Sugerido

### Tabela `clientes`

```sql
CREATE TABLE clientes (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  nome        TEXT        NOT NULL,
  instagram   TEXT,
  whatsapp    TEXT,
  endereco    TEXT,
  observacoes TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### Tabela `pedidos`

```sql
CREATE TYPE status_pedido   AS ENUM ('pago', 'pendente', 'enviado', 'cancelado');
CREATE TYPE forma_pagamento AS ENUM ('pix', 'cartao', 'dinheiro', 'transferencia');

CREATE TABLE pedidos (
  id              UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id      UUID            REFERENCES clientes(id),
  produto         TEXT            NOT NULL,
  quantidade      INTEGER         NOT NULL DEFAULT 1,
  valor           NUMERIC(10,2)   NOT NULL,
  status          status_pedido   NOT NULL DEFAULT 'pendente',
  data_pedido     DATE            NOT NULL,
  forma_pagamento forma_pagamento,
  observacoes     TEXT,
  created_at      TIMESTAMPTZ     DEFAULT now()
);
```

---

## Checklist de Migração

- [ ] Definir se `devolvido` entra como 5ª categoria de status
- [ ] Revisar manualmente as **17 datas sem ano** e a linha com `devolvido`
- [ ] Revisar linha com `GRÁTIS` no valor
- [ ] Revisar linha com status `t`
- [ ] Revisar os **5 registros** com campos obrigatórios vazios (Nome, Qtd, Valor, Status, Data)
- [ ] Decidir se `pix nubank` / `PIX - Banco Inter` precisam de coluna separada
- [ ] Criar tabelas no Supabase com o schema acima
- [ ] Rodar script de normalização e migração
- [ ] Validar totais de faturamento antes e depois da migração
