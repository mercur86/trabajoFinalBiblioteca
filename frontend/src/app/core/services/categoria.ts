import { Service } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Categoria } from '../models/categoria';
import { GenericService } from './generic';

@Service()
export class CategoriaService extends GenericService<Categoria> {

  protected override url: string = `${environment.HOST}/v1/categorias`;
}
