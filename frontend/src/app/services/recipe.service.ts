import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Recipe } from '../models/recipe.model';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private readonly API = 'http://localhost:3000/api/recipes';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.auth.getToken()}` });
  }

  getAll() {
    return this.http.get<Recipe[]>(this.API, { headers: this.headers() });
  }

  create(recipe: Recipe) {
    return this.http.post<Recipe>(this.API, recipe, { headers: this.headers() });
  }

  update(id: string, recipe: Partial<Recipe>) {
    return this.http.put<Recipe>(`${this.API}/${id}`, recipe, { headers: this.headers() });
  }

  delete(id: string) {
    return this.http.delete<{ message: string }>(`${this.API}/${id}`, { headers: this.headers() });
  }
}
