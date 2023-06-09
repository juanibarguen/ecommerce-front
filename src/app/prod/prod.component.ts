import { Componente } from '../componente';
import { ComponenteService } from '../componente.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Component } from '@angular/core';


@Component({
  selector: 'app-prod',
  templateUrl: './prod.component.html',
  styleUrls: ['./prod.component.css']
})
export class ProdComponent {
  id:number;
  nombre:string;
  categoria:string;
  componentes: Componente[];
  componente: any;
  valorCuotas:number;
  cantidad:number = 1;
  productosRelacionados: any[] = [];

  constructor(
    private componenteService: ComponenteService ,
    private route: ActivatedRoute,
    private titleService: Title
     ){ }
    
    
    ngOnInit(): void {
      this.route.params.subscribe(params => {
        this.id = +params['id'];
        this.nombre = params['nombre'];
        this.categoria = params['categoria'];
    
        this.componenteService.obtenerListaDeComponentes().subscribe(componentes => {
          // Buscar el componente por su ID
          this.componente = componentes.find(componente => componente.id === this.id);
          this.valorCuotas = this.componente.precio / 12;
    
          this.productosRelacionados = componentes.filter(componente =>
            componente.categoria === this.componente.categoria && componente.id !== this.id
          );
          this.productosRelacionados = this.productosRelacionados.slice(0, 4);
        });
      });

      this.titleService.setTitle(this.transformarUpper(this.nombre));
      
    }

    

    
  obtenerComponentes() {
      this.componenteService.obtenerListaDeComponentes().subscribe(data => {
        this.componentes = data
        console.log(data);
      });
    } 

  transformarUpper(categoria: string): string {
      return categoria.replace(/-/g, ' ').toUpperCase();
    }
    
  sumarCantidad(){ 
    if (this.cantidad < this.componente.stock) {
      this.cantidad = this.cantidad + 1;
    }else {
      alert("Maximo de stock alcanzado")
    }
  }

  cambiarTitulo(nombre: string) {
    this.titleService.setTitle(this.transformarUpper(nombre));
  }

  restarCantidad(){ 
    if(this.cantidad > 0) this.cantidad = this.cantidad - 1;
  }

  nombreFormateado(nombre: string): string {
    return nombre.toLowerCase().replace(/\s+/g, '-');
  }

  agregarAlCarrito(componente: any) {
    this.componenteService.agregarAlCarrito(componente);

  }



}
