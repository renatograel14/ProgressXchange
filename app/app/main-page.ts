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
        // TODO: make use of action bar settings if possible
        var navBar = iosFrame.controller.navigationBar;
        navBar.setBackgroundImageForBarMetrics(new UIImage(), UIBarMetrics.UIBarMetricsDefault);
        navBar.shadowImage = new UIImage();
        navBar.translucent = true;
        navBar.backgroundColor = UIColor.clearColor();
        iosFrame.controller.view.backgroundColor = UIColor.clearColor();
    }

    page.bindingContext = appViewModel.appModel;
}

export function selectSession(args: listView.ItemEventData) {
    frame.topmost().navigate({
        moduleName: "app/session-page",
        context: args.view.bindingContext
    });
}

export function toggleFavorite(args: gestures.GestureEventData) {
    var item = <appViewModel.SessionModel>args.view.bindingContext;
    item.toggleFavorite();
}