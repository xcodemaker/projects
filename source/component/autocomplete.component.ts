import {Component, Input} from "angular2/core";
import {AutocompleteService} from "service/autocomplete.service";
import {MealFood} from "model/mealFood";

@Component({
    selector: 'autocomplete',
    templateUrl: 'component/autocomplete.component.html',
    providers: [AutocompleteService]
})

export class AutocompleteComponent {
    @Input()
    mealFood: MealFood;
    suggestions: string[] = ['hthy', 'rthtr'];
    suggestion: string;
    dropdownOpen = false;

    constructor(private _autocompleteService: AutocompleteService) {}

    onKeyUp() {
        let suggestions: string[];
        let result = this._autocompleteService.getSuggestionEngine().search(this.mealFood.name, function(result) {
            suggestions = result;
        });
        if (suggestions.length > 0) {
            this.suggestion = this.mealFood.name + suggestions[0].substr(this.mealFood.name.length);
        }
        this.suggestions = suggestions;
        this.dropdownOpen = true;
    }

    selectSuggestion(suggestion) {
        this.mealFood.name = suggestion;
        this.mealFood.foodId = this._autocompleteService.getFoodIdByName(suggestion);
        this.dropdownOpen = false;
    }
}