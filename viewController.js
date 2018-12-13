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
let favoriteToggle = document.getElementById('favoriteToggle');
let menuItems = [{
    name: 'Hamburger',
    price: 6.99,
    image: 'http://icons.iconarchive.com/icons/google/noto-emoji-food-drink/256/32382-hamburger-icon.png'
}, {
    name: 'Burrito',
    price: 7.99,
    image: 'http://icons.iconarchive.com/icons/google/noto-emoji-food-drink/256/32388-burrito-icon.png'
}, {
    name: 'Steak',
    price: 11.99,
    image: 'http://icons.iconarchive.com/icons/aha-soft/desktop-buffet/256/Steak-icon.png'
}, {
    name: 'Pizza',
    price: 10.99,
    image: 'http://icons.iconarchive.com/icons/aha-soft/desktop-buffet/256/Pizza-icon.png'
}];

function addToCart(menuItem) {
    console.log(menuItem);
    userModel.cart.push(menuItem);
    userModel.saveUserModel();
    setupCart();
}

function getRestaurantDetails(restaurant) {
    let modal = document.getElementById('modal1');
    let modalContent = document.getElementById('modalContent');
    let instance = M.Modal.getInstance(modal);
    let templateStr = `<h3 id="restaurantName">${restaurant.restaurant.name}</h3>`;
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
                                <img src="${menuItem.image}">
                                </div>
                                <div class="card-action">
                                <a class="waves-effect waves-light btn-large" data-name="${menuItem.name}" id="addToCart"><i class="material-icons left">add_shopping_cart</i>Add To Cart</a>
                            </div>
                        </div>`;
        templateStr += cardTemplate;
    });
    modalContent.innerHTML = templateStr;
    let addToCartButtons = document.querySelectorAll('#addToCart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', event => {
            M.toast({
                html: `Added To Cart`,
                classes: 'teal',
            });
            addToCart(menuItems.find(item => {
                return event.path[0].dataset.name === item.name;
            }));
        });
    });
    // Check if this restaurant is already favorited
    if (userModel.favorites.includes(restaurant.restaurant.name)) {
        favoriteToggle.innerHTML = '<i class="material-icons left">star</i>Remove from Favorites'
    } else {
        favoriteToggle.innerHTML = '<i class="material-icons left">star_border</i>Add to Favorites'
    }
    instance.open();
}

function setupCart() {
    let cartItemsView = document.getElementById('cartItems');
    let totalPriceView = document.getElementById('totalPrice');
    let total = 0.00;
    let templateStr = '';
    userModel.cart.forEach(item => {
        if (item) {
            let cardTemplate = `<div class="card-panel teal" id="cartCard">
                                <span class="white-text" style="font-size:18px">${item.name} - \$${item.price}<i class="material-icons right" id="removeFromCart" data-name="${item.name}">restore_from_trash</i></span>
                            </div>`
            total += item.price;
            templateStr += cardTemplate;
        }
    });
    totalPriceView.innerHTML = `\$${total}`;
    if (userModel.cart[0] == null) {
        userModel.cart.shift();
    }
    if (userModel.cart.length === 0) {
        cartItemsView.innerHTML = `It's lonely in here! Add some items to your cart!`;
        return;
    }
    console.log(userModel.cart);
    console.log(templateStr);
    if (templateStr) {
        cartItemsView.innerHTML = templateStr;
        let cartItems = document.querySelectorAll('#removeFromCart');
        cartItems.forEach(cartItem => {
            cartItem.addEventListener('click', event => {
                let removeItemName = event.path[0].dataset.name;
                let index = userModel.cart.findIndex(item => {
                    if (item) {
                        return item.name.toLowerCase() === removeItemName.toLowerCase();
                    }
                });
                if (index > -1) {
                    userModel.cart.splice(index, 1);
                    M.toast({
                        html: `Removed From Cart`,
                        classes: 'red darken-4',
                    });
                    userModel.saveUserModel();
                }
                setupCart();
            });
        })
    }
}

function setupFavorties() {
    let favoritesView = document.getElementById('favorites');
    let favoriteRestaurants = restaurantModel.getFavoriteRestaurants(userModel.favorites);
    let templateStr = ''
    if (favoriteRestaurants.length === 0) {
        favoritesView.innerHTML = '<p>Add some favorites to have quick access to them!</p>'
    }
    favoriteRestaurants.forEach((fRestaurant, i) => {
        let cardTemplate = `<div class="card-panel teal" id="favoriteCard">
                                <span class="white-text">${fRestaurant.restaurant.name}</span>
                            </div>`;
        if (i === 0) {
            templateStr += '<div class="row">';
        } else if (i % 4 === 0) {
            templateStr += '</div><div class="row">';
        }
        templateStr += `<div class="col s12 m4 l3">${cardTemplate}</div>`;
    });
    if (templateStr) {
        favoritesView.innerHTML = templateStr;
        let favoriteCards = document.querySelectorAll('#favoriteCard');
        favoriteCards.forEach(card => {
            card.addEventListener('click', event => {
                getRestaurantDetails(restaurantModel.restaurants.find(restaurant => {
                    return restaurant.restaurant.name.toLowerCase() === event.path[0].innerText.toLowerCase();
                }));
            });
            card.addEventListener('touchend', event => {
                getRestaurantDetails(restaurantModel.restaurants.find(restaurant => {
                    return restaurant.restaurant.name.toLowerCase() === event.path[0].innerText.toLowerCase();
                }));
            });
        })
    }
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
        restaurantCards.forEach(restaurantCard => {
            restaurantCard.addEventListener('click', event => {
                getRestaurantDetails(restaurantModel.restaurants.find(restaurant => {
                    return restaurant.restaurant.name.toLowerCase() === event.path[0].innerText.toLowerCase();
                }));
            });
            restaurantCard.addEventListener('touchend', event => {
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
        let cardTemplate = `<div class="card-panel teal" id="searchCard">
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
        let searchCards = document.querySelectorAll('#searchCard');
        searchCards.forEach(searchCard => {
            searchCard.addEventListener('click', event => {
                getRestaurantDetails(restaurantModel.restaurants.find(restaurant => {
                    return restaurant.restaurant.name.toLowerCase() === event.path[0].innerText.toLowerCase();
                }));
            });
        });
        restaurantContent.style.display = 'none';
        searchContent.style.display = 'block';
    } else {
        searchContent.style.display = 'none';
        restaurantContent.style.display = 'block';
    }
});

favoriteToggle.addEventListener('click', event => {
    let restaurantName = document.getElementById('restaurantName').innerHTML;
    if (event.path[0].innerText.includes('ADD')) {
        userModel.favorites.push(restaurantName);
        userModel.saveUserModel();
        M.toast({
            html: `Added To Favorites`,
            classes: 'teal'
        });
        favoriteToggle.innerHTML = '<i class="material-icons left">star</i>Remove from Favorites';
    } else if (event.path[0].innerText.includes('REMOVE')) {
        let index = userModel.favorites.findIndex(favorite => {
            return favorite.toLowerCase() === restaurantName.toLowerCase();
        });
        if (index > -1) {
            userModel.favorites.splice(index, 1);
            userModel.saveUserModel();
            favoriteToggle.innerHTML = '<i class="material-icons left">star_border</i>Add from Favorites'
            M.toast({
                html: `Removed From Favorites`,
                classes: 'red darken-4',
            });
        }
    }
    setupFavorties();
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
                userModel.loadUserModel()
                setupView();
            });
        }, err => {
            console.log(err);
            // Default to Idaho Falls, ID
            userModel.location.id = 679
            setupView();
        });
    }
}

// Initialize the modal
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
});