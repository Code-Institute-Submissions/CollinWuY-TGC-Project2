var center = L.bounds([1.56073, 104.11475], [1.16, 103.502]).getCenter();
var map = L.map('mapdiv').setView([center.x, center.y], 13);

var basemap = L.tileLayer('https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png', {
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

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
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

getLocation();