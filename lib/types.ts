import type { Tables, TablesInsert, Enums } from "./database.types";

export type StatusPedido = Enums<"status_pedido">;
export type FormaPagamento = Enums<"forma_pagamento">;

export type Cliente = Tables<"clientes">;
export type ClienteComContagem = Cliente & { pedidos?: Array<{ count: number }> };
export type ClienteInput = TablesInsert<"clientes">;

export type Produto = Tables<"produtos">;
export type ProdutoComContagem = Produto & { pedidos?: Array<{ count: number }> };
export type ProdutoInput = TablesInsert<"produtos">;

export type Pedido = Tables<"pedidos"> & {
  clientes?: Pick<Cliente, "id" | "nome"> | null;
  produtos?: Pick<Produto, "id" | "nome" | "preco"> | null;
};
export type PedidoInput = TablesInsert<"pedidos">;
