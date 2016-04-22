import {Component, EventEmitter, Input, Output} from 'angular2/core';
import {MealFoodFormComponent} from 'component/meal-food-form.component';

@Component({
    selector: 'meal-foods',
    templateUrl: 'component/meal-foods.component.html',
    directives: [MealFoodFormComponent]
})
export class MealFoodsComponent {
    @Input() mealFoods: Array;
    @Output() onMealFoodRemoved = new EventEmitter<boolean>();
    @Output() onMealFoodSaved = new EventEmitter<boolean>();
    @Output() onMealFoodAdded = new EventEmitter<boolean>();

    selectedFood;
    isAddOpen = false;
    
    removeMealFood(mealFood) {
        this.mealFoods.splice(this.mealFoods.indexOf(mealFood), 1);
        this.onMealFoodRemoved.emit(mealFood);
    }

    saveMealFood(mealFood) {
        this.selectedFood = null;
        this.onMealFoodSaved.emit(mealFood);
    }

    addMealFood(mealFood) {
        this.closeAdd();
        this.onMealFoodAdded.emit(mealFood);
    }

    editMode(mealFood = null) {
        if (mealFood) {
            return this.selectedFood === mealFood;
        }
        return this.selectedFood;
    }

    openEdit(mealFood) {
        this.selectedFood = mealFood;
        this.closeAdd();
    }

    closeEdit() {
        this.selectedFood = null;
    }

    openAdd(el, a) {
        this.isAddOpen = true;
        this.selectedFood = null;
    }

    closeAdd() {
        this.isAddOpen = false;
    }
}