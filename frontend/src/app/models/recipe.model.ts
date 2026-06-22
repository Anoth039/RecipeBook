export type Category = 'Leves' | 'Főétel' | 'Desszert' | 'Saláta' | 'Reggeli' | 'Köret' | 'Snack';
export type Cuisine = 'Magyar' | 'Olasz' | 'Ázsiai' | 'Mexikói' | 'Francia' | 'Mediterrán' | 'Amerikai';
export type Difficulty = 'Könnyű' | 'Közepes' | 'Nehéz';
export type Allergen = 'Glutén' | 'Tejtermék' | 'Tojás' | 'Mogyoró' | 'Szója' | 'Hal' | 'Rák' | 'Dió' | 'Mustár' | 'Egyéb';

export interface Recipe {
  _id?: string;
  name: string;
  category: Category;
  cuisine: Cuisine;
  difficulty: Difficulty;
  prepTimeMinutes: number;
  servings: number;
  caloriesPerServing: number;
  ingredients: string;
  instructions: string;
  allergens: Allergen[];
  allergenNote: string;
  createdAt?: string;
  updatedAt?: string;
}

export const CATEGORIES: Category[] = ['Leves', 'Főétel', 'Desszert', 'Saláta', 'Reggeli', 'Köret', 'Snack'];
export const CUISINES: Cuisine[] = ['Magyar', 'Olasz', 'Ázsiai', 'Mexikói', 'Francia', 'Mediterrán', 'Amerikai'];
export const DIFFICULTIES: Difficulty[] = ['Könnyű', 'Közepes', 'Nehéz'];
export const ALLERGENS: Allergen[] = ['Glutén', 'Tejtermék', 'Tojás', 'Mogyoró', 'Szója', 'Hal', 'Rák', 'Dió', 'Mustár', 'Egyéb'];
