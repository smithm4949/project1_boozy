$('#getStarted').click(function (e) {
    e.preventDefault();
    console.log("I Work");
    $('#ingredientSection').attr("style", "display:block");
    $('#introCard').attr("style", "display:none");
    localStorage.clear();
});

$('#goButton').click(function (e) {
    e.preventDefault();
    displayIngredient();
});

$('#clearList').click(function (e) {
    e.preventDefault();
    localStorage.clear();
});


function displayIngredient() {
        var userInputIngEl = $('#userInputIng').val();
        var ingredientListEl = $("#ingredientList");
        var newIngBtn = $('<li class="item button is-success"><span class="icon is-small"><i class="fas fa-check"></i></span></li>');
        newIngBtn.appendTo(ingredientListEl);
        newIngBtn.text(userInputIngEl);
        newIngBtn.val(userInputIngEl);

        fetchIngredients();
        saveIngredient();

// !TO DO - Look up method to remove the duplicate ingredient buttons
};

function fetchIngredients () {
    var userInputIngEl = $('#userInputIng').val();
    console.log(userInputIngEl);
    var appUrl = ("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i="+userInputIngEl)

    fetch(appUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var firstIngredientFilter = data;
            console.log(firstIngredientFilter);
            // Put the displayImg function here
            displayImg();
            
            function displayImg () {
                $.each(firstIngredientFilter, function (index, value){
                    console.log(index);
                    console.log(value);
                    for (i =0; i < value.length; i++) {
                        //! TODO Add an image attribute later
                        var newDrinkThumb = $('<button id="drinkName" class="column"></button>');
                        var drinkNameApi = value[i].strDrink;
                        console.log(drinkNameApi);

                        newDrinkThumb.appendTo($("#drinkList"));
                        $('#drinkName').text(drinkNameApi);

                    };
                });
  

                /* Testing why this for loop doesn't work
                // For loop to go through the object and grab each name and each image
                for (i =0; i < firstIngredientFilter.length; i++) {
                var drinkNameApi = firstIngredientFilter.drinks[0].strDrink;
                // var drinkImgApi = firstIngredientFilter.drinks[i].strDrinkThumb;
                // console.log(drinkImgApi);
            
            
                var newDrinkThumb = $('<button id="drinkName" class="column">Drink 1<figure  class="image is-128x128"><img id="drinkImg" src="https://bulma.io/images/placeholders/256x256.png"></figure></button>');
                newDrinkThumb.appendTo($("#drinkList"));
                $('#drinkName').text(drinkNameApi);

                // $('#drinkImg').val(drinkNameApi);
                };
                */

            };
        });

};

function saveIngredient (){
    var oldItems = JSON.parse(localStorage.getItem("Ingredients")) || [];
    var newItem = $('#userInputIng').val().toLowerCase();
    // Use the running list object and add on new items to the old items
    oldItems.push(newItem);

    // Remove duplicates so cities are not repeating in the buttons of previously searched cities history
    var uniqueItems = [...new Set(oldItems)];
    // Store the unique items - no duplicates
    localStorage.setItem("Ingredients", JSON.stringify(uniqueItems));  
    $('#userInputIng').val("");   
};

