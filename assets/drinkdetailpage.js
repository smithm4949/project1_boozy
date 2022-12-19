// ISSUE: Test on Adam & Eve - Title only shows "Adam"

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const drink = params.get('drink');
var ingredientDisplayEl = document.getElementById("ingredientDisplay")
var maxValue
var drinkSearch = drink

    //get ingredients and quantities
    fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?s="+drinkSearch)
    .then(function (response){
        ingredientDisplayEl.textContent=""
        return response.json();
        })
        .then(function (data){
        //console log drink data
         console.log(data)
         var picUrl = data.drinks[0].strDrinkThumb
         $('#drinkPic').attr('src', picUrl);
         
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
                //ingredientDisplayEl.append(newDrinkEl)
            return
            }else{
                caloriesTotal += quantityGrams[i]/100*calorieValues[i]
                caloriesArray.push(caloriesTotal)
            }
        }

        // var newDrinkEl2 = document.createElement("h2")
        //         newDrinkEl2.textContent=drinkSearch
                // Replaced code for new card Bulma
                // ingredientDisplayEl.append(newDrinkEl2)
            $('#drinkTitle').text(drinkSearch) // Text for the drink name to drink title

        for(i=0;i<ingredients.length;i++){
            if(ingredients[i]!==null){
                var newDrinkEl = document.createElement("h4")
                newDrinkEl.textContent=ingredients[i] + ":    " + quantities[i]
                $('#drinkIngredients').append(newDrinkEl)
            }
        }

        console.log(caloriesArray)
        maxValue = caloriesArray.reduce((max,value) => (isNaN(value) ? max:
        Math.max(max,value)), Number.NEGATIVE_INFINITY);
        maxValue = maxValue.toFixed(2)
        console.log(maxValue)
        var caloriesEl = document.createElement("h2")
        caloriesEl.textContent=maxValue + " CALORIES"
        // ingredientDisplayEl.append(caloriesEl)
        $('#drinkCalories').append(caloriesEl)
        console.log(caloriesArray)
        getPhrase()

    });
       

    })

function getPhrase(){
    var phrase1 = {
        phrase: "You can burn this off by singing in the shower for ",
        phrase2: " minutes!",
        phrase3: " hour!",
        phrase4: " hours!",
        caloriesBurnedPer1M: 5,
    }
    var phrase2 = {
        phrase: "Listen to some dad jokes and laugh for ",
        phrase2: " minutes and you'll burn this sucker off!",
        phrase3: " hour and you'll burn this sucker off!",
        phrase4: " hours and you'll burn this sucker off!",
        caloriesBurnedPer1M: 3,
    }
    var phrase3 = {
        phrase: "Active SEX(!) will clear this out of your system in ",
        phrase2: " minutes!",
        phrase3: " hour!",
        phrase4: " hours!",
        caloriesBurnedPer1M: 6.67,
    }
    var phrase4 = {
        phrase: "Brush your teeth for ",
        phrase2: " minutes and this is out of your system!",
        phrase3: " hour and this is out of your system!",
        phrase4: " hours and this is out of your system!",
        caloriesBurnedPer1M: 3.33,
    }
    var phrase5 = {
        phrase: "If you whip your head back and forth to Willow Smith's song, you will burn this off in ",
        phrase2: " minutes...if you go crazy enough.",
        phrase3: " hour...if you go crazy enough.",
        phrase4: " hours...if you go crazy enough.",
        caloriesBurnedPer1M: 12.5,
    }
    var phrase6 = {
        phrase: "Kissing for ",
        phrase2: " minutes will burn this off, if it's intimate enough!",
        phrase3: " hour will burn this off, if it's intimate enough!",
        phrase4: " hours will burn this off, if it's intimate enough!",
        caloriesBurnedPer1M: 3
    }
    var phrase7 = {
        phrase: "Walk your dog for ",
        phrase2: " minutes and you'll have this burned off, and your dog will love you even more!",
        phrase3: " hour and you'll have this burned off, and your dog will love you even more!",
        phrase4: " hours and you'll have this burned off, and your dog will love you even more!",
        caloriesBurnedPer1M: 3.33
    }
    var phrase8 = {
        phrase: "Go horse riding for ",
        phrase2: " minutes and these calories are gone. I'm not sure if we're thinking about the same riding, though.",
        phrase3: " hour and these calories are gone. I'm not sure if we're thinking about the same riding, though.",
        phrase4: " hours and these calories are gone. I'm not sure if we're thinking about the same riding, though.",
        caloriesBurnedPer1M: 11.11,
    }
    var phrasesArray = [phrase1, phrase2, phrase3, phrase4, phrase5, phrase6, phrase7, phrase8]
    var randomIndex = Math.floor(Math.random() * phrasesArray.length);
    var phraseCals = phrasesArray[randomIndex].caloriesBurnedPer1M
    console.log(maxValue)
    maxValue = maxValue/phraseCals

    if(maxValue<60){
        maxValue = maxValue.toFixed(0)
        var phraseEl = document.createElement("p")
        phraseEl.textContent=phrasesArray[randomIndex].phrase + maxValue + phrasesArray[randomIndex].phrase2
        $('#drinkBurn').append(phraseEl)
    }else if(maxValue<90){
        maxValue = maxValue/60
        maxValue = maxValue.toFixed(0)
        var phraseEl = document.createElement("p")
        phraseEl.textContent=phrasesArray[randomIndex].phrase + maxValue + phrasesArray[randomIndex].phrase3
        $('#drinkBurn').append(phraseEl)
    }else{
        maxValue = maxValue/60
        maxValue = maxValue.toFixed(0)
        var phraseEl = document.createElement("p")
        phraseEl.textContent=phrasesArray[randomIndex].phrase + maxValue + phrasesArray[randomIndex].phrase4
        $('#drinkBurn').append(phraseEl)
    }
    

    
}