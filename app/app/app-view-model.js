var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var observable = require("data/observable");
var dialogs = require("ui/dialogs");
var localSettings = require("local-settings");
var everlive = require("./lib/everlive");
var conferenceDays = [
    { title: "WORKSHOPS", date: new Date(2015, 5, 3) },
    { title: "CONFERENCE DAY 1", date: new Date(2015, 5, 4) },
    { title: "CONFERENCE DAY 2", date: new Date(2015, 5, 5) }
];
var sessions = new Array();
var FAVOURITES = "FAVOURITES";
var favourites;
try {
    favourites = JSON.parse(localSettings.getString(FAVOURITES, "[]"));
}
catch (error) {
    console.log("Error while retrieveing favourites: " + error);
    favourites = new Array();
    updateFavourites();
}
function addToFavourites(session) {
    if (favourites.indexOf(session.Id) < 0) {
        favourites.push(session.Id);
        updateFavourites();
    }
}
function removeFromFavourites(session) {
    var index = favourites.indexOf(session.Id);
    if (index >= 0) {
        favourites.splice(index, 1);
        updateFavourites();
    }
}
function updateFavourites() {
    var newValue = JSON.stringify(favourites);
    localSettings.setString(FAVOURITES, newValue);
}
var el = new everlive("mzacGkKPFlZUfbMq");
var expandExp = {
    "speakers": true
};
el.data('NextSessions').expand(expandExp).get().then(function (data) {
    var sessionsFromEvelive = data.result;
    for (var i = 0; i < sessionsFromEvelive.length; i++) {
        var newSession = new SessionModel(sessionsFromEvelive[i]);
        if (favourites.indexOf(newSession.Id) >= 0) {
            newSession.favorite = true;
        }
        sessions.push(newSession);
    }
    exports.appModel.onDataLoaded();
}, function (error) {
    dialogs.alert("Could not load sessions. Error: " + error);
});
var AppViewModel = (function (_super) {
    __extends(AppViewModel, _super);
    function AppViewModel() {
        _super.call(this);
        this._search = "";
        this.selectedIndex = 0;
        this.selectedViewIndex = 1;
        this.set("isLoading", true);
    }
    Object.defineProperty(AppViewModel.prototype, "sessions", {
        get: function () {
            return this._sessions;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppViewModel.prototype, "favorites", {
        get: function () {
            return this.sessions.filter(function (i) {
                return i.favorite;
            });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppViewModel.prototype, "search", {
        get: function () {
            return this._search;
        },
        set: function (value) {
            if (this._search !== value) {
                this._search = value;
                this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: "search", value: value });
                this.filter();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppViewModel.prototype, "selectedIndex", {
        get: function () {
            return this._selectedIndex;
        },
        set: function (value) {
            if (this._selectedIndex !== value) {
                this._selectedIndex = value;
                this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: "selectedIndex", value: value });
                this.set("dayHeader", conferenceDays[value].title);
                if (this.search !== "") {
                    this.search = "";
                }
                else {
                    this.filter();
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    AppViewModel.prototype.filter = function () {
        var _this = this;
        this._sessions = sessions.filter(function (s) {
            return s.start.getDate() === conferenceDays[_this.selectedIndex].date.getDate() && s.title.toLocaleLowerCase().indexOf(_this.search.toLocaleLowerCase()) >= 0;
        });
        if (this.selectedViewIndex === 0) {
            this._sessions = this._sessions.filter(function (i) {
                return i.favorite;
            });
        }
        this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: "sessions", value: this._sessions });
    };
    AppViewModel.prototype.onDataLoaded = function () {
        this.set("isLoading", false);
        this.filter();
    };
    AppViewModel.prototype.selectView = function (args) {
        var btn = args.object;
        if (btn.text === "My agenda") {
            this.selectedViewIndex = 0;
            this.filter();
        }
        else if (btn.text === "All sessions") {
            this.selectedViewIndex = 1;
            this.filter();
        }
        else if (btn.text === "About") {
            this.selectedViewIndex = 2;
        }
        this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: "selectedViewIndex", value: this.selectedViewIndex });
    };
    return AppViewModel;
})(observable.Observable);
exports.AppViewModel = AppViewModel;
exports.appModel = new AppViewModel();
var SessionModel = (function (_super) {
    __extends(SessionModel, _super);
    function SessionModel(source) {
        _super.call(this);
        if (source) {
            this._id = source.Id;
            this._title = source.title;
            this._room = source.room;
            this._start = source.start;
            this._end = source.end;
            this._speakers = source.speakers;
        }
    }
    Object.defineProperty(SessionModel.prototype, "Id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionModel.prototype, "title", {
        get: function () {
            return this._title;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionModel.prototype, "room", {
        get: function () {
            return this._room;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionModel.prototype, "start", {
        get: function () {
            return this._start;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionModel.prototype, "end", {
        get: function () {
            return this._end;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionModel.prototype, "speakers", {
        get: function () {
            return this._speakers;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionModel.prototype, "range", {
        get: function () {
            var startMinutes = this.start.getMinutes() + "";
            var endMinutes = this.end.getMinutes() + "";
            var startAM = this.start.getHours() < 12 ? "am" : "pm";
            var endAM = this.end.getHours() < 12 ? "am" : "pm";
            return this.start.getHours() + ':' + (startMinutes.length === 1 ? '0' + startMinutes : startMinutes) + startAM + ' - ' + this.end.getHours() + ':' + (endMinutes.length === 1 ? '0' + endMinutes : endMinutes) + endAM;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionModel.prototype, "canBeFavorited", {
        get: function () {
            return this.title.indexOf("Registration") === -1 && this.title.indexOf("Lunch") === -1 && this.title.indexOf("PM Break") === -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SessionModel.prototype, "favorite", {
        get: function () {
            return this._favorite;
        },
        set: function (value) {
            if (this._favorite !== value) {
                this._favorite = value;
                this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: "favorite", value: this._favorite });
            }
        },
        enumerable: true,
        configurable: true
    });
    SessionModel.prototype.toggleFavorite = function () {
        this.favorite = !this.favorite;
        if (this.favorite) {
            addToFavourites(this);
        }
        else {
            removeFromFavourites(this);
        }
    };
    return SessionModel;
})(observable.Observable);
exports.SessionModel = SessionModel;
