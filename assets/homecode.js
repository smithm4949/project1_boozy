$('#getStarted').click(getStarted);
$('#addButton').click(handleAddButtonClick);
$('#clearList').click(clearList);
$('.logo').click(goHomePg);

const params = new URLSearchParams(location.search);
//access with params.get("param")

mainDrinks = []
storedDrinks2plus = []

function goHomePg () {
    localStorage.clear();
    $("#ingredientList").empty();
    $("#drinkList").empty();
    $('#clearAndIngList').attr("style", "display:none");
    $('#pickDrink').attr("style", "display:none");
    $('#ingredientSection').attr("style", "display:none");
    $('#introCard').attr("style", "display:block");
    mainDrinks.length = 0
    storedDrinks2plus.length = 0
  }

function clearList() {
    localStorage.clear();
    localStorage.setItem("GetStarted", JSON.stringify("Get Started was clicked."));
    $("#ingredientList").empty();
    $("#drinkList").empty();
    mainDrinks.length = 0;
    storedDrinks2plus.length = 0;
    params.delete("ingredients");
    location.search = `?${params.toString()}`;
}

// when exMark class button is clicked, run this function to delete the ingredient from the url string
function deleteIng(e) {
    if (!e.target.classList.contains("exMark")) return;
    //get localstorage ing array, remove ingredient, save to localstorage, refresh page with new params
    let ingredientsArray = JSON.parse(localStorage.getItem("Ingredients")) || [];
    let ingredientIndex = ingredientsArray.indexOf(e.target.parentElement.textContent);
    ingredientsArray.splice(ingredientIndex, 1);
    localStorage.setItem("Ingredients", JSON.stringify(ingredientsArray));
    location.search = `?ingredients=${ingredientsArray.toString()}`;
}

function getStarted() {
    $('#introCard').attr("style", "display:none");
    $('#ingredientSection').attr("style", "display:block");
    localStorage.clear();
    localStorage.setItem("GetStarted", JSON.stringify("Get Started was clicked."));
    fetchJoke();
};

function handleAddButtonClick() {
    displayIngredient($('#userInputIng').val());
}

$('#userInputIng').keydown(function (e) { 
    if(e.keyCode === 13){
        displayIngredient($('#userInputIng').val());
    };
});


function displayIngredient(ingredient) {
    $('#clearAndIngList').attr("style", "display:block");
    $('#pickDrink').attr("style", "display:block");

    if (ingredient === "") {
        return;
    }
    let fetchSuccess = true;
    fetchIngredients(ingredient)
    .catch((error) => {
        console.log("Hit Catch block on try/catch for fetchingrtedients");
        console.log(error);
        fetchSuccess = false;
    })
    .finally(() => {
        if (fetchSuccess) {
            makeIngredientButton(ingredient);
            saveIngredient(ingredient);
        }
        $('#userInputIng').val("");
    })
};


function fetchJoke(){
    fetch("https://v2.jokeapi.dev/joke/Miscellaneous,Pun,Spooky,Christmas?blacklistFlags=racist,sexist,explicit&type=single")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            $('#joke').text(data.joke);
        });
};

function fetchIngredients(ingredient) {
    var appUrl = ("https://www.thecocktaildb.com/api/json/v1/1/filter.php?i="+ingredient)
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
                displayImg();
                
                function displayImg () {
                    $.each(firstIngredientFilter, function (index, value){
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
                                storedDrinks2plus.length =0
                                storedDrinks2plus = storedDrinks2plus.concat(mainDrinks)
                                mainDrinks.length = 0
                            for (i=0; i < value.length; i++) {
                                var drinkNameApi = value[i].strDrink;
                                if(storedDrinks2plus.includes(drinkNameApi)){
                                    mainDrinks.push(drinkNameApi)
                                }
                            }
                            for (i=0; i < mainDrinks.length; i++){
                                makeAndAddButtonToGrid(mainDrinks[i]);
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

function makeIngredientButton(ingredient) {
    //var userInputIngEl = $('#userInputIng').val();
    let currIngArray = JSON.parse(localStorage.getItem("Ingredients")) || [];
    if (currIngArray.includes(ingredient)) return;
    var ingredientListEl = $("#ingredientList");
    var newIngBtn = $('<button class="ingredient button is-success is-medium"></button>');
    newIngBtn.html('<span class="tag is-success">' + ingredient + '<button class="exMark delete is-small"></button></span>');
    newIngBtn.val(ingredient);
    newIngBtn.click(deleteIng);
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

function saveIngredient(ingredient) {
    var oldItems = JSON.parse(localStorage.getItem("Ingredients")) || [];
    var newItem = ingredient.toLowerCase();
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
    if(localStorage.length === 0) {
        goHomePg ();
    } else {
        let searchParams = new URLSearchParams(decodeURIComponent(location.search));
        getStarted();
        if (searchParams.get("ingredients")) {
            let paramsArray = searchParams.get("ingredients").split(",");
            paramsArray.forEach((ingredient) => {
                //$('#userInputIng').val(ingredient);
                displayIngredient(ingredient.trim().toLowerCase());
            })
        }
    }

};