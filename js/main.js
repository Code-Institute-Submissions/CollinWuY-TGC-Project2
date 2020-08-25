$(document).ready(function() {
    //Global variable declarations
    let apiToken;
    let map;
    let homepage = document.querySelector('#homePage');
    let mapLong;
    let mapLat;
    let autoLat;
    let autoLng;
    let userText;
    let latLng = [];
    let geoParts = [];
    let carparkIcon = "../TGC-Project2/assets/images/car.png";
    let parkingMapIcons;
    let carparkDescription = [];
    let carParkType = [];
    let shortTermParking = [];
    let nightParking = [];
    let freeParking = [];
    let parkingSystemType = [];

    L.Circle.include({
        contains: function(latLng) {
            return this.getLatLng().distanceTo(latLng) < this.getRadius();
        }
    });

    //Api Key Generation
    var form = new FormData();
    form.append("email", "xlazurelx@gmail.com");
    form.append("password", "Collin123");

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://developers.onemap.sg/privateapi/auth/post/getToken",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    }

    $.ajax(settings).done(function(response) {
        //console.log(response); // returned as string
        responseJson = JSON.parse(response); //convert to JSON format
        //console.log(responseJson); //checking JSON format
        apiToken = responseJson.access_token; // Assigning variable to api key
        //console.log(apiToken); //checking api key

        parkingMapIcons = L.icon({
            iconUrl: carparkIcon,
            iconSize: [40, 40],
            iconAnchor: [10, 35],
            popupAnchor: [-3, -76]
        })

        const createMap = async function() {
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



        // function parkingThemeDetails() {

        //     const onMapThemeParams = new URLSearchParams({
        //         queryName: 'hdb_car_park_information',
        //         token: apiToken
        //     });
        //     const oneMapThemeURL = `https://developers.onemap.sg/privateapi/themesvc/retrieveTheme?${onMapThemeParams.toString()}`;

        //     fetch(oneMapThemeURL)
        //         .then(themeResp => themeResp.json())
        //         .then(data => {
        //             for (let i = 1; i < data.SrchResults.length; i++) {
        //                 // Retrieve DATA from OneMap Theme API
        //                 latLng.push(data.SrchResults[i].LatLng);
        //                 iconURL = data.SrchResults[i].ICON_NAME;
        //                 carparkDescription.push(data.SrchResults[i].DESCRIPTION);
        //                 carParkType.push(data.SrchResults[i].CAR_PARK_TYPE);
        //                 shortTermParking.push(data.SrchResults[i].SHORT_TERM_PARKING);
        //                 nightParking.push(data.SrchResults[i].NIGHT_PARKING);
        //                 freeParking.push(data.SrchResults[i].FREE_PARKING);
        //                 parkingSystemType.push(data.SrchResults[i].TYPE_OF_PARKING_SYSTEM);
        //             }
        //             // Testing Data Retrieval
        //             /*
        //             console.log(latLng);
        //             console.log(iconURL);
        //             console.log(carParkType);
        //             console.log(shortTermParking);
        //             console.log(nightParking);
        //             console.log(freeParking);
        //             console.log(parkingSystemType);
        //             */

        //             //Map Marker Creation for each data
        //             for (let i = 0; i < latLng.length; i++) {
        //                 geoParts.push(latLng[i].split(","));
        //                 // console.log(geoParts);
        //             }

        //             for (let i = 0; i < geoParts.length; i++) {
        //                 themeMarker = new L.Marker([parseFloat(geoParts[i][0]), parseFloat(geoParts[i][1])], { icon: parkingMapIcons });



        //                 themeMarker.on('click', function () {
        //                     console.log("marker clicked"); //testing on click function on markers
        //                     let popup = L.popup()
        //                         .setLatLng([parseFloat(geoParts[i][0]), parseFloat(geoParts[i][1])])
        //                         .setContent(`<div id="markerPopup">
        //                                 <ul>
        //                                     <li><b>${carparkDescription[i]}</b></li>
        //                                     <li><b>Type:</b> ${carParkType[i]}</li>
        //                                     <li><b>Parking Limit:</b> ${shortTermParking[i]}</li>
        //                                     <li><b>Night Parking:</b> ${nightParking[i]}</li>
        //                                     <li><b>Free Parking:</b> ${freeParking[i]}</li>
        //                                     <li><b>Cashcard:</b> ${parkingSystemType[i]}</li>
        //                                 </div>`)
        //                         .openOn(map);

        //                 })

        //             }


        //         })
        // }

        function fetchUserInput1() {
            userText = $('#userTextInput1').val();
            console.log(userText);
            $('#mapPage').show();
            homepage.classList.add('hidden');

            let onMapParams = new URLSearchParams({
                searchVal: userText,
                returnGeom: 'Y',
                getAddrDetails: 'Y'
            })
            let oneMapURL = `https://developers.onemap.sg/commonapi/search?${onMapParams.toString()}`;

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
                    let circleMarker = new L.circle([mapLat, mapLong], 500).addTo(map);
                    map.fitBounds(circleMarker.getBounds());
                    setMarkerInfo(circleMarker);
                    console.log(latLng);
                    console.log(mapLat, mapLong);
                }).catch(error => console.log(error));

        }

        function fetchUserInput2() {
            userText = $('#userTextInput2').val();
            console.log(userText);

            let onMapParams = new URLSearchParams({
                searchVal: userText,
                returnGeom: 'Y',
                getAddrDetails: 'Y'
            })
            let oneMapURL = `https://developers.onemap.sg/commonapi/search?${onMapParams.toString()}`;

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
                    let circleMarker = new L.circle([mapLat, mapLong], 500).addTo(map);
                    map.fitBounds(circleMarker.getBounds());
                    setMarkerInfo(circleMarker);
                    console.log(latLng);
                    console.log(mapLat, mapLong);
                }).catch(error => console.log(error));
        }


        function fetchUserInputAuto() {
            navigator.geolocation.getCurrentPosition(showPosition);
            $('#mapPage').show();
            homepage.classList.add('hidden');

            function showPosition(position) {
                autoLat = position.coords.latitude;
                autoLng = position.coords.longitude;
                marker = new L.Marker([autoLat, autoLng], {
                    bounceOnAdd: false
                }).addTo(map);
                var popup = L.popup()
                    .setLatLng([autoLat, autoLng])
                    .setContent('You are here!')
                    .openOn(map);
                map.setView([autoLat, autoLng], 17);
                let circleMarker = new L.circle([autoLat, autoLong], 500).addTo(map);
                map.fitBounds(circleMarker.getBounds());
                setMarkerInfo(circleMarker);
                console.log(autoLat, autoLng);
            }
        }


        function parkingThemeDetails() {
            let onMapThemeParams = new URLSearchParams({
                queryName: 'hdb_car_park_information',
                token: apiToken
            });
            let oneMapThemeURL = `https://developers.onemap.sg/privateapi/themesvc/retrieveTheme?${onMapThemeParams.toString()}`;


            fetch(oneMapThemeURL)
                .then(themeResp => themeResp.json())
                .then(data => {
                    for (let i = 1; i < data.SrchResults.length; i++) {
                        // Retrieve DATA from OneMap Theme API
                        latLng.push(data.SrchResults[i].LatLng);
                        // iconURL = data.SrchResults[i].ICON_NAME;
                        carparkDescription.push(data.SrchResults[i].DESCRIPTION);
                        carParkType.push(data.SrchResults[i].CAR_PARK_TYPE);
                        shortTermParking.push(data.SrchResults[i].SHORT_TERM_PARKING);
                        nightParking.push(data.SrchResults[i].NIGHT_PARKING);
                        freeParking.push(data.SrchResults[i].FREE_PARKING);
                        parkingSystemType.push(data.SrchResults[i].TYPE_OF_PARKING_SYSTEM);
                    }
                    // Testing Data Retrieval
                    /*
                    console.log(latLng);
                    console.log(iconURL);
                    console.log(carParkType);
                    console.log(shortTermParking);
                    console.log(nightParking);
                    console.log(freeParking);
                    console.log(parkingSystemType);
                    */

                    //Map Marker Creation for each data
                    for (let i = 0; i < latLng.length; i++) {
                        geoParts.push(latLng[i].split(","));
                        // console.log(geoParts);
                    }

                })

        }

        function setMarkerInfo(circleMarker) {
            for (let i = 0; i < geoParts.length; i++) {
                themeMarker = new L.Marker([parseFloat(geoParts[i][0]), parseFloat(geoParts[i][1])], { icon: parkingMapIcons });
                themeMarker.on('click', function() {
                    console.log("marker clicked"); //testing on click function on markers
                    let popup = L.popup()
                        .setLatLng([parseFloat(geoParts[i][0]), parseFloat(geoParts[i][1])])
                        .setContent(`<div id="markerPopup">
                                        <ul>
                                            <li><b>${carparkDescription[i]}</b></li>
                                            <li><b>Type:</b> ${carParkType[i]}</li>
                                            <li><b>Parking Limit:</b> ${shortTermParking[i]}</li>
                                            <li><b>Night Parking:</b> ${nightParking[i]}</li>
                                            <li><b>Free Parking:</b> ${freeParking[i]}</li>
                                            <li><b>Cashcard:</b> ${parkingSystemType[i]}</li>
                                        </div>`)
                        .openOn(map);

                })
                if (circleMarker.contains(themeMarker.getLatLng()) == true) {
                    themeMarker.addTo(map);
                }

            }
        }




        createMap();
        parkingThemeDetails();
        $('#mapPage').hide();


    });

})