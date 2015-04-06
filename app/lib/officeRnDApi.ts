import http = require("http");
import imageSource = require("image-source");
import imageCache = require("ui/image-cache");

var officeRnDApi = "https://www.officernd.com/api/v1/";
var cache = new imageCache.Cache();
var defaultNotFoundImageSource = imageSource.fromFile("~/images/no-map.png");

var config = {
    rooms: [{
        roomName: "Skyline Ballroom", // TODO: Take this from the server
        roomId: "5512e51e5f21568a0f16b3db",
        theme: "professional"
    }]
};

cache.invalid = defaultNotFoundImageSource;
cache.maxRequests = 5;

function getImage(uri, done) {
    var source = cache.get(uri);

    if (source) {
        done(source);
    } else {
        cache.push({
            key: uri,
            url: uri,
            completed: function (result, key) {
                if (key === uri) {
                    done(result);
                }
            }
        });
    }
}

export function getRoomImage(roomIndex, update) {
    var getRoomImageUri, roomConfig, imageModel;

    roomIndex = roomIndex || 0;
    roomConfig = config.rooms[roomIndex];

    getRoomImageUri = officeRnDApi + "rooms/" + roomConfig.roomId + "/export-uri?theme=" + roomConfig.theme;

    console.log("Loading: " + getRoomImageUri);
    http.getJSON(getRoomImageUri)
        .then(function (res) {
            var uri = "https:" + (<any>res).uri;
            // TODO: Read room name from the endpoint
            console.log("Loading image: " + uri);
            getImage(uri, function (image) {
                console.log("Image downloaded");
                update(roomConfig.roomName, image);
            });
        }, function (err) {
            console.log("ERROR: " + err);
            update(roomConfig.roomName, defaultNotFoundImageSource);
        });
}