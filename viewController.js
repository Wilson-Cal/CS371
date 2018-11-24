import {
    RestaurantModel
} from './restaurantModel.js';

import {
    UserModel
} from './userModel.js';

let userModel = new UserModel();
let restaurantModel = new RestaurantModel();


function setupView() {
    restaurantModel.getRestaurants(userModel.location.id, (err, restaurants) => {
        if (err) {
            console.error(err);
        }
        restaurantModel.restaurants = restaurants;
        console.log(restaurantModel);
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