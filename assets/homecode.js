$('#getStarted').click(getStarted);
$('#addButton').click(displayIngredient);
$('#clearList').click(clearList);

const params = new URLSearchParams(location.search);
//access with params.get("param")

mainDrinks = []
storedDrinks3more = []

function clearList() {
    localStorage.clear();
    $("#ingredientList").empty();
    $("#drinkList").empty();
    mainDrinks.length = 0;
    storedDrinks3more.length = 0;
    params.delete("ingredients");
    location.search = `?${params.toString()}`;
}

function getStarted() {
    console.log("I Work");
    $('#ingredientSection').attr("style", "display:block");
    $('#introCard').attr("style", "display:none");
    localStorage.clear();
    fetchJoke();
};

$('#userInputIng').keydown(function (e) { 
    if(e.keyCode === 13){
        displayIngredient()
    };
});


function displayIngredient() {
    if ($('#userInputIng').val() === "") {
        return;
    }
    let fetchSuccess = true;
    fetchIngredients()
    .catch((error) => {
        console.log("Hit Catch block on try/catch for fetchingrtedients");
        console.log(error);
        fetchSuccess = false;
    })
    .finally(() => {
        if (fetchSuccess) {
            makeIngredientButton();
            saveIngredient();
        }
        $('#userInputIng').val("");
    })

// !Nice to have - ability to remove an ingredient by clicking on the button

};

function fetchJoke(){
    fetch("https://v2.jokeapi.dev/joke/Programming?type=single")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data.joke)
            $('#joke').text(data.joke);
        });
};

function fetchIngredients() {
    var userInputIngEl = $('#userInputIng').val();
    console.log(userInputIngEl);
    var appUrl = ("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i="+userInputIngEl)
    return fetch(appUrl)
            .then(function (response) {
                return response.json();
            })
            .catch((error) => {
                console.log(error);
                throw error;
            })
            .then(function (data) {
                var firstIngredientFilter = data;
                console.log(firstIngredientFilter);
                displayImg();
                
                function displayImg () {
                    $.each(firstIngredientFilter, function (index, value){
                        console.log(mainDrinks)
                        console.log(index);
                        console.log(value);
                        if(value.length===0){
                            $("#ingredientList").empty();
                            return
                        }else if(mainDrinks.length===0){
                            for (i = 0; i < value.length; i++) {
                                var drinkNameApi = value[i].strDrink;
                                mainDrinks.push(drinkNameApi)
                                makeAndAddButtonToGrid(drinkNameApi);
                            }
                        }
                        else{
                                $("#drinkList").empty();
                                storedDrinks3more.length =0
                                storedDrinks3more = storedDrinks3more.concat(mainDrinks)
                                mainDrinks.length = 0
                                console.log(mainDrinks)
                                console.log(storedDrinks3more)
                            for (i=0; i < value.length; i++) {
                                var drinkNameApi = value[i].strDrink;
                                if(storedDrinks3more.includes(drinkNameApi)){
                                    mainDrinks.push(drinkNameApi)
                                }
                            }
                            for (i=0; i < mainDrinks.length; i++){
                                makeAndAddButtonToGrid(mainDrinks[i]);
                                console.log(mainDrinks)
                            }
                        }
                    })

                    
                };
            });
};

function loadDrinkDetailPageWithParams(e) {
    let urlPath = "./pages/drinkdetail.html?drink="+e.target.innerHTML+"&"
    urlPath += getIngredientsForParam();
    window.location.assign(urlPath);
}

function makeIngredientButton() {
    var userInputIngEl = $('#userInputIng').val();
    var ingredientListEl = $("#ingredientList");
    var newIngBtn = $('<li class="item button is-success"><span class="icon is-small"><i class="fas fa-check"></i></span></li>');
    newIngBtn.text(userInputIngEl);
    newIngBtn.val(userInputIngEl);
    newIngBtn.appendTo(ingredientListEl);
}

function makeAndAddButtonToGrid(btnText) {
    var newDrinkThumb = $('<button class="drinkName column"></button>').text(btnText);
    newDrinkThumb.appendTo($("#drinkList"));
    newDrinkThumb.click(loadDrinkDetailPageWithParams);
}

function getIngredientsForParam() {
    let paramString = "ingredients="
    let localIngredients = JSON.parse(localStorage.getItem("Ingredients")) || [];
    if (localIngredients.length === 1) {
        paramString += localIngredients[0];
    } else if (localIngredients.length > 1) {
        localIngredients.forEach(ingredient => {
            paramString += `${ingredient},`
        });
        paramString = paramString.slice(0,-1);
    }
    return paramString;
}

function saveIngredient() {
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

//check for search params on load; if there, check for ingredients
//if ingredients, seperate by comma, then run method to imitate searching them
onload = () => {
    let searchParams = new URLSearchParams(location.search);
    getStarted();
    if (searchParams.get("ingredients")) {
        let paramsArray = searchParams.get("ingredients").split(",");
        console.log(paramsArray)
        paramsArray.forEach((ingredient) => {
            $('#userInputIng').val(ingredient);
            displayIngredient(ingredient);
        })
    }
};