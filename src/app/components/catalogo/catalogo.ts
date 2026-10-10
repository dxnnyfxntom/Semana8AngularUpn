import { Component, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Producto } from '../../models/producto';
import { ProductoService } from '../../services/producto';
import { NgClass, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-catalogo',
  imports: [RouterLink, NgClass, CurrencyPipe], 
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.scss'
})
export class Catalogo implements OnInit {

  // 1. Estados principales
  productos = signal<Producto[]>([]);
  filtro = signal(''); // <-- Agregado para el buscador
  cargando = signal(false);
  error = signal('');

  // 2. Lista derivada que reacciona al buscador
  productosFiltrados = computed(() => {
    const texto = this.filtro().trim().toLowerCase();
    return this.productos().filter((p) => p.nombre.toLowerCase().includes(texto));
  });

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  // 3. Método que captura lo que escribes en la barra de búsqueda
  buscar(texto: string): void {
    this.filtro.set(texto);
  }

  cargarProductos(): void {
    this.cargando.set(true);
    this.error.set('');

    this.productoService.listar().subscribe({
      next: datos => {
        this.productos.set(datos);
        this.cargando.set(false);
      },
      error: err => {
        this.error.set(`Error HTTP: ${err.status}`);
        this.cargando.set(false);
      }
    });
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Desea eliminar este producto?')) return;

    this.productoService.eliminar(id).subscribe({
      next: () => this.cargarProductos(),
      error: err => this.error.set(`Error HTTP: ${err.status}`)
    });
  }
}