import {Adapter} from "./adapter";
import {Injectable} from "angular2/core";
import {Http} from "angular2/http";
import 'rxjs/add/operator/toPromise';

@Injectable()
export class Firebase implements Adapter {
  constructor(private http: Http) {}

  getFood(id:number) {
    return this.http.get('https://nutrient.firebaseio.com/foods/' + id + '.json')
      .toPromise().then(response => response.json());
  }

  getAllFoods() {
    return this.http.get('https://nutrient.firebaseio.com/foods.json')
      .toPromise().then(response => response.json());
  }

  getFoods(ids:Array<number>) {
    let foods = [];
    let promises = [];
    for (let id of ids) {
      promises.push(
        this.getFood(id).then(food => foods[id] = food)
      );
    }
    return Promise.all(promises).then(() => foods);
  }

  getMeal(id:number) {
    return this.http.get('https://nutrient.firebaseio.com/meals/' + id + '.json')
      .toPromise().then(response => response.json());
  }

  getNutrients() {
    return this.http.get('https://nutrient.firebaseio.com/nutrients.json')
      .toPromise().then(response => response.json());
  }

  getRecommendations(id:string) {
    return this.http.get('https://nutrient.firebaseio.com/recommendations/' + id + '.json')
      .toPromise().then(response => response.json());
  }

  addMealFood(mealId:number, foodId:string, foodAmount:number) {
    this.http.post(
      'https://nutrient.firebaseio.com/meals/' + mealId + '/foods.json',
      JSON.stringify({foodId: foodId, amount: foodAmount})
    ).toPromise().then(response => {
      // console.log(response);
    });
  }

  updateMealFood(mealId:number, mealFoodId:string, foodAmount:number) {
    this.http.patch(
      'https://nutrient.firebaseio.com/meals/' + mealId + '/foods/' + mealFoodId + '.json',
      JSON.stringify({amount: foodAmount})
    ).toPromise().then(response => {
      // console.log(response);
    });
  }
  
  removeMealFood(mealId:number, mealFoodId:string) {
    this.http.delete(
      'https://nutrient.firebaseio.com/meals/' + mealId + '/foods/' + mealFoodId + '.json'
    ).toPromise().then(response => {
        // console.log(response)
    });
  }
}