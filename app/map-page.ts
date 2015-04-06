import pages = require("ui/page");
import gestures = require("ui/gestures");
import utils = require("utils/utils");
import frame = require("ui/frame");
import observable = require("data/observable");

import rndApi = require("./lib/officeRnDApi");

export function pageNavigatedTo(args: observable.EventData) {
    var page = <pages.Page>args.object;

    var vm = new observable.Observable();
    vm.set("name", page.navigationContext.room);
    vm.set("isLoading", true);

    rndApi.getRoomImage(0, function (roomName, imageSource) {
        vm.set("image", imageSource);
        vm.set("isLoading", false);
    });

    page.bindingContext = vm;
}

export function backTap(args: gestures.GestureEventData) {
    frame.topmost().goBack();
}
