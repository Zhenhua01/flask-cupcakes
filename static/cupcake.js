"use strict";

const BASE_URL = "/api/cupcakes"

const $cupcakes = $(".cupcakes");
const $form = $("#cupcake-form");

let cupcakesList;

async function getCupcakesList(){
  const response = await axios({
    url: BASE_URL,
    method: "GET"
  })

  const cupcakes = await response.data.cupcakes.map(c => new Cupcake(c));

  return cupcakes;
}

async function showCupcakesList(){
  cupcakesList = await getCupcakesList();

  putListOnPage();
}

function generateListMarkup(cupcake){

  return $(`
      <li id="${cupcake.flavor}">${cupcake.flavor}</li>
    `);
}

function putListOnPage(){
  $cupcakes.empty();

  // loop through all of our stories and generate HTML for them
  for (let cupcake of cupcakesList) {
    const $cupcake = generateListMarkup(cupcake);
    $cupcakes.append($cupcake);
  }
}

async function addNewCupcake(evt) {

  evt.preventDefault();

  const $flavor = $("#flavor").val()
  const $size = $("#size").val()
  const $rating = $("#rating").val()
  const $image = $("#image-url").val()

  const newFormVals = {
    flavor: $flavor,
    size: $size,
    rating: $rating,
    image: $image
  }

  const newCupcake = await addCupcake(newFormVals);

  const $cupcake = generateListMarkup(newCupcake);
  $cupcakes.append($cupcake);
}

async function addCupcake(newFormVals) {
  const response = await axios.post(BASE_URL, {
                          headers: 'application/json',
                          data: newFormVals});

  return new Cupcake(response.data.cupcake);
}


showCupcakesList();
$form.on("submit", addNewCupcake);