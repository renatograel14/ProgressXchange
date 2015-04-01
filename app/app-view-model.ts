import observable = require("data/observable");
import dialogs = require("ui/dialogs");
import localSettings = require("local-settings");
import button = require("ui/button");
var everlive = require("./lib/everlive");
import platform = require("platform");
import appModule = require("application");

interface ConferenceDay {
    date: Date;
    title: string;
}

interface Speaker {
    //Id: string;
    name: string;
    title: string;
    company: string;
    picture: string;
}

interface Session {
    Id: string;
    title: string;
    start: Date;
    end: Date;
    room: string;
    speakers: Array<Speaker>;
    description: string;
    descriptionShort: string;
    calendarEventId: string;
}

var conferenceDays: Array<ConferenceDay> = [
    { title: "WORKSHOPS", date: new Date(2015, 5, 3) },
    { title: "CONFERENCE DAY 1", date: new Date(2015, 5, 4) },
    { title: "CONFERENCE DAY 2", date: new Date(2015, 5, 5) }
];
var pageTitles: Array<string> = ["My agenda", "All sessions", "About"];

var sessions: Array<SessionModel> = new Array<SessionModel>();

var FAVOURITES = "FAVOURITES";
var favourites: Array<string>;
try {
    favourites = <Array<string>>JSON.parse(localSettings.getString(FAVOURITES, "[]"));
}
catch (error) {
    console.log("Error while retrieveing favourites: " + error);
    favourites = new Array<string>();
    updateFavourites();
}

function addToFavourites(session: SessionModel) {
    if (favourites.indexOf(session.Id) < 0) {
        favourites.push(session.Id);
        updateFavourites();
    }

    if (platform.device.os === platform.platformNames.android) {
        /*
        var eventUriString = "content://com.android.calendar/events";
        var eventValues = new android.content.ContentValues();

        eventValues.put("calendar_id", java.lang.Integer.valueOf(1));

        eventValues.put("title", session.title);
        eventValues.put("description", "");
        eventValues.put("eventLocation", session.room);
        eventValues.put("eventTimezone", java.util.TimeZone.getDefault().getID())

        var startDate = session.start.getTime() / 1000;
        var endDate = session.end.getTime() / 1000;

        eventValues.put("dtstart", java.lang.Integer.valueOf(startDate));
        eventValues.put("dtend", java.lang.Integer.valueOf(endDate));

        eventValues.put("eventStatus", java.lang.Integer.valueOf(1));
        eventValues.put("hasAlarm", java.lang.Integer.valueOf(1));

        var eventUri = appModule.android.foregroundActivity.getApplicationContext().getContentResolver().insert(android.net.Uri.parse(eventUriString), eventValues);
        var eventID = java.lang.Long.parseLong(eventUri.getLastPathSegment());

        var reminderUriString = "content://com.android.calendar/reminders";
        var reminderValues = new android.content.ContentValues();

        reminderValues.put("event_id", java.lang.Long.valueOf(eventID));
        reminderValues.put("minutes", java.lang.Integer.valueOf(5));
        reminderValues.put("method", java.lang.Integer.valueOf(1));

        var reminderUri = appModule.android.foregroundActivity.getApplicationContext().getContentResolver().insert(android.net.Uri.parse(reminderUriString), reminderValues);
        */
    } else if (platform.device.os === platform.platformNames.ios) {
        var store = EKEventStore.new()
        store.requestAccessToEntityTypeCompletion(EKEntityTypeEvent, (granted: boolean, error: NSError) => {
            if (!granted) {
                return;
            }

            var event = EKEvent.eventWithEventStore(store);
            event.title = session.title;
            event.timeZone = NSTimeZone.alloc().initWithName("UTC-05:00");
            event.startDate = NSDate.dateWithTimeIntervalSince1970(session.start.getTime() / 1000);
            event.endDate = NSDate.dateWithTimeIntervalSince1970(session.end.getTime() / 1000);
            event.calendar = store.defaultCalendarForNewEvents;

            var err: NSError;
            var result = store.saveEventSpanCommitError(event, EKSpan.EKSpanThisEvent, true, err);

            session.calendarEventId = event.eventIdentifier;
        });
    }
}

