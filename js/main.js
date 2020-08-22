$(document).ready(function() {

    let map;
    let mapLong;
    let mapLat;
    let userText;
    let latLng;
    let carparkIcon = "../assets/images/car.png";
    let parkingMapIcons;
    let carparkDescription;
    let carParkType;
    let shortTermParking;
    let nightParking;
    let freeParking;
    let parkingSystemType;


    let homepage = document.querySelector('#homePage');

    parkingMapIcons = L.icon({
        iconUrl: carparkIcon,
        iconSize: [40, 40],
        iconAnchor: [10, 35],
        popupAnchor: [-3, -76]
    })

    const createMap = function() {
        const center = L.bounds([1.56073, 104.11475], [1.16, 103.502]).getCenter();
        map = L.map('mapdiv').setView([center.x, center.y], 12);

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
    }


    const openClose = function() {
        let action = 1;
        $('#hmSecTextSub').on('click', function() {
            let textSelector = document.querySelector('#userTextInputDiv');
            if (action == 1) {
                textSelector.classList.remove('hidden');
                $('#hmSecTextSub').css('color', 'red');
                action = 2;
                console.log(action);
            } else {
                textSelector.classList.add('hidden');
                $('#hmSecTextSub').css('color', 'blue');
                action = 1;
                console.log(action);
            }
        })
    }


    $('#mapInfoIcon').on('click', function() {
        homepage.classList.remove('hidden');
        $('#mapPage').hide();
    })

    $('#userInputBtn').on('click', fetchUserInputAuto);
    $('#userTextInput1').keydown(function(e) {
        let keyPressed = event.keyCode || event.which;
        if (keyPressed === 13) {
            fetchUserInput1();
            $('#userTextInput1').val("");
        }
    });
    $('#userTextInput2').keydown(function(e) {
        let keyPressed = event.keyCode || event.which;
        if (keyPressed === 13) {
            fetchUserInput2();
            $('#userTextInput2').val("");
        }
    });
    openClose();



    function parkingThemeDetails() {

        const onMapThemeParams = new URLSearchParams({
            queryName: 'hdb_car_park_information',
            token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjUzMjksInVzZXJfaWQiOjUzMjksImVtYWlsIjoieGxhenVyZWx4QGdtYWlsLmNvbSIsImZvcmV2ZXIiOmZhbHNlLCJpc3MiOiJodHRwOlwvXC9vbTIuZGZlLm9uZW1hcC5zZ1wvYXBpXC92MlwvdXNlclwvc2Vzc2lvbiIsImlhdCI6MTU5NzY0Nzg4MSwiZXhwIjoxNTk4MDc5ODgxLCJuYmYiOjE1OTc2NDc4ODEsImp0aSI6ImYxN2RlNGQ2YmYxNzMyYjQ5YjM4NTc2YzU5OWM2OGNiIn0.Gnm8uI2a4epvdeBE8lKyU2-JOItCtA7-Ake36tiSOog'
        });
        const oneMapThemeURL = `https://developers.onemap.sg/privateapi/themesvc/retrieveTheme?${onMapThemeParams.toString()}`;


        fetch(oneMapThemeURL)
            .then(themeResp => themeResp.json())
            .then(data => {
                for (let i = 1; i < data.SrchResults.length; i++) {
                    // Retrieve DATA from OneMap Theme API
                    latLng = data.SrchResults[i].LatLng;
                    let geoParts = latLng.split(",");
                    iconURL = data.SrchResults[i].ICON_NAME;
                    carparkDescription = data.SrchResults[i].DESCRIPTION;
                    carParkType = data.SrchResults[i].CAR_PARK_TYPE;
                    shortTermParking = data.SrchResults[i].SHORT_TERM_PARKING;
                    nightParking = data.SrchResults[i].NIGHT_PARKING;
                    freeParking = data.SrchResults[i].FREE_PARKING;
                    parkingSystemType = data.SrchResults[i].TYPE_OF_PARKING_SYSTEM;
                    // Testing Data Retrieval
                    console.log(latLng);
                    console.log(iconURL);
                    console.log(carParkType);
                    console.log(shortTermParking);
                    console.log(nightParking);
                    console.log(freeParking);
                    console.log(parkingSystemType);
                    marker = new L.Marker([parseFloat(geoParts[0]), parseFloat(geoParts[1])], { icon: parkingMapIcons }).addTo(map);

                    marker.on('click', function() {
                        console.log("marker clicked"); //testing on click function on markers
                        let popup = L.popup()
                            .setLatLng([parseFloat(geoParts[0]), parseFloat(geoParts[1])])
                            .setContent(`<div id="markerPopup">
                                        <ul>
                                            <li><b>${carparkDescription}</b></li>
                                            <li><b>Type:</b> ${carParkType}</li>
                                            <li><b>Parking Limit:</b> ${shortTermParking}</li>
                                            <li><b>Night Parking:</b> ${nightParking}</li>
                                            <li><b>Free Parking:</b> ${freeParking}</li>
                                            <li><b>Cashcard:</b> ${parkingSystemType}</li>
                                        </div>`)
                            .openOn(map);
                    })
                }
            })
    }


    function fetchUserInput1() {
        userText = $('#userTextInput1').val();
        console.log(userText);
        $('#mapPage').show();
        homepage.classList.add('hidden');

        const onMapParams = new URLSearchParams({
            searchVal: userText,
            returnGeom: 'Y',
            getAddrDetails: 'Y'
        })
        const oneMapURL = `https://developers.onemap.sg/commonapi/search?${onMapParams.toString()}`;

        fetch(oneMapURL)
            .then(response => response.json())
            .then(data => {
                mapLat = data.results[0].LATITUDE;
                mapLong = data.results[0].LONGTITUDE;
                marker = new L.Marker([mapLat, mapLong], { bounceOnAdd: false }).addTo(map);
                let popup = L.popup()
                    .setLatLng([mapLat, mapLong])
                    .setContent('You are here!')
                    .openOn(map);
                map.setView([mapLat, mapLong], 17);
                console.log(mapLat, mapLong);
            }).catch(error => console.log(error));

    }

    function fetchUserInput2() {
        userText = $('#userTextInput2').val();
        console.log(userText);
        $('#mapPage').show();
        homepage.classList.add('hidden');

        const onMapParams = new URLSearchParams({
            searchVal: userText,
            returnGeom: 'Y',
            getAddrDetails: 'Y'
        })
        const oneMapURL = `https://developers.onemap.sg/commonapi/search?${onMapParams.toString()}`;


        fetch(oneMapURL)
            .then(response => response.json())
            .then(data => {
                mapLat = data.results[0].LATITUDE;
                mapLong = data.results[0].LONGTITUDE;
                marker = new L.Marker([mapLat, mapLong], { bounceOnAdd: false }).addTo(map);
                let popup = L.popup()
                    .setLatLng([mapLat, mapLong])
                    .setContent('You are here!')
                    .openOn(map);
                map.setView([mapLat, mapLong], 17);
                console.log(mapLat, mapLong);
            }).catch(error => console.log(error));
    }

    function fetchUserInputAuto() {
        navigator.geolocation.getCurrentPosition(showPosition);
        $('#mapPage').show();
        homepage.classList.add('hidden');

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
    }

    createMap();
    parkingThemeDetails();
    $('#mapPage').hide();

    // function ThemeDetails() {
    //     $.$.ajax({
    //         url: 'https://developers.onemap.sg/privateapi/themesvc/retrieveTheme?queryName=hdb_car_park_information&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjUzMjksInVzZXJfaWQiOjUzMjksImVtYWlsIjoieGxhenVyZWx4QGdtYWlsLmNvbSIsImZvcmV2ZXIiOmZhbHNlLCJpc3MiOiJodHRwOlwvXC9vbTIuZGZlLm9uZW1hcC5zZ1wvYXBpXC92MlwvdXNlclwvc2Vzc2lvbiIsImlhdCI6MTU5NzY0Nzg4MSwiZXhwIjoxNTk4MDc5ODgxLCJuYmYiOjE1OTc2NDc4ODEsImp0aSI6ImYxN2RlNGQ2YmYxNzMyYjQ5YjM4NTc2YzU5OWM2OGNiIn0.Gnm8uI2a4epvdeBE8lKyU2-JOItCtA7-Ake36tiSOog',
    //         success: function(result) {
    //             //Set result to a variable for writing
    //             var TrueResult = JSON.stringify(result);
    //             document.write(TrueResult);
    //         }
    //     });
    // }

    // ThemeDetails();

})