import type { Tables, TablesInsert, Enums } from "./database.types";

export type StatusPedido = Enums<"status_pedido">;
export type FormaPagamento = Enums<"forma_pagamento">;

export type Cliente = Tables<"clientes">;
export type ClienteInput = TablesInsert<"clientes">;

export type Pedido = Tables<"pedidos"> & {
  clientes?: Pick<Cliente, "id" | "nome"> | null;
};
export type PedidoInput = TablesInsert<"pedidos">;
