export type EstadoStock = 'OK' | 'INSUFICIENTE';

export interface Producto {
  id?: number;              // <-- Agrega el signo de interrogación aquí
  nombre: string;
  precio: number;
  stock: number;
  estadoStock?: EstadoStock | string;  // <-- Agrega el signo de interrogación aquí
}