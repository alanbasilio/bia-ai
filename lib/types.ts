export type StatusPedido = "pago" | "pendente" | "enviado" | "cancelado";
export type FormaPagamento = "pix" | "cartao" | "dinheiro" | "transferencia";

export interface Cliente {
  id: string;
  nome: string;
  instagram: string | null;
  whatsapp: string | null;
  endereco: string | null;
  observacoes: string | null;
  created_at: string;
}

export interface Pedido {
  id: string;
  cliente_id: string | null;
  produto: string;
  quantidade: number;
  valor: number;
  status: StatusPedido;
  data_pedido: string;
  forma_pagamento: FormaPagamento | null;
  observacoes: string | null;
  created_at: string;
  clientes?: Pick<Cliente, "id" | "nome"> | null;
}

export type ClienteInput = Omit<Cliente, "id" | "created_at">;
export type PedidoInput = Omit<Pedido, "id" | "created_at" | "clientes">;

export interface Database {
  public: {
    Tables: {
      clientes: {
        Row: Cliente;
        Insert: ClienteInput;
        Update: Partial<ClienteInput>;
      };
      pedidos: {
        Row: Pedido;
        Insert: PedidoInput;
        Update: Partial<PedidoInput>;
      };
    };
    Enums: {
      status_pedido: StatusPedido;
      forma_pagamento: FormaPagamento;
    };
  };
}
