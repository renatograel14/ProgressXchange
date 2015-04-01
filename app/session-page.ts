import observable = require("data/observable");
import pages = require("ui/page");
import gestures = require("ui/gestures");
import platform = require("platform");
import utils = require("utils/utils");
import frame = require("ui/frame");
import button = require("ui/button");
import label = require("ui/label");
import view = require("ui/core/view");
import scrollView = require("ui/scroll-view");
import appViewModel = require("./app-view-model");

export function pageNavigatedTo(args: observable.EventData) {
    var page = <pages.Page>args.object;

    page.bindingContext = page.navigationContext;
}

export function toggleFavorite(args: gestures.GestureEventData) {
    var item = <appViewModel.SessionModel>args.view.bindingContext;
    item.toggleFavorite();
}

export function shareTap(args: gestures.GestureEventData) {
    var item = <appViewModel.SessionModel>args.view.bindingContext;
    var text = item.title + " at #telerikNEXT";

    if (platform.device.os === platform.platformNames.android) {
        var intent = new android.content.Intent(android.content.Intent.ACTION_SEND);
        intent.setType("text/plain");
        intent.putExtra(android.content.Intent.EXTRA_SUBJECT, "subject");
        intent.putExtra(android.content.Intent.EXTRA_TEXT, text);

        var activity = frame.topmost().android.activity;
        activity.startActivity(android.content.Intent.createChooser(intent, "share"));
    }
    else if (platform.device.os === platform.platformNames.ios) {
        var currentPage = frame.topmost().currentPage;

        var controller = new UIActivityViewController(utils.ios.collections.jsArrayToNSArray([text]), null);

        (<UIViewController>currentPage.ios).presentViewControllerAnimatedCompletion(controller, true, null);
    }
}

export function toogleDescritpion(args: observable.EventData) {
    var btn = <button.Button>args.object;
    var page = view.getAncestor(btn, "Page");

    var txtDesc = <label.Label>page.getViewById("txtDescription");
    var scroll = <scrollView.ScrollView>page.getViewById("scroll");
    var item = <appViewModel.SessionModel>page.bindingContext;

    if (btn.text === "MORE") {
        btn.text = "LESS";
        txtDesc.text = item.description;
    }
    else {
        btn.text = "MORE";
        txtDesc.text = item.descriptionShort;
        scroll.scrollToVerticalOffset(0, false);
    }
}

export function backTap(args: gestures.GestureEventData) {
    console.log("going back");
    frame.topmost().goBack();
}
