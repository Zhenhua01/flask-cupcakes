"use strict";

const BASE_URL = "/api/cupcakes"

const $cupcakes = $(".cupcakes");
const $form = $("#cupcake-form");

let cupcakesList;

/** Sends GET request for list of cupcakes and returns an array of Cupcake instances. */
async function getCupcakesList() {
    const response = await axios({
        url: BASE_URL,
        method: "GET"
    })

    const cupcakes = await response.data.cupcakes.map(c => new Cupcake(c));

    return cupcakes;
}

/** Shows cupcake list; called on page load. */
async function showCupcakesList() {
    cupcakesList = await getCupcakesList();

    putListOnPage();
}

/** Generates HTML for each Cupcake instance. */
function generateListMarkup(cupcake) {

    return $(`
      <li id="${cupcake.flavor}">
        <img src="${cupcake.image}" width="100px">
        Size: ${cupcake.size},
        Flavor: ${cupcake.flavor},
        Rating: ${cupcake.rating}
        </li>
    `);
}

/** Appends Cupcake instance markup to DOM. */
function putListOnPage() {

    for (let cupcake of cupcakesList) {
        const $cupcake = generateListMarkup(cupcake);
        $cupcakes.append($cupcake);
    }

}

/** Appends new Cupcake instance to DOM. */
async function addNewCupcake(evt) {

    evt.preventDefault();

    const $flavor = $("#flavor").val()
    const $size = $("#size").val()
    const $rating = $("#rating").val()
    const $image = $("#image-url").val()

    const newFormVals = {
        "flavor": $flavor,
        "size": $size,
        "rating": $rating,
        "image": $image
    }

    const newCupcake = await addCupcake(newFormVals);

    const $cupcake = generateListMarkup(newCupcake);
    $cupcakes.append($cupcake);
}

/** Submits POST request to server with new cupcake values.
 * Returns new Cupcake instance. */
async function addCupcake(newFormVals) {

    const response = await axios({
        url: BASE_URL, 
        method: "POST",
        data: newFormVals});

    return new Cupcake(response.data.cupcake);

}

showCupcakesList();
$form.on("submit", addNewCupcake);