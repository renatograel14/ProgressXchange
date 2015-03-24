var frame = require("ui/frame");
var appViewModel = require("./app-view-model");
function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = appViewModel.appModel;
}
exports.pageLoaded = pageLoaded;
function selectSession(args) {
    frame.topmost().navigate({
        moduleName: "app/session-page",
        context: args.view.bindingContext
    });
}
exports.selectSession = selectSession;
function toggleFavorite(args) {
    var item = args.view.bindingContext;
    item.toggleFavorite();
}
exports.toggleFavorite = toggleFavorite;
