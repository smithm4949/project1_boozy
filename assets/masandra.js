$('#getStarted').click(function (e) {
    e.preventDefault();
    console.log("I Work");
    $('#ingredientSection').attr("style", "display:block");
    $('#introCard').attr("style", "display:none");
});

$('#goButton').click(function (e) {
    e.preventDefault();
    fetchIngredient();
});

function fetchIngredient() {
    var userInputIngEl = $('#userInputIng').val();
    console.log(userInputIngEl);
};
