'use strict';

app.home = kendo.observable({
    onShow: function () {},
    afterShow: function () {},
    locationService: {
        initLocation: function () {
            var map,
                mapOptions,
                streetView;

            if (typeof google === "undefined") {
                return;
            }


            mapOptions = {
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_BOTTOM
                },
                mapTypeControl: false,
                streetViewControl: false
            };

            map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
            google.maps.event.trigger(map, "resize");	

        }
    }
});

// START_CUSTOM_CODE_home
// END_CUSTOM_CODE_home