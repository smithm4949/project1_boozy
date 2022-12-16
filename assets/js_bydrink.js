var ingredientDisplayEl = document.getElementById("ingredientDisplay")
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
        ingredientDisplayEl.textContent=""
        return response.json();
        })
        .then(function (data){
        //console log drink data
         console.log(data)
         
        // Extract values from data.drinks[0] object and store in array
        const values = Object.entries(data.drinks[0]);
        // Create new array of ingredient names and measurements
        const ingredients = values
            .filter(arr => arr[0].includes('strIngredient'))
            .map(arr => arr[1]);
        console.log(ingredients);
        const quantities = values 
            .filter(arr => arr[0].includes('strMeasure'))
            .map(arr => arr[1]);
        console.log(quantities)
        //If no quantities/measurements listed in object, kill everything and notify user
        if(quantities[0]==null){
            var newDrinkEl = document.createElement("h4")
            newDrinkEl.textContent="Drink not available. :( Please try another."
            ingredientDisplayEl.append(newDrinkEl)
            return
         }
        // Create new array of measurement values with name (ie "shot") removed
        // Convert the string value to a number
        // multiply the number by the conversion of that measurement to grams
        const quantityValues = []
        const quantityGrams = []


        //check for "/" or "-" and conver to decimal
        for (var i = 0; i < quantities.length; i++) {
            var loopCheckDivide = quantities[i];
            if (loopCheckDivide) {
              // Check if the string contains letters and a "/" or "-" character
              if (/[a-z]/i.test(loopCheckDivide) && /[\/-]/.test(loopCheckDivide)) {
                var regex1 = /(\d+)?\s*(\d+\/\d+)/;
                var regex2 = /(\d+)?\s*(\d+\-\d+)/;
                if (loopCheckDivide.match(regex1)) {
                  quantities[i] = loopCheckDivide.replace(regex1, (match, p1, p2) => {
                    const [numerator, denominator] = p2.split("/");
                    const decimal = numerator / denominator;
                    const rounded = decimal.toFixed(2);
                    return p1 ? `${p1} ${rounded}` : `${rounded}`;
                  });
                } else if (loopCheckDivide.match(regex2)) {
                  quantities[i] = loopCheckDivide.replace(regex2, (match, p1, p2) => {
                    const [numerator, denominator] = p2.split("-");
                    const decimal = numerator / denominator;
                    const rounded = decimal.toFixed(2);
                    return p1 ? `${p1} ${rounded}` : `${rounded}`;
                  });
                }
              }
            }
          }
          
        //If "/" is in there without the word "part", convert to decimal and add the word "part"
        
        for (var i = 0; i < quantities.length; i++) {
        var loopCheckPart = quantities[i];
        if (loopCheckPart && loopCheckPart.includes("/")) {
            // Divide the number to the left of the "/" by the number to the right
            // and round the result to two decimal places using the toFixed() method
            var part = loopCheckPart.replace(/(\d+)\/(\d+)/, (match, p1, p2) => {
            return (p1 / p2).toFixed(2);
            });
            // Add the string "part" to the end of the number after converted
            part = parseFloat(part)
            var partWithText = part + " part";
            quantities[i] = partWithText;
            console.log(quantities[i])
        }
        }
        console.log(quantities);
        var partTotal = 0;
        console.log(partTotal)
        //Get total number of "parts"
        for (var i=0; i < quantities.length; i++){
            var loopCheckPart = quantities[i]
            if (loopCheckPart && loopCheckPart.includes("part")){
                var part = parseFloat(quantities[i])
                partTotal += part
                }              
            }        
            console.log(quantities)
            console.log(partTotal)

        for (var i=0; i < quantities.length; i++){
            const loopQuan = quantities[i]
            if (loopQuan && loopQuan.includes("shots")){
                quantityValues[i] = loopQuan.replace("shots","")
                quantityValues[i] = parseFloat(quantityValues[i])
                quantityGrams[i] = 42.5243*quantityValues[i]
            } else if (loopQuan && loopQuan.includes("shot")){
                quantityValues[i] = loopQuan.replace("shot","")
                quantityValues[i] = parseFloat(quantityValues[i])
                quantityGrams[i] = 42.5243*quantityValues[i]
            } else if (loopQuan && loopQuan.includes("oz")){
                var regex = /[+-]?\d+(?:\.\d+)?/g;
                quantityValues[i] = loopQuan.replace("oz","")
                quantityValues[i] = regex.exec(quantityValues[i])
                quantityValues[i] = parseFloat(quantityValues[i])
                console.log(quantityValues[i])
                quantityGrams[i] = 28.3495*quantityValues[i]
            } else if (loopQuan && loopQuan.includes("tsp")){
                quantityValues[i] = loopQuan.replace("tsp","")
                quantityValues[i] = parseFloat(quantityValues[i])
                quantityGrams[i] = 4.92892 *quantityValues[i]
            } else if (loopQuan && loopQuan.includes("bottle")){
                quantityValues[i] = loopQuan.replace("bottle","")
                quantityValues[i] = parseFloat(quantityValues[i])
                quantityGrams[i] = 1814.37 *quantityValues[i]
            } else if (loopQuan && loopQuan.includes("gr")){
                quantityValues[i] = loopQuan.replace("gr","")
                quantityValues[i] = parseFloat(quantityValues[i])
                quantityGrams[i] = 1 *quantityValues[i]
            } else if (loopQuan && loopQuan.includes("ml pure")){
                quantityValues[i] = loopQuan.replace("ml pure","")
                quantityValues[i] = parseFloat(quantityValues[i])
                quantityGrams[i] = 1 *quantityValues[i]
            } else if (loopQuan && loopQuan.includes("tblsp")){
                quantityValues[i] = loopQuan.replace("tblsp","")
                quantityValues[i] = parseFloat(quantityValues[i])
                quantityGrams[i] = 14.79 *quantityValues[i]
            } else if (loopQuan && loopQuan.includes("pint")){
                quantityValues[i] = loopQuan.replace("pint","")
                quantityValues[i] = parseFloat(quantityValues[i])
                quantityGrams[i] = 400 *quantityValues[i]
            } else if (loopQuan && loopQuan.includes("fifth")){
                quantityValues[i] = loopQuan.replace("fifth","")
                quantityValues[i] = parseFloat(quantityValues[i])
                quantityGrams[i] = 750 *quantityValues[i]
            } else if (loopQuan && loopQuan.includes("qt")){
                quantityValues[i] = loopQuan.replace("qt","")
                quantityValues[i] = parseFloat(quantityValues[i])
                quantityGrams[i] = 946.352946 *quantityValues[i]
            } else if (loopQuan && loopQuan.includes("tsp")){
                quantityValues[i] = loopQuan.replace("tsp","")
                quantityValues[i] = parseFloat(quantityValues[i])
                quantityGrams[i] = 4.92892  *quantityValues[i]
            } else if (loopQuan && loopQuan.includes("can")){
                quantityValues[i] = loopQuan.replace("can","")
                quantityValues[i] = parseFloat(quantityValues[i])
                quantityGrams[i] = 340.194 *quantityValues[i]
            } else if (loopQuan && loopQuan.includes("gal")){
                quantityValues[i] = loopQuan.replace("gal","")
                quantityValues[i] = parseFloat(quantityValues[i])
                quantityGrams[i] = 3,785.41 *quantityValues[i]
            } else if (loopQuan && loopQuan.includes("cl")){
                quantityValues[i] = loopQuan.replace("cl","")
                quantityValues[i] = parseFloat(quantityValues[i])
                quantityGrams[i] = 10 *quantityValues[i]
            } else if (loopQuan && loopQuan.includes("ml")){
                quantityValues[i] = loopQuan.replace("ml","")
                quantityValues[i] = parseFloat(quantityValues[i])
                quantityGrams[i] = 1 *quantityValues[i]
            } else if (loopQuan && loopQuan.includes("splash")){
                quantityValues[i] = loopQuan.replace("splash","")
                quantityValues[i] = parseFloat(quantityValues[i])
                quantityGrams[i] = 2.46446 *quantityValues[i]
            } else if (loopQuan && loopQuan.includes("dash")){
                quantityValues[i] = loopQuan.replace("dash","")
                quantityValues[i] = parseFloat(quantityValues[i])
                quantityGrams[i] = 0.98578 *quantityValues[i]
            } else if (loopQuan && loopQuan.includes("wedge")){
                quantityValues[i] = loopQuan.replace("wedge","")
                quantityValues[i] = parseFloat(quantityValues[i])
                quantityGrams[i] = 37.70487 *quantityValues[i]
            } else if (loopQuan && loopQuan.includes(" L")){
                quantityValues[i] = loopQuan.replace(" L","")
                quantityValues[i] = parseFloat(quantityValues[i])
                quantityGrams[i] = 1000 *quantityValues[i]
            } else if (loopQuan && loopQuan.includes("part")){
                quantityValues[i] = loopQuan.replace("part","")
                quantityValues[i] = parseFloat(quantityValues[i])
                quantityGrams[i] = 49.61167 *quantityValues[i]
                console.log(quantityValues[i])
            }else if (loopQuan && !/^\d+$/.test(loopQuan)) {
                console.log(quantityValues[i])
                quantityValues[i] = loopQuan
                quantityValues[i] = parseFloat(quantityValues[i])
                quantityGrams[i] = 100 *quantityValues[i]
            } 
        }
        
        console.log(quantityValues)
        console.log(quantityGrams)
        const calorieValues = []
        const requests = [];

    for (const ingredient of ingredients) {
    if (ingredient) {
        const query = ingredient;

        requests.push($.ajax({
        method: 'GET',
        url: 'https://api.calorieninjas.com/v1/nutrition?query=' + query,
        headers: { 'X-Api-Key': 'smrhc2mwaSeN2biihJn/rA==NcTaGc1ICaRSXdSA'},
        contentType: 'application/json',
        }));
        console.log(ingredient)
    }
    }

    // Wait for all of the requests to complete
    $.when(...requests).then(function(...results) {
    // Process the results
    for (const result of results) {
        // Push the calorie value from the result to the calorieValues array
        if(result && result[0] && result[0].items && result[0].items[0]){
            calorieValues.push(result[0].items[0].calories)
        }
        }
        console.log(results)
        var caloriesArray = []
        var caloriesTotal = 0
        for(i=0;i<quantities.length;i++){
            if(quantities[0]==null){
                var newDrinkEl = document.createElement("h4")
                newDrinkEl.textContent="Drink not available. :( Please try another."
                ingredientDisplayEl.append(newDrinkEl)
            return
            }else{
                caloriesTotal += quantityGrams[i]/100*calorieValues[i]
                caloriesArray.push(caloriesTotal)
            }
        }

        var newDrinkEl2 = document.createElement("h2")
                newDrinkEl2.textContent=drinkSearch
                ingredientDisplayEl.append(newDrinkEl2)

        for(i=0;i<ingredients.length;i++){
            if(ingredients[i]!==null){
                var newDrinkEl = document.createElement("h4")
                newDrinkEl.textContent=ingredients[i] + ":    " + quantities[i]
                ingredientDisplayEl.append(newDrinkEl)
            }
        }

        // var caloriesEl = document.createElement("h2")
        // var roundedCalories=totalCalories.toFixed(2)
        // var roundedCaloriesDisplay=parseFloat(roundedCalories)
        // console.log(totalCalories)
        // caloriesEl.textContent=roundedCaloriesDisplay + " CALORIES"
        // ingredientDisplayEl.append(caloriesEl)
        console.log(caloriesArray)
        var maxValue = caloriesArray.reduce((max,value) => (isNaN(value) ? max:
        Math.max(max,value)), Number.NEGATIVE_INFINITY);
        maxValue = maxValue.toFixed(2)
        console.log(maxValue)
        var caloriesEl = document.createElement("h2")
        caloriesEl.textContent=maxValue + " CALORIES"
        ingredientDisplayEl.append(caloriesEl)
        console.log(caloriesArray)    


    });
       

    })
})
