export class UserModel {
    constructor() {
        this.location = {
            lat: '',
            lon: '',
            id: ''
        };
        this.favorites = [];
    }

    getSuggestedLocationID(callback) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log(this.responseText);
                callback()
            }
        };
        xhttp.open('GET', 'https://developers.zomato.com/api/v2.1/cities?lat=43.8261766&lon=-111.79344119999999', true);
        xhttp.setRequestHeader("user-key", "1f04820e425e353990598580ecc354e3");
        xhttp.send();
    }
}