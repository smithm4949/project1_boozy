$('#getStarted').click(getStarted);
$('#addButton').click(displayIngredient);
$('#clearList').click(clearList);

const params = new URLSearchParams(location.search);
//access with params.get("param")

function clearList() {
    localStorage.clear();
    $("#ingredientList").empty();
    $("#drinkList").empty();
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


async function displayIngredient() {
    if ($('#userInputIng').val() === "") {
        return;
    }
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
                    for (i = 0; i < value.length; i++) {
                        var drinkNameApi = value[i].strDrink;
                        var newDrinkThumb = $('<button class="drinkName column"></button>').text(drinkNameApi);
                        newDrinkThumb.appendTo($("#drinkList"));

                        newDrinkThumb.click(function (e) { 
                            console.log(e.target.innerHTML)
                            e.preventDefault();
                            var urlPath = "./pages/drinkdetail.html?drink="+e.target.innerHTML+"&"
                            urlPath += getIngredientsForParam();
                            window.location.assign(urlPath)
                        });

                        saveDrinkList(); 
                        function saveDrinkList (){
                            var newItem = drinkNameApi;
                            var oldItems = JSON.parse(localStorage.getItem("Drink-List")) || [];
                            oldItems.push(newItem);
                            localStorage.setItem("Drink-List", JSON.stringify(oldItems)); 
                            
                            var duplicateDrinks = oldItems.filter((a, i, aa) => aa.indexOf(a) === i && aa.lastIndexOf(a) !== i); //See credits in README for this line of code
                            console.log(duplicateDrinks) // shows only drinks that duplicated with search filters
                            localStorage.setItem("Duplicate-List", JSON.stringify(duplicateDrinks)); 
                        }
                    };
                });
            };
        });
};


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

onload = () => {
    if (location.search != '') {
        getStarted();
        clearList();
        $('#userInputIng').val(params.get("ingredients"));
        displayIngredient();
    }
};