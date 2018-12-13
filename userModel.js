export class UserModel {
    constructor() {
        this.location = {
            lat: '',
            lon: '',
            id: ''
        };
        this.favorites = [];
        this.cart = [];
    }

    getSuggestedLocationID(callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let suggestedLocation = JSON.parse(this.responseText);
                callback(null, suggestedLocation.location_suggestions[0].id)
            }
        };
        xhttp.open('GET', `https://developers.zomato.com/api/v2.1/cities?lat=${this.location.lat}&lon=${this.location.lon}`, true);
        xhttp.setRequestHeader("user-key", "1f04820e425e353990598580ecc354e3");
        xhttp.send();
    }

    saveUserModel() {
        localStorage.setItem('cs371User', JSON.stringify({
            favorites: this.favorites,
            cart: this.cart
        }));
    }

    loadUserModel() {
        let tempObj = JSON.parse(localStorage.getItem('cs371User'));
        if (tempObj) {
            this.cart = tempObj.cart;
            this.favorites = tempObj.favorites;
            return true;
        } else {
            return false;
        }
    }
}