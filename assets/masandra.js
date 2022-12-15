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
        saveIngredient();
        fetchIngredients();
// !TO DO - Look up method to remove the duplicate ingredient buttons

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
};

function fetchIngredients () {
    var userInputIngEl = $('#userInputIng').val();
    var appUrl = ("http://www.thecocktaildb.com/api/json/v1/1/search.php?i="+userInputIngEl)
    // var inputUrl = appUrl.concat(userInputIngEl);

    fetch(appUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
};

