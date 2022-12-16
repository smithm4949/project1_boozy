$('#getStarted').click(function (e) {
    e.preventDefault();
    console.log("I Work");
    $('#ingredientSection').attr("style", "display:block");
    $('#introCard').attr("style", "display:none");
    localStorage.clear();
});

$('#addButton').click(function (e) {
    e.preventDefault();
    displayIngredient();
});

$('#clearList').click(function (e) {
    e.preventDefault();
    localStorage.clear();
    $("#ingredientList").empty();
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
// !Nice to have - ability to remove an ingredient by clicking on the button

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
                        var drinkNameApi = value[i].strDrink;
                        console.log(drinkNameApi);
                        var newDrinkThumb = $('<button class="drinkName column"></button>').text(drinkNameApi);
                        newDrinkThumb.appendTo($("#drinkList"));
                        //saveFirstList(); <---In limbo
                    
                    // TODO - 

                    /*
                        !TO DO - Another fetch to get cocktail details by id (when a user clicks
                        on one of the images and names of the drinks, the app will show the user
                        the details from the api
                    */
                    };
                });
            };
        });
};

function saveIngredient (){
    var oldItems = JSON.parse(localStorage.getItem("Ingredients")) || [];
    var newItem = $('#userInputIng').val().toLowerCase();
    // Use the running list object and add on new items to the old items
    oldItems.push(newItem);

    // Remove duplicates 
    var uniqueItems = [...new Set(oldItems)];
    // Store the unique items - no duplicates
    localStorage.setItem("Ingredients", JSON.stringify(uniqueItems));  
    $('#userInputIng').val("");   
};

/* LIMBO

IF you want to store the search results for first ingredient
function saveFirstList (){
    var oldItems = JSON.parse(localStorage.getItem("First-List")) || [];
    var newItem = drinkNameApi;
    // Use the running list object and add on new items to the old items
    oldItems.push(newItem);

    // Remove duplicates 
    var uniqueItems = [...new Set(oldItems)];
    // Store the unique items - no duplicates
    localStorage.setItem("First-List", JSON.stringify(uniqueItems));  
};

*/