function removeFromFavourites(session: SessionModel) {
    var index = favourites.indexOf(session.Id);
    if (index >= 0) {
        favourites.splice(index, 1);
        updateFavourites();
    }

    if (platform.device.os === platform.platformNames.android) {
        //
    } else if (platform.device.os === platform.platformNames.ios) {
        var store = EKEventStore.new()
        store.requestAccessToEntityTypeCompletion(EKEntityTypeEvent, (granted: boolean, error: NSError) => {
            if (!granted) {
                return;
            }

            var eventToRemove = store.eventWithIdentifier(session.calendarEventId);
            if (eventToRemove) {
                var err: NSError;
                store.removeEventSpanCommitError(eventToRemove, EKSpan.EKSpanThisEvent, true, err);
                session.calendarEventId = undefined;
            }
        });
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
el.data('NextSessions').expand(expandExp).get().then(
    function (data) {
        //console.log("Sessions are[" + data.result[1].Data + "]")
        var sessionsFromEvelive: Array<Session> = <Array<Session>> data.result;

        for (var i = 0; i < sessionsFromEvelive.length; i++) {
            var newSession = new SessionModel(sessionsFromEvelive[i]);
            if (favourites.indexOf(newSession.Id) >= 0) {
                newSession.favorite = true;
            }
            sessions.push(newSession);
        }

        appModel.onDataLoaded();

    }, function (error) {
        dialogs.alert("Could not load sessions. Error: " + error);
    }
    );

export class AppViewModel extends observable.Observable {
    public selectedViewIndex: number;
    private _selectedIndex;

    constructor() {
        super();

        this.selectedIndex = 0;
        this.selectedViewIndex = 1;
        this.set("actionBarTitle", pageTitles[this.selectedViewIndex]);
        this.set("isLoading", true);
    }

    private _sessions: Array<SessionModel>;
    get sessions(): Array<SessionModel> {
        return this._sessions;
    }

    get favorites(): Array<SessionModel> {
        return this.sessions.filter(i=> { return i.favorite });
    }

    private _search = "";
    get search(): string {
        return this._search;
    }
    set search(value: string) {
        if (this._search !== value) {
            this._search = value;
            this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: "search", value: value });

            this.filter();
        }
    }

    get selectedIndex(): number {
        return this._selectedIndex;
    }
    set selectedIndex(value: number) {
        if (this._selectedIndex !== value) {
            this._selectedIndex = value;
            this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: "selectedIndex", value: value });

            this.set("dayHeader", conferenceDays[value].title);

            if (this.search !== "") {
                this.search = "";
            } else {
                this.filter();
            }
        }
    }

    private filter() {
        this._sessions = sessions.filter(s=> {
            return s.start.getDate() === conferenceDays[this.selectedIndex].date.getDate()
                && s.title.toLocaleLowerCase().indexOf(this.search.toLocaleLowerCase()) >= 0;
        });

        if (this.selectedViewIndex === 0) {
            this._sessions = this._sessions.filter(i=> { return i.favorite || !i.canBeFavorited; });
        }

        this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: "sessions", value: this._sessions });
    }

    public onDataLoaded() {
        this.set("isLoading", false);
        this.filter();
    }

    public selectView(args: observable.EventData) {
        var btn = <button.Button>args.object;

        if (btn.text === pageTitles[0]) {
            this.selectedViewIndex = 0;
            this.filter();
        } else if (btn.text === pageTitles[1]) {
            this.selectedViewIndex = 1;
            this.filter();
        } else if (btn.text === pageTitles[2]) {
            this.selectedViewIndex = 2;
        }

        this.set("actionBarTitle", pageTitles[this.selectedViewIndex]);

        this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: "selectedViewIndex", value: this.selectedViewIndex });
    }
}

export var appModel = new AppViewModel();

export class SessionModel extends observable.Observable implements Session {
    constructor(source?: Session) {
        super();

        if (source) {
            this._id = source.Id;
            this._title = source.title;
            this._room = source.room;
            this._start = source.start;
            this._end = source.end;
            this._speakers = source.speakers;
        }
    }
    private _id: string;
    private _speakers: Array<Speaker>;
    private _title: string;
    private _start: Date;
    private _end: Date;
    private _room: string;
    private _favorite: boolean;
    private _calendarEventId: string;

    get Id(): string {
        return this._id;
    }

    get title(): string {
        return this._title;
    }

    get room(): string {
        return this._room;
    }

    get start(): Date {
        return this._start;
    }

    get end(): Date {
        return this._end;
    }

    get speakers(): Array<Speaker> {
        return this._speakers;
    }

    get range(): string {
        var startMinutes = this.start.getMinutes() + "";
        var endMinutes = this.end.getMinutes() + "";
        var startAM = this.start.getHours() < 12 ? "am" : "pm";
        var endAM = this.end.getHours() < 12 ? "am" : "pm";

        return this.start.getHours() + ':' + (startMinutes.length === 1 ? '0' + startMinutes : startMinutes) + startAM +
            ' - ' + this.end.getHours() + ':' + (endMinutes.length === 1 ? '0' + endMinutes : endMinutes) + endAM;
    }

    get canBeFavorited(): boolean {
        return this.title.indexOf("Registration") === -1 && this.title.indexOf("Lunch") === -1 && this.title.indexOf("PM Break") === -1;
    }

    get favorite(): boolean {
        return this._favorite;
    }
    set favorite(value: boolean) {
        if (this._favorite !== value) {
            this._favorite = value;
            this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: "favorite", value: this._favorite });
        }
    }

    get description(): string {
        return "TODO: Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.Put description here.";
    }

    get descriptionShort(): string {
        if (this.description.length > 160) {
            return this.description.substr(0, 160) + "...";
        }
        else {
            return this.description;
        }
    }

    public toggleFavorite() {
        this.favorite = !this.favorite;
        if (this.favorite) {
            addToFavourites(this);
        }
        else {
            removeFromFavourites(this);
        }
    }

    get calendarEventId(): string {
        return this._calendarEventId;
    }
    set calendarEventId(value: string) {
        if (this._calendarEventId !== value) {
            this._calendarEventId = value;
            this.notify({ object: this, eventName: observable.knownEvents.propertyChange, propertyName: "calendarEventId", value: this._calendarEventId });
        }
    }
}
