import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../services/auth.service';
import { RecipeService } from '../../services/recipe.service';
import { ThemeService } from '../../services/theme.service';
import { Recipe } from '../../models/recipe.model';
import { RecipeDialogComponent } from './recipe-dialog.component';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule,
    MatDialogModule, MatChipsModule, MatProgressSpinnerModule,
    MatFormFieldModule, MatInputModule, MatTooltipModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.scss'
})
export class RecipesComponent implements OnInit {
  recipes: Recipe[] = [];
  loading = true;
  errorMessage = '';
  searchTerm = '';
  expandedIds = new Set<string>();

  readonly difficultyColors: Record<string, string> = {
    'Könnyű': '#4caf50',
    'Közepes': '#fb8c00',
    'Nehéz': '#e53935'
  };

  constructor(
    public auth: AuthService,
    public theme: ThemeService,
    private recipeService: RecipeService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadRecipes();
  }

  get filteredRecipes(): Recipe[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.recipes;
    return this.recipes.filter(r =>
      r.name.toLowerCase().includes(term) ||
      r.category.toLowerCase().includes(term) ||
      r.cuisine.toLowerCase().includes(term) ||
      r.ingredients.toLowerCase().includes(term)
    );
  }

  onSearchChange() {
    this.cdr.markForCheck();
  }

  isExpanded(recipe: Recipe): boolean {
    return !!recipe._id && this.expandedIds.has(recipe._id);
  }

  toggleExpand(recipe: Recipe) {
    if (!recipe._id) return;
    if (this.expandedIds.has(recipe._id)) {
      this.expandedIds.delete(recipe._id);
    } else {
      this.expandedIds.add(recipe._id);
    }
    this.cdr.markForCheck();
  }

  loadRecipes() {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();
    this.recipeService.getAll().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Hiba történt a receptek betöltése közben.';
        this.cdr.markForCheck();
      }
    });
  }

  openCreate() {
    const ref = this.dialog.open(RecipeDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      data: { mode: 'create' }
    });
    ref.afterClosed().subscribe(result => {
      if (!result) return;
      this.errorMessage = '';
      this.recipeService.create(result).subscribe({
        next: (r) => {
          this.recipes = [r, ...this.recipes];
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Hiba történt a recept létrehozása közben.';
          this.cdr.markForCheck();
        }
      });
    });
  }

  openEdit(recipe: Recipe) {
    const ref = this.dialog.open(RecipeDialogComponent, {
      width: '700px',
      maxWidth: '95vw',
      data: { mode: 'edit', recipe }
    });
    ref.afterClosed().subscribe(result => {
      if (!result || !recipe._id) return;
      this.errorMessage = '';
      this.recipeService.update(recipe._id, result).subscribe({
        next: (updated) => {
          this.recipes = this.recipes.map(r => r._id === updated._id ? updated : r);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Hiba történt a recept mentése közben.';
          this.cdr.markForCheck();
        }
      });
    });
  }

  deleteRecipe(recipe: Recipe) {
    if (!confirm(`Biztosan törlöd "${recipe.name}" receptet?`)) return;
    this.recipeService.delete(recipe._id!).subscribe({
      next: () => {
        this.recipes = this.recipes.filter(r => r._id !== recipe._id);
        this.cdr.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Hiba történt a recept törlése közben.';
        this.cdr.markForCheck();
      }
    });
  }

  toggleTheme() {
    this.theme.toggle();
  }

  logout() {
    this.auth.logout();
  }
}
