export class RestaurantModel {
    constructor() {
        this.restaurants = [];
    }

    getRestaurants(locationID, callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let restaurantData = JSON.parse(this.responseText);
                callback(null, restaurantData.restaurants);
            }
        };
        xhttp.open('GET', `https://developers.zomato.com/api/v2.1/search?entity_id=${locationID}&entity_type=city`, true);
        xhttp.setRequestHeader("user-key", "1f04820e425e353990598580ecc354e3");
        xhttp.send();
    }
}