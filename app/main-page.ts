import observable = require("data/observable");
import pages = require("ui/page");
import gestures = require("ui/gestures");
import listView = require("ui/list-view");
import frame = require("ui/frame");
import appViewModel = require("./app-view-model");

export function pageLoaded(args: observable.EventData) {
    var page = <pages.Page>args.object;

    var iosFrame = frame.topmost().ios;
    if (iosFrame) {
        iosFrame.navBarVisibility = "never";
    }

    page.bindingContext = appViewModel.appModel;
}

export function selectSession(args: listView.ItemEventData) {
    var session = <appViewModel.SessionModel>args.view.bindingContext;

    if (session.canBeFavorited) {
        frame.topmost().navigate({
            moduleName: "session-page",
            context: session
        });
    }
}

export function toggleFavorite(args: gestures.GestureEventData) {
    var session = <appViewModel.SessionModel>args.view.bindingContext;
    session.toggleFavorite();
}