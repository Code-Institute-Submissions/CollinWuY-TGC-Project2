$(document).ready(function() {
    //Global variable declarations
    let apiToken;
    let map;
    let markersLayer;
    let homepage = document.querySelector('#homePage');
    let mapLong;
    let mapLat;
    let autoLat;
    let autoLng;
    let userText;
    let carparkName = [];
    let carParkNumber = [];
    let totalLots = [];
    let availableLots = [];
    let latLng = [];
    let geoParts = [];
    let carparkIcon = "../assets/images/car.png"; //Using local as oneMap API .png returned as 404
    let parkingMapIcons;
    let carparkDescription = [];
    let carParkType = [];
    let shortTermParking = [];
    let nightParking = [];
    let freeParking = [];
    let parkingSystemType = [];
    let compoundData = [];

    let date = new Date();
    let dateYr = date.getFullYear();
    let dateMt = "0" + (date.getMonth() + 1);
    let dateDay = date.getDate();
    let dateHr = date.getHours();
    let dateMin = date.getMinutes();
    let dateTime = `${dateYr}-${dateMt}-${dateDay}T${dateHr}:${dateMin}:00`;

    // Date Time Testing for Input Params for Carpark Availability API
    // console.log(date);
    // console.log(dateYr);
    // console.log(dateMt);
    // console.log(dateDay);
    // console.log(dateHr);
    // console.log(dateMin);
    // console.log(dateTime);

    //Custom Leaflet JS Circle Boundary function call
    L.Circle.include({
        contains: function(latLng) {
            return this.getLatLng().distanceTo(latLng) < this.getRadius();
        }
    });

    //Custom carpark icon settings for Leaflet JS
    parkingMapIcons = L.icon({
        iconUrl: carparkIcon,
        iconSize: [40, 40],
        iconAnchor: [10, 35],
        popupAnchor: [-3, -76]
    })

    //Map Creation at start of Webpage
    const createMap = async function() {
        const center = L.bounds([1.56073, 104.11475], [1.16, 103.502]).getCenter();
        map = L.map('mapdiv').setView([center.x, center.y], 12);
        markersLayer = new L.LayerGroup();

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

    //Map creation function call then hiding map to give 1 page look
    createMap();
    $('#mapPage').hide();


    //Api Key Generation for oneMapAPI
    var form = new FormData();
    form.append("email", "xlazurelx@gmail.com");
    form.append("password", "Collin123");

    //Settings for AJAX call function (primary to call API Key from oneMap first)
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
        responseJson = JSON.parse(response); //convert to JSON format
        apiToken = responseJson.access_token; // Assigning variable to api key
        //console.log(response); // returned as string
        //console.log(responseJson); //checking JSON format
        //console.log(apiToken); //checking api key

        // async function parkingThemeDetails() {
        let onMapThemeParams = new URLSearchParams({
            queryName: 'hdb_car_park_information',
            token: apiToken
        });

        let oneMapThemeURL = `https://developers.onemap.sg/privateapi/themesvc/retrieveTheme?${onMapThemeParams.toString()}`;
        let dataSgURL = `https://api.data.gov.sg/v1/transport/carpark-availability?${dateTime}`;

        //Reset all arrays for oneMapTheme API
        carparkName = [];
        latLng = [];
        carparkDescription = [];
        carParkType = [];
        shortTermParking = [];
        nightParking = [];
        freeParking = [];
        parkingSystemType = [];

        //Reset all arrays for Data SG API
        carParkNumber = [];
        totalLots = [];
        availableLots = [];

        // ES6 Fetch API for oneMapThemeURL
        fetch(oneMapThemeURL)
            .then(themeResp => themeResp.json())
            .then(data => {
                for (let i = 1; i < data.SrchResults.length; i++) {
                    // Retrieve DATA from OneMap Theme API
                    carparkName.push(data.SrchResults[i].NAME);
                    latLng.push(data.SrchResults[i].LatLng);
                    carparkDescription.push(data.SrchResults[i].DESCRIPTION);
                    carParkType.push(data.SrchResults[i].CAR_PARK_TYPE);
                    shortTermParking.push(data.SrchResults[i].SHORT_TERM_PARKING);
                    nightParking.push(data.SrchResults[i].NIGHT_PARKING);
                    freeParking.push(data.SrchResults[i].FREE_PARKING);
                    parkingSystemType.push(data.SrchResults[i].TYPE_OF_PARKING_SYSTEM);
                    // iconURL = data.SrchResults[i].ICON_NAME; //returns 404
                }

                // Testing Data Retrieval

                // console.log(latLng);
                // console.log(iconURL);
                // console.log(carParkType);
                // console.log(shortTermParking);
                // console.log(nightParking);
                // console.log(freeParking);
                // console.log(parkingSystemType);

                //Map Marker Creation for each data
                for (let i = 0; i < latLng.length; i++) {

                    let geo = (latLng[i].split(","));
                    geoParts.push({ "lat": geo[0], "lng": geo[1] })
                }
                // console.log(geoParts);
                // console.log(geoParts[0].lat);
                // console.log(geoParts[0].lng);
            });

        fetch(dataSgURL)
            .then(res => res.json())
            .then(data => {
                for (let i = 0; i < data.items[0].carpark_data.length; i++) {
                    carParkNumber.push(data.items[0].carpark_data[i].carpark_number);
                    totalLots.push(data.items[0].carpark_data[i].carpark_info[0].total_lots);
                    availableLots.push(data.items[0].carpark_data[i].carpark_info[0].lots_available);
                }
                // console.log(carParkNumber);
                // console.log(totalLots);
                // console.log(availableLots);
                // console.log(data);
            });

        // console.log(carparkName);

        for (let i = 0; i < carparkName.length; i++) {
            console.log(x);
        };

        // carparkName.forEach(function(x) {
        //     console.log(x);
        // });
        // }

        //Combining API Data to new ObjectArray
        //Object Creation for Data Retrieved from APIs

        // function apiData(name) {
        //     let o = new Object();
        //     let firstIndex = carparkName.indexOf(name);
        //     let secondIndex = carParkNumber.indexOf(name);
        //     //From oneMapAPI
        //     o.name = name;
        //     o.description = carparkDescription[firstIndex];
        //     o.lat = geoParts[firstIndex].lat;
        //     o.lng = geoParts[firstIndex].lng;
        //     o.type = carParkType[firstIndex];
        //     o.shortTerm = shortTermParking[firstIndex];
        //     o.night = nightParking[firstIndex];
        //     o.free = freeParking[firstIndex];
        //     o.system = parkingSystemType[firstIndex];
        //     //From DataSG API
        //     o.tlots = totalLots[secondIndex];
        //     o.alots = availableLots[secondIndex];
        //     return o
        // };

    });



    // console.log(carparkName);
    // for (let i = 0; i < carparkName.length; i++) {
    //     console.log(x);
    // };


    function setMarkerInfo(circleMarker) {
        for (let i = 0; i < geoParts.length; i++) {
            themeMarker = new L.Marker([geoParts[i].lat, geoParts[i].lng], { icon: parkingMapIcons });
            themeMarker.on('click', function() {
                //console.log("marker clicked"); //testing on click function on markers
                let popup = L.popup()
                    .setLatLng([geoParts[i].lat, geoParts[i].lng])
                    .setContent(`<div id="markerPopup">
                                        <ul>
                                            <li><b>${carparkDescription[i]} - ${carparkName[i]}</b></li>
                                            <li><b>Type:</b> ${carParkType[i]}</li>
                                            <li><b>Parking Limit:</b> ${shortTermParking[i]}</li>
                                            <li><b>Night Parking:</b> ${nightParking[i]}</li>
                                            <li><b>Free Parking:</b> ${freeParking[i]}</li>
                                            <li><b>Cashcard:</b> ${parkingSystemType[i]}</li>
                                            <li><b>Total Lots:</b> ${totalLots[i]}</li>
                                            <li><b>Available Parking Left:</b> <h5>***  ${availableLots[i]}  ***</h5></li>
                                        </div>`)
                    .openOn(map);
            });

            if (circleMarker.contains(themeMarker.getLatLng()) == true) {
                themeMarker.addTo(markersLayer);
            }
        }
        markersLayer.addTo(map);
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


    function fetchUserInput1() {
        userText = $('#userTextInput1').val();
        console.log(userText);
        $('#mapPage').show();
        homepage.classList.add('hidden');
        markersLayer.clearLayers();

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
                marker = new L.Marker([mapLat, mapLong], { bounceOnAdd: false }).addTo(markersLayer);
                let popup = L.popup()
                    .setLatLng([mapLat, mapLong])
                    .setContent(`You are here!<br/><b>* ${userText} *<b>`)
                    .openOn(map);
                map.setView([mapLat, mapLong], 17);
                let circleMarker = new L.circle([mapLat, mapLong], 500).addTo(markersLayer);
                markersLayer.addTo(map);
                map.fitBounds(circleMarker.getBounds());
                setMarkerInfo(circleMarker);
                //console.log(latLng);
                console.log(mapLat, mapLong);
            }).catch(error => console.log(error));

    }

    function fetchUserInput2() {
        userText = $('#userTextInput2').val();
        console.log(userText);
        markersLayer.clearLayers();

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
                marker = new L.Marker([mapLat, mapLong], { bounceOnAdd: false }).addTo(markersLayer);
                let popup = L.popup()
                    .setLatLng([mapLat, mapLong])
                    .setContent(`You are here!<br/><b>* ${userText} *<b>`)
                    .openOn(map);
                map.setView([mapLat, mapLong], 17);
                let circleMarker = new L.circle([mapLat, mapLong], 500).addTo(markersLayer);
                markersLayer.addTo(map);
                map.fitBounds(circleMarker.getBounds());
                setMarkerInfo(circleMarker);
                //console.log(latLng);
                console.log(mapLat, mapLong);
            }).catch(error => console.log(error));
    }


    function fetchUserInputAuto() {
        navigator.geolocation.getCurrentPosition(showPosition);
        $('#mapPage').show();
        homepage.classList.add('hidden');
        markersLayer.clearLayers();

        function showPosition(position) {
            autoLat = position.coords.latitude;
            autoLng = position.coords.longitude;
            marker = new L.Marker([autoLat, autoLng], { bounceOnAdd: false }).addTo(markersLayer);
            var popup = L.popup()
                .setLatLng([autoLat, autoLng])
                .setContent(`You are here!<br/><b>* GPS Locations *<b>`)
                .openOn(map);
            map.setView([autoLat, autoLng], 17);
            let circleMarker = new L.circle([autoLat, autoLng], 500).addTo(markersLayer);
            markersLayer.addTo(map);
            map.fitBounds(circleMarker.getBounds());
            setMarkerInfo(circleMarker);
            console.log(autoLat, autoLng);
        }
    }













})