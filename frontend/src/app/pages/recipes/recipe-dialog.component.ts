import { Component, Inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { Recipe, CATEGORIES, CUISINES, DIFFICULTIES, ALLERGENS } from '../../models/recipe.model';

export interface RecipeDialogData {
  mode: 'create' | 'edit';
  recipe?: Recipe;
}

@Component({
  selector: 'app-recipe-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatCheckboxModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Új recept felvétele' : 'Recept szerkesztése' }}</h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content class="dialog-content">

        <mat-form-field appearance="outline" class="full">
          <mat-label>Recept neve</mat-label>
          <input matInput formControlName="name" placeholder="pl. Gulyásleves">
          @if (form.get('name')?.hasError('required') && form.get('name')?.touched) {
            <mat-error>Kötelező mező</mat-error>
          }
          @if (form.get('name')?.hasError('minlength') && form.get('name')?.touched) {
            <mat-error>Minimum 2 karakter</mat-error>
          }
        </mat-form-field>

        <div class="row three-col">
          <mat-form-field appearance="outline">
            <mat-label>Kategória</mat-label>
            <mat-select formControlName="category">
              @for (c of categories; track c) {
                <mat-option [value]="c">{{ c }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Konyha</mat-label>
            <mat-select formControlName="cuisine">
              @for (c of cuisines; track c) {
                <mat-option [value]="c">{{ c }}</mat-option>
              }
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Nehézség</mat-label>
            <mat-select formControlName="difficulty">
              @for (d of difficulties; track d) {
                <mat-option [value]="d">{{ d }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>

        <div class="row three-col">
          <mat-form-field appearance="outline">
            <mat-label>Elkészítési idő (perc)</mat-label>
            <input matInput type="number" formControlName="prepTimeMinutes" min="1" max="600">
            @if (form.get('prepTimeMinutes')?.invalid && form.get('prepTimeMinutes')?.touched) {
              <mat-error>1-600 közötti egész szám</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Adagok száma</mat-label>
            <input matInput type="number" formControlName="servings" min="1" max="50">
            @if (form.get('servings')?.invalid && form.get('servings')?.touched) {
              <mat-error>1-50 közötti egész szám</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Kalória / adag</mat-label>
            <input matInput type="number" formControlName="caloriesPerServing" min="0" max="5000">
            @if (form.get('caloriesPerServing')?.invalid && form.get('caloriesPerServing')?.touched) {
              <mat-error>0-5000 közötti egész szám</mat-error>
            }
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="full">
          <mat-label>Hozzávalók</mat-label>
          <textarea matInput formControlName="ingredients" rows="3" placeholder="pl. 500g marhahús, 2 fej hagyma, ..."></textarea>
          @if (form.get('ingredients')?.hasError('required') && form.get('ingredients')?.touched) {
            <mat-error>Kötelező mező</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline" class="full">
          <mat-label>Elkészítés</mat-label>
          <textarea matInput formControlName="instructions" rows="4" placeholder="Lépésről lépésre leírás..."></textarea>
          @if (form.get('instructions')?.hasError('required') && form.get('instructions')?.touched) {
            <mat-error>Kötelező mező</mat-error>
          }
        </mat-form-field>

        <h3 class="section-title">Allergének</h3>
        <div formGroupName="allergens" class="allergen-grid">
          @for (a of allergensList; track a) {
            <mat-checkbox [formControlName]="a">{{ a }}</mat-checkbox>
          }
        </div>

        @if (form.get('allergens.Egyéb')?.value) {
          <mat-form-field appearance="outline" class="full">
            <mat-label>Egyéb allergén megnevezése</mat-label>
            <input matInput formControlName="allergenNote" placeholder="pl. penész, élesztő...">
            @if (form.get('allergenNote')?.hasError('required') && form.get('allergenNote')?.touched) {
              <mat-error>Add meg az egyéb allergén nevét</mat-error>
            }
            @if (form.get('allergenNote')?.hasError('maxlength')) {
              <mat-error>Legfeljebb 200 karakter</mat-error>
            }
          </mat-form-field>
        }

      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="dialogRef.close()">Mégse</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">
          {{ data.mode === 'create' ? 'Létrehozás' : 'Mentés' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .dialog-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      max-height: 70vh;
    }
    .full { width: 100%; }
    .row.three-col {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
    }
    .section-title {
      font-size: 0.95rem;
      color: #555;
      margin: 8px 0 4px;
    }
    .allergen-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 4px 12px;
      margin-bottom: 12px;
    }
    @media (max-width: 600px) {
      .row.three-col, .allergen-grid { grid-template-columns: 1fr 1fr; }
    }
  `]
})
export class RecipeDialogComponent {
  form: FormGroup;
  categories = CATEGORIES;
  cuisines = CUISINES;
  difficulties = DIFFICULTIES;
  allergensList = ALLERGENS;

  constructor(
    public dialogRef: MatDialogRef<RecipeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RecipeDialogData,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    const r = data.recipe;
    const intPattern = Validators.pattern(/^\d+$/);

    const allergenGroup: Record<string, [boolean]> = {};
    for (const a of ALLERGENS) {
      allergenGroup[a] = [r?.allergens?.includes(a) ?? false];
    }

    this.form = this.fb.group({
      name: [r?.name || '', [Validators.required, Validators.minLength(2)]],
      category: [r?.category || CATEGORIES[0], Validators.required],
      cuisine: [r?.cuisine || CUISINES[0], Validators.required],
      difficulty: [r?.difficulty || DIFFICULTIES[0], Validators.required],

      prepTimeMinutes: [r?.prepTimeMinutes ?? 30, [Validators.required, Validators.min(1), Validators.max(600), intPattern]],
      servings: [r?.servings ?? 4, [Validators.required, Validators.min(1), Validators.max(50), intPattern]],
      caloriesPerServing: [r?.caloriesPerServing ?? 0, [Validators.required, Validators.min(0), Validators.max(5000), intPattern]],

      ingredients: [r?.ingredients || '', Validators.required],
      instructions: [r?.instructions || '', Validators.required],

      allergens: this.fb.group(allergenGroup),
      allergenNote: [r?.allergenNote || '', Validators.maxLength(200)]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.cdr.markForCheck();
      return;
    }
    const value = this.form.value;

    const selectedAllergens = Object.entries(value.allergens)
      .filter(([, checked]) => checked)
      .map(([name]) => name);

    // ha be van pipálva az "Egyéb", de nincs hozzá szöveg megadva, jelezzünk hibát és ne küldjük el
    if (selectedAllergens.includes('Egyéb') && !value.allergenNote.trim()) {
      this.form.get('allergenNote')?.setErrors({ required: true });
      this.form.get('allergenNote')?.markAsTouched();
      this.cdr.markForCheck();
      return;
    }

    const payload: Recipe = {
      ...value,
      prepTimeMinutes: Number(value.prepTimeMinutes),
      servings: Number(value.servings),
      caloriesPerServing: Number(value.caloriesPerServing),
      allergens: selectedAllergens as Recipe['allergens'],
      allergenNote: selectedAllergens.includes('Egyéb') ? value.allergenNote.trim() : ''
    };
    this.dialogRef.close(payload);
  }
}
