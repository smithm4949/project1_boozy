// fetch ("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Vodka")
// 	.then(function (response){
// 		return response.json();
// 		})
// 	.then(function (data) {
// 		console.log(data);
// 		});


//https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list      returns list of ingredients, **capped at 100 unpaid**
//www.thecocktaildb.com/api/json/v1/1/filter.php?i=Vodka          search by ingredient, returns drinks, likely capped at 100.

var ingredient1
var ingredient2
var ingredient3
var ingredient4
var ingredient5
var ingredient6
var ingredient7
var ingredient8
var ingredient9
var ingredient10
var ingredient11
var ingredient12
var ingredient13
var ingredient14
var ingredient15
var ingredients = []
var ingredientDisplayEl = document.getElementById("ingredientDisplay")

var measure1
var measure2
var measure3
var measure4
var measure5
var measure6
var measure7
var measure8
var measure9
var measure10
var measure11
var measure12
var measure13
var measure14
var measure15
var measures = []
var ingredientGrams =[]
var measureGramsArray = []
var drinkCaloriesTotal = 0
var percentCalories
var calories = 0
var measureShots = 0
var query

// hits search button if "enter" is clicked while in the input field
document.getElementById("input")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("button").click();
    }
    });
   
    var BTN = document.getElementById("button")
    var ingredientSearching = BTN.addEventListener("click", function (event) {
    event.preventDefault();
    var drinkSearch = document.getElementById("input").value
    document.getElementById("input").value=""
    console.log(drinkSearch)

    //get ingredients and quantities
    fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s="+drinkSearch)
    .then(function (response){
            drinkCaloriesTotal = 0
            ingredientDisplayEl.textContent=""
            return response.json();
            })
            .then(function (data){
            //console log drink data
             console.log(data)
             for (i=1;i<15;i++){
                ingredients[i] = ""
                measures[i] = ""
                measureGramsArray[i]= ""
             }
             //Maximum ingredients is 15, create an array with the ingredients and measurements
            ingredients[0] = data.drinks[0].strIngredient1
            ingredients[1] = data.drinks[0].strIngredient2
            ingredients[2] = data.drinks[0].strIngredient3
            ingredients[3] = data.drinks[0].strIngredient4
            ingredients[4] = data.drinks[0].strIngredient5
            ingredients[5] = data.drinks[0].strIngredient6
            ingredients[6] = data.drinks[0].strIngredient7
            ingredients[7] = data.drinks[0].strIngredient8
            ingredients[8] = data.drinks[0].strIngredient9
            ingredients[9] = data.drinks[0].strIngredient10
            ingredients[10] = data.drinks[0].strIngredient11
            ingredients[11] = data.drinks[0].strIngredient12
            ingredients[12] = data.drinks[0].strIngredient13
            ingredients[13] = data.drinks[0].strIngredient14
            ingredients[14] = data.drinks[0].strIngredient15

            measures[0] = data.drinks[0].strMeasure1
            measures[1] = data.drinks[0].strMeasure2
            measures[2] = data.drinks[0].strMeasure3
            measures[3] = data.drinks[0].strMeasure4
            measures[4] = data.drinks[0].strMeasure5
            measures[5] = data.drinks[0].strMeasure6
            measures[6] = data.drinks[0].strMeasure7
            measures[7] = data.drinks[0].strMeasure8
            measures[8] = data.drinks[0].strMeasure9
            measures[9] = data.drinks[0].strMeasure10
            measures[10] = data.drinks[0].strMeasure11
            measures[11] = data.drinks[0].strMeasure12
            measures[12] = data.drinks[0].strMeasure13
            measures[13] = data.drinks[0].strMeasure14
            measures[14] = data.drinks[0].strMeasure15
            console.log(ingredients)
            console.log(measures)
            //if measurements don't exist, say drink is unavailable, otherwise append the text with ingredient + measurement
                if(measures[0]==null){
                    var newDrinkEl = document.createElement("h4")
                        newDrinkEl.textContent="Drink not available. :( Please try another."
                        ingredientDisplayEl.append(newDrinkEl)
                    return
                }else{
                    for(i=0;i<ingredients.length;i++){
                        if(ingredients[i]!==null){
                            var newDrinkEl = document.createElement("h4")
                            newDrinkEl.textContent=ingredients[i] + ":    " + measures[i] 
                            ingredientDisplayEl.append(newDrinkEl)

                            //notes:
                            //get calories
                            //1 shot = 1.5oz = 42.52 grams
                            //1oz = 28.35 grams

                            //if measurements contains words, remove to get quantity as a number and convert to grams
                            if(measures[i]=measures[i].replace("shots","")){
                                var measureShots = Number(measures[i])
                                var measureGrams = measureShots*42.5243
                                console.log(measureGrams)
                            } if(measures[i]=measures[i].replace("shot","")){
                                var measureShots = Number(measures[i])
                                var measureGrams = measureShots*42.5243
                                console.log(measureGrams)
                            } if(measures[i].includes("oz")){
                                console.log(measures[i])
                                var regex = /[+-]?\d+(?:\.\d+)?/g;
                                var measureNumber = regex.exec(measures[i])
                                console.log(measures[i])
                                console.log(measureNumber[0])
                                var measureGrams = measureNumber[0]*28.3
                            }
                                measureGramsArray[i]=measureGrams
                                console.log(measureGramsArray)
                                var query = ingredients[i]
                                var newMeasureGrams = measureGrams
                                console.log(query)
                                $.ajax({
                                    method: 'GET',
                                    url: 'https://api.calorieninjas.com/v1/nutrition?query=' + query,
                                    headers: { 'X-Api-Key': 'smrhc2mwaSeN2biihJn/rA==NcTaGc1ICaRSXdSA'},
                                    contentType: 'application/json',
                                    }).then(function(result) {
                                        console.log(result);
                                        console.log(newMeasureGrams)
                                        percentCalories = measureGrams/result.items[0].serving_size_g
                                        calories = percentCalories * result.items[0].calories
                                        drinkCaloriesTotal = drinkCaloriesTotal+calories
                                        console.log(percentCalories)
                                        console.log(calories)
                                        console.log(drinkCaloriesTotal)
                                        
                                        },function(error){
                                            console.error('Error: ', jqXHR.responseText);
                                    })
                        }
                    
                    }
                }

        function postCalories(){
            var caloriesEl = document.createElement("h2")
            var roundedCalories=drinkCaloriesTotal.toFixed(2)
            var roundedCaloriesDisplay=parseFloat(roundedCalories)
            caloriesEl.textContent=roundedCaloriesDisplay + " CALORIES"
            ingredientDisplayEl.append(caloriesEl)
            console.log(calories)    
        }
        setTimeout(postCalories, 2500)

    })
})
    


