import {
    RestaurantModel
} from './restaurantModel.js';

import {
    UserModel
} from './userModel.js';

let userModel = new UserModel();
let restaurantModel = new RestaurantModel();
let spinner = document.getElementById('loader');
let restaurantContent = document.getElementById('restaurantContent');

function getRestaurantDetails(restaurant) {
    let cardTemplate = `<div class="card teal">
                            <div class="card-content white-text">
                                <span class="card-title">Hamburger</span>
                                <p>$5.00</p>
                                </div>
                                <div class="card-action">
                                <a class="waves-effect waves-light btn-large"><i class="material-icons left">add_shopping_cart</i>Add To Cart</a>
                            </div>
                        </div>`;
    let modal = document.getElementById('modal1');
    let modalContent = document.getElementById('modalContent');
    let instance = M.Modal.getInstance(modal);
    let templateStr = `<h3>${restaurant.restaurant.name}</h3>`;
    templateStr += `<p>Price Rating: ${restaurant.restaurant.price_range}/5</p>`;
    templateStr += `<p>Cuisine: ${restaurant.restaurant.cuisines}</p>`;
    templateStr += `<p>Address: ${restaurant.restaurant.location.address}</p>`;
    templateStr += `<h5>Menu</h5>`
    templateStr += cardTemplate;

    modalContent.innerHTML = templateStr;
    instance.open();
}

function setupFavorties() {
    let favoritesView = document.getElementById('favorites');
    let favoriteRestaurants = restaurantModel.getFavoriteRestaurants(userModel.favorites);
    let templateStr = ''
    favoriteRestaurants.forEach((fRestaurant, i) => {
        let cardTemplate = `<div class="card-panel teal" id="restaurantCard">
                                <span class="white-text">${fRestaurant.restaurant.name}</span>
                            </div>`;
        if (i === 0) {
            templateStr += '<div class="row">';
        } else if (i % 4 === 0) {
            templateStr += '</div><div class="row">';
        }
        templateStr += `<div class="col s12 m4 l3">${cardTemplate}</div>`;
    });
    favoritesView.innerHTML = templateStr;
}

function setupPopular() {
    let popularView = document.getElementById('popular');
    let popularRestaurants = restaurantModel.getPopularRestaurants();
    let templateStr = ''
    popularRestaurants.forEach((pRestaurant, i) => {
        let cardTemplate = `<div class="card-panel teal" id="restaurantCard">
                                <span class="white-text">${pRestaurant.restaurant.name}</span>
                            </div>`;
        if (i === 0) {
            templateStr += '<div class="row">';
        } else if (i % 4 === 0) {
            templateStr += '</div><div class="row">';
        }
        templateStr += `<div class="col s12 m4 l3">${cardTemplate}</div>`;
    });
    popularView.innerHTML = templateStr;
}

function setupAlphabetical() {
    let alphabeticalView = document.getElementById('alphabetical');
    let alphabeticalRestaurants = restaurantModel.getAlphabeticalRestaurants();
    let templateStr = ''
    alphabeticalRestaurants.forEach((aRestaurant, i) => {
        let cardTemplate = `<div class="card-panel teal" id="restaurantCard">
                                <span class="white-text">${aRestaurant.restaurant.name}</span>
                            </div>`;
        if (i === 0) {
            templateStr += '<div class="row">';
        } else if (i % 4 === 0) {
            templateStr += '</div><div class="row">';
        }
        templateStr += `<div class="col s12 m4 l3">${cardTemplate}</div>`;
    });
    alphabeticalView.innerHTML = templateStr;
}


function setupView() {
    restaurantModel.getRestaurants(userModel.location.id, (err, restaurants) => {
        if (err) {
            console.error(err);
        }
        restaurantModel.restaurants = restaurants;
        setupFavorties();
        setupPopular();
        setupAlphabetical();
        let restaurantCards = document.querySelectorAll('#restaurantCard');
        console.log(restaurantCards);
        restaurantCards.forEach(restaurantCard => {
            restaurantCard.addEventListener('click', event => {
                getRestaurantDetails(restaurantModel.restaurants.find(restaurant => {
                    return restaurant.restaurant.name.toLowerCase() === event.path[0].innerText.toLowerCase();
                }));
            });
        });
        spinner.style.display = 'none';
        restaurantContent.style.display = 'block';
    });
}

// Start Here
window.onload = event => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(positon => {
            userModel.location.lat = positon.coords.latitude;
            userModel.location.lon = positon.coords.longitude;
            userModel.getSuggestedLocationID((err, locationID) => {
                if (err) {
                    console.error(err);
                } else {
                    userModel.location.id = locationID;
                }
                setupView();
            });
        });
    } else {
        // Default to Idaho Falls, ID
        userModel.location.id = 679
        setupView();
    }
};

// Initialize the modal
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
});