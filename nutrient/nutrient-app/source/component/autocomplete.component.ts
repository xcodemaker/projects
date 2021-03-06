import {Component, Input, ViewChild, AfterViewInit, ElementRef} from "angular2/core";
import {AutocompleteService} from "../service/autocomplete.service";
import {MealFood} from "../model/mealFood";

@Component({
  selector: 'autocomplete',
  templateUrl: 'component/autocomplete.component.html',
  providers: [AutocompleteService],
  host: {
    '(document:click)': 'onClick($event)',
  }
})

export class AutocompleteComponent implements AfterViewInit {
  @Input()
  mealFood:MealFood;
  suggestions:string[] = ['hthy', 'rthtr'];
  suggestion:string;
  dropdownOpen = false;

  @ViewChild('input')
  input;

  constructor(private _autocompleteService:AutocompleteService,
              private _eref:ElementRef) {
  }

  ngAfterViewInit() {
    this.input.nativeElement.select();
  }

  onKeyUp() {
    let suggestions:string[];
    this._autocompleteService.getSuggestionEngine().search(this.mealFood.name, function (result) {
      suggestions = result;
    });
    if (suggestions.length > 0) {
      this.suggestion = this.mealFood.name + suggestions[0].substr(this.mealFood.name.length);
      this.dropdownOpen = true;
    } else {
      this.suggestion = null;
      this.dropdownOpen = false;
    }
    this.suggestions = suggestions;
  }

  selectFirstSuggestion() {
    if (this.suggestions.length > 0) {
      this.selectSuggestion(this.suggestions[0]);
    }
  }

  selectSuggestion(suggestion) {
    this.mealFood.name = suggestion;
    this.mealFood.foodId = this._autocompleteService.getFoodIdByName(suggestion);
    this.suggestion = null;
    this.dropdownOpen = false;
  }

  private eventTriggeredOutsideHost(event) {
    let element = event.target;
    do {
      if (element === this._eref.nativeElement) {
        return false;
      }
      element = element.parentNode;
    } while(element);

    return true;
  }

  private onClick(event) {
    if (this.eventTriggeredOutsideHost(event)) {
      this.dropdownOpen = false;
    }
  }
}