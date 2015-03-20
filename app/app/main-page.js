var appViewModel = require("./app-view-model");
function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = new appViewModel.AppViewModel();
}
exports.pageLoaded = pageLoaded;
function toggleFavorite(args) {
    var item = args.view.bindingContext;
    item.favorite = !item.favorite;
}
exports.toggleFavorite = toggleFavorite;
//# sourceMappingURL=main-page.js.map