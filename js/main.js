$(document).ready(function() {

    const center = L.bounds([1.56073, 104.11475], [1.16, 103.502]).getCenter();
    const map = L.map('mapdiv').setView([center.x, center.y], 13);

    const basemap = L.tileLayer('https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png', {
        detectRetina: true,
        maxZoom: 18,
        minZoom: 11,
        //Do not remove this attribution
        attribution: '<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> New OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
    });

    map.setMaxBounds([
        [1.56073, 104.1147],
        [1.16, 103.502]
    ]);

    basemap.addTo(map);
    map.invalidateSize();

    $('#user-input').on('click', fetchUserInput);

    function getLocation() {
        navigator.geolocation.getCurrentPosition(showPosition);
    }

    function showPosition(position) {
        marker = new L.Marker([position.coords.latitude, position.coords.longitude], {
            bounceOnAdd: false
        }).addTo(map);
        var popup = L.popup()
            .setLatLng([position.coords.latitude, position.coords.longitude])
            .setContent('You are here!')
            .openOn(map);
        map.setView([position.coords.latitude, position.coords.longitude], 18);
    }

    function fetchUserInput() {
        const onMapParams = new URLSearchParams({
            searchVal: 'Tampines Mall',
            returnGeom: 'Y',
            getAddrDetails: 'Y'
        })
        const oneMapURL = `https://developers.onemap.sg/commonapi/search?${onMapParams.toString()}`;

        let mapLong;
        let mapLat;

        fetch(oneMapURL)
            .then(response => response.json())
            .then(data => {
                let mapLat = data.results[0].LATITUDE;
                let mapLong = data.results[0].LONGTITUDE;
                marker = new L.Marker([mapLat, mapLong], { bounceOnAdd: false }).addTo(map);
                let popup = L.popup()
                    .setLatLng([mapLat, mapLong])
                    .setContent('You are here!')
                    .openOn(map);
                map.setView([mapLat, mapLong], 17);
                console.log(mapLat, mapLong);
            }).catch(error => console.log(error));
    }


})