function pageNavigatedTo(args) {
    var page = args.object;
    page.bindingContext = page.navigationContext;
}
exports.pageNavigatedTo = pageNavigatedTo;
function toggleFavorite(args) {
    var item = args.view.bindingContext;
    item.toggleFavorite();
}
exports.toggleFavorite = toggleFavorite;
