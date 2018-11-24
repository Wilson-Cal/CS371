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
let searchContent = document.getElementById('searchContent');
let searchBarView = document.getElementById('search');
let menuItems = [{
    name: 'Hamburger',
    price: 6.99
}, {
    name: 'Burrito',
    price: 7.99
}, {
    name: 'Steak',
    price: 11.99
}, {
    name: 'Pizza',
    price: 10.99
}];

function addToCart(menuItem) {
    console.log(menuItem);
    userModel.cart.push(menuItem);
    setupCart();
}

function getRestaurantDetails(restaurant) {
    let modal = document.getElementById('modal1');
    let modalContent = document.getElementById('modalContent');
    let instance = M.Modal.getInstance(modal);
    let templateStr = `<h3>${restaurant.restaurant.name}</h3>`;
    templateStr += `<p>Overall Rating: ${restaurant.restaurant.user_rating.aggregate_rating}/5</p>`
    templateStr += `<p>Price Rating: ${restaurant.restaurant.price_range}/5</p>`;
    templateStr += `<p>Cuisine: ${restaurant.restaurant.cuisines}</p>`;
    templateStr += `<p>Address: ${restaurant.restaurant.location.address}</p>`;
    templateStr += `<h5>Menu</h5>`
    menuItems.forEach(menuItem => {
        let cardTemplate = `<div class="card teal">
                            <div class="card-content white-text">
                                <span class="card-title">${menuItem.name}</span>
                                <p>\$${menuItem.price}</p>
                                </div>
                                <div class="card-action">
                                <a class="waves-effect waves-light btn-large" data-name="${menuItem.name}" id="addToCart"><i class="material-icons left">add_shopping_cart</i>Add To Cart</a>
                            </div>
                        </div>`;
        templateStr += cardTemplate;
    });
    modalContent.innerHTML = templateStr;
    let addToCartButtons = document.querySelectorAll('#addToCart');
    console.log(addToCartButtons);
    addToCartButtons.forEach(button => {
        button.addEventListener('click', event => {
            console.log(event);
            addToCart(menuItems.find(item => {
                return event.path[0].dataset.name === item.name;
            }));
        });
    });
    instance.open();
}

function setupCart() {
    let cartItemsView = document.getElementById('cartItems');
    let totalPriceView = document.getElementById('totalPrice');
    let total = 0.00;
    let templateStr = '';
    userModel.cart.forEach(item => {
        let cardTemplate = `<div class="card-panel teal" id="cartCard">
                                <span class="white-text">${item.name} - \$${item.price}</span>
                            </div>`
        total += item.price;
        templateStr += cardTemplate;
    });
    totalPriceView.innerHTML = `\$${total}`;
    if (templateStr) {
        cartItemsView.innerHTML = templateStr;
    }
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
        setupCart();
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

function setupSearchResults(searchResults) {
    let searchResultsView = document.getElementById('searchResults');
    let templateStr = ''
    searchResults.forEach((result, i) => {
        let cardTemplate = `<div class="card-panel teal" id="restaurantCard">
                                <span class="white-text">${result.restaurant.name}</span>
                            </div>`;
        if (i === 0) {
            templateStr += '<div class="row">';
        } else if (i % 4 === 0) {
            templateStr += '</div><div class="row">';
        }
        templateStr += `<div class="col s12 m4 l3">${cardTemplate}</div>`;
    });
    searchResultsView.innerHTML = templateStr;
}

searchBarView.addEventListener('keyup', event => {
    if (searchBarView.value.length > 0) {
        let fData = restaurantModel.restaurants.filter(restaurant => {
            return restaurant.restaurant.name.toLowerCase().includes(searchBarView.value.toLowerCase());
        });
        setupSearchResults(fData);
        restaurantContent.style.display = 'none';
        searchContent.style.display = 'block';
    } else {
        searchContent.style.display = 'none';
        restaurantContent.style.display = 'block';
    }
});

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