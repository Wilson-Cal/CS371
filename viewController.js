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

function addCards(view, template) {

}

function setupFavorties() {
    let favoritesView = document.getElementById('favorites');
    let favoriteRestaurants = restaurantModel.getFavoriteRestaurants(userModel.favorites);
    let tempStr = ''
    favoriteRestaurants.forEach((fRestaurant, i) => {
        let cardTemplate = `<div class="card-panel teal">
                                <span class="white-text">${fRestaurant.name}</span>
                            </div>`;
        if (i === 0) {
            templateStr += '<div class="row">';
        } else if (i % 5 === 0) {
            templateStr += '</div><div class="row">';
        }
        templateStr += `<div class="col s12 m4 l3">${cardTemplate}</div>`;
    });
    favoritesView.innerHTML = tempStr;
}

function setupPopular() {
    let popularView = document.getElementById('popular');
    let popularRestaurants = restaurantModel.getPopularRestaurants();
    let tempStr = ''
    popularRestaurants.forEach((pRestaurant, i) => {
        let cardTemplate = `<div class="card-panel teal">
                                <span class="white-text">${pRestaurant.name}</span>
                            </div>`;
        if (i === 0) {
            templateStr += '<div class="row">';
        } else if (i % 5 === 0) {
            templateStr += '</div><div class="row">';
        }
        templateStr += `<div class="col s12 m4 l3">${cardTemplate}</div>`;
    });
    popularView.innerHTML = tempStr;
}

function setupAlphabetical() {
    let alphabeticalView = document.getElementById('alphabetical');
    let alphabeticalRestaurants = restaurantModel.getAlphabeticalRestaurants();
    let tempStr = ''
    alphabeticalRestaurants.forEach((aRestaurant, i) => {
        let cardTemplate = `<div class="card-panel teal">
                                <span class="white-text">${aRestaurant.name}</span>
                            </div>`;
        if (i === 0) {
            templateStr += '<div class="row">';
        } else if (i % 5 === 0) {
            templateStr += '</div><div class="row">';
        }
        templateStr += `<div class="col s12 m4 l3">${cardTemplate}</div>`;
    });
    alphabeticalView.innerHTML = tempStr;
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