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
    let carparkIcon = '/TGC-Project2/assets/images/car.png'; //Using local as oneMap API .png returned as 404
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
    let dateMt = ('0' + (date.getMonth() + 1)).slice(-2);
    let dateDay = ('0' + date.getDate()).slice(-2);
    let dateHr = date.getHours();
    let dateMin = date.getMinutes();
    let dateTime = `${dateYr}-${dateMt}-${dateDay}T${dateHr}:${dateMin}:00`;

    // Date Time Testing for Input Params for Data Gov SG Carpark Availability API
    // console.log(date);
    // console.log(dateYr);
    // console.log(dateMt);
    // console.log(dateDay);
    // console.log(dateHr);
    // console.log(dateMin);
    //console.log(dateTime); For Checking Date_time Param Data Gov SG API

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

    //Map creation function call
    createMap();

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

    // Creating a new API Token for oneMap
    function apiTokenCall() {
        return [$.ajax(settings).done(function(response) {
            responseJson = JSON.parse(response); //convert to JSON format
            apiToken = responseJson.access_token; // Assigning variable to api key
            //console.log(response); // returned as string
            //console.log(responseJson); //checking JSON format
            //console.log(apiToken); //checking api key

        }, $(document).ajaxError(function() {
            location.reload();
        }))]
    }

    // Calling API Data when API Token Call is done
    $.when.apply($, apiTokenCall()).then(function() {
        let onMapThemeParams = new URLSearchParams({
            queryName: "hdb_car_park_information",
            token: apiToken,
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
        async function oneMapAPIData() {
            return await fetch(oneMapThemeURL).then((themeResp) =>
                themeResp.json()
            );
        }

        // ES6 Fetch API for dataSgURL
        async function dataSGData() {
            return await fetch(dataSgURL).then((dataSGRes) => dataSGRes.json());
        }

        // Return all Promise checker before moving on
        function getApiData() {
            return Promise.all([oneMapAPIData(), dataSGData()]);
        }

        // Once Promise Checker is Done, then extract Data
        getApiData().then(([themeResp, dataSGRes]) => {
            // API 1: Sorting Data from oneMapTheme API into Arrays
            for (let i = 1; i < themeResp.SrchResults.length; i++) {
                carparkName.push(themeResp.SrchResults[i].NAME);
                latLng.push(themeResp.SrchResults[i].LatLng);
                carparkDescription.push(themeResp.SrchResults[i].DESCRIPTION);
                carParkType.push(themeResp.SrchResults[i].CAR_PARK_TYPE);
                shortTermParking.push(themeResp.SrchResults[i].SHORT_TERM_PARKING);
                nightParking.push(themeResp.SrchResults[i].NIGHT_PARKING);
                freeParking.push(themeResp.SrchResults[i].FREE_PARKING);
                parkingSystemType.push(
                    themeResp.SrchResults[i].TYPE_OF_PARKING_SYSTEM
                );
                // iconURL = themeResp.SrchResults[i].ICON_NAME; //returns 404
            }

            // Testing data from oneMapTheme API are in arrays if Async/Await worked
            // console.log(latLng);
            // console.log(iconURL);
            // console.log(carParkType);
            // console.log(shortTermParking);
            // console.log(nightParking);
            // console.log(freeParking);
            // console.log(parkingSystemType);

            // API 2: Sorting Data from DataSG API into Arrays
            for (let i = 0; i < dataSGRes.items[0].carpark_data.length; i++) {
                carParkNumber.push(dataSGRes.items[0].carpark_data[i].carpark_number);
                totalLots.push(
                    dataSGRes.items[0].carpark_data[i].carpark_info[0].total_lots
                );
                availableLots.push(
                    dataSGRes.items[0].carpark_data[i].carpark_info[0].lots_available
                );
            }

            // Testing data from DataSG API are in array if Async/Await worked
            // console.log(carparkName);
            // console.log(totalLots);
            // console.log(availableLots);
            // console.log(data);

            // Combining API Data to new ObjectArray
            // Object JSON Creation for Compounding Data Retrieved from all APIs
            function apiData(name) {
                let o = new Object();
                let firstIndex = carparkName.indexOf(name);
                let secondIndex = carParkNumber.indexOf(name);
                //From oneMapAPI
                o.name = name;
                o.description = carparkDescription[firstIndex];
                o.latlng = latLng[firstIndex];
                o.type = carParkType[firstIndex];
                o.shortTerm = shortTermParking[firstIndex];
                o.night = nightParking[firstIndex];
                o.free = freeParking[firstIndex];
                o.system = parkingSystemType[firstIndex];
                //From DataSG API
                o.tlots = totalLots[secondIndex];
                o.alots = availableLots[secondIndex];
                return o;
            }

            for (name of carparkName) {
                // console.log(name); //checking if loop works
                compoundData.push(apiData(name));
            }

            //Spliting Latlng data into Lat and Lng
            for (let i = 0; i < compoundData.length; i++) {
                let geo = compoundData[i].latlng.split(",");
                geoParts.push({ lat: geo[0], lng: geo[1] });
            }

            // Testing Data Split
            // console.log(geoParts);
            // console.log(geoParts[0].lat);
            // console.log(geoParts[0].lng);

            // Hide Map Page only after API call is made, ensuring map is loaded properly
            $("#mapPage").hide();
        });

        // console.log(compoundData); //Testing for Compound Data from two API into 1 Array(object)
        // console.log(compoundData[0].alots);

        // Put carpark Icon Markers whose Lat Lng is within Circle Marker bounds Argument with pop up of details
        function setMarkerInfo(circleMarker) {
            for (let i = 0; i < compoundData.length; i++) {
                themeMarker = new L.Marker([geoParts[i].lat, geoParts[i].lng], {
                    icon: parkingMapIcons,
                });
                themeMarker.on("click", function() {
                    //console.log("marker clicked"); //testing on click function on markers
                    map.closePopup();
                    let popup = L.popup({ maxWidth: "auto" })
                        .setLatLng([geoParts[i].lat, geoParts[i].lng])
                        .setContent(
                            `   <div id="markerPopup">
                                        <ul id="pop-list">
                                            <li id="list-name"><b>${compoundData[i].description} - ${compoundData[i].name}</b></li>
                                            <li class="list-info"><b>Type:</b>           ${compoundData[i].type}</li>
                                            <li class="list-info"><b>Parking Limit:</b>  ${compoundData[i].shortTerm}</li>
                                            <li class="list-info"><b>Night Parking:</b>  ${compoundData[i].night}</li>
                                            <li class="list-info"><b>Free Parking:</b>   ${compoundData[i].free}</li>
                                            <li class="list-info"><b>Cashcard:</b>       ${compoundData[i].system}</li>
                                            <li class="list-info" id="list-info-tlots"><b>Total Lots:</b>     ${compoundData[i].tlots}</li>
                                            <li id="list-avail"><b>Available Parking Left:</b><br /><h5>${compoundData[i].alots}</h5>Take your time...Ample space available</li>
                                            </ul>
                                    </div>`
                        )
                        // Insert to list to Test for Lat Lng Accuracy to Location
                        //<li><b>LatLng:</b> ${compoundData[i].latlng}</li>
                        //<li><b>Lat + Lng:</b> ${geoParts[i].lat} , ${geoParts[i].lng}</li>
                        .openOn(map);

                    // UX/UI Color change to indicate medium/low amount of parking lots left
                    // Have to setTimeout as the code run async and the popup is slower
                    setTimeout(function() {
                        let alot = compoundData[i].alots;
                        let tlot = compoundData[i].tlots;
                        // console.log(alot);
                        // console.log(tlot);
                        if ((tlot - alot) / tlot > 0.9) {
                            $("#list-avail").css({ background: "red" });
                            $("#list-avail").html(
                                `<b>Available Parking Left:</b><br/><h5>${compoundData[i].alots}</h5>Hurry! Running out of Space!!!`
                            );
                        } else if ((tlot - alot) / tlot > 0.7) {
                            $("#list-avail").css({ background: "orangered" });
                            $("#list-avail").html(
                                `<b>Available Parking Left:</b><br/><h5>${compoundData[i].alots}</h5>Quickly! Spacing running out fast!`
                            );
                        } else if ((tlot - alot) / tlot > 0.5) {
                            $("#list-avail").css({ background: "orange" });
                            $("#list-avail").html(
                                `<b>Available Parking Left:</b><br/><h5>${compoundData[i].alots}</h5>Not going to hurry you...`
                            );
                        }

                        //Changing undefined returned value to N/A
                        if (alot == undefined) {
                            $("#list-avail").html(
                                "<b>Available Parking Left:</b><br/><h5>N/A</h5>Coupon Parking or Cannot access information"
                            );
                            $("#list-info-tlots").html(
                                "<b>Total Lots:</b> N/A"
                            );
                        }
                    }, 215);
                });

                // Display Markers Only when LatLng of Data is within circleMarker LatLng Bounds
                if (circleMarker.contains(themeMarker.getLatLng()) == true) {
                    themeMarker.addTo(markersLayer);
                    // Display All Marker Summary to Info Summary Table *only on 768px width View and above; change undefined to NA
                    let alot = compoundData[i].alots;
                    if (alot == undefined) {
                        $("#info-list tbody").append(
                            `<tr class="collapse row1"><td class="row-des"><b>${compoundData[i].description}</b></td><td class="row-alots">N/A</td></tr>`
                        );
                    } else {
                        $("#info-list tbody").append(
                            `<tr class="collapse row1"><td class="row-des"><b>${compoundData[i].description}</b></td><td class="row-alots">${compoundData[i].alots}</td></tr>`
                        );
                    }

                    // Trying to get color coding to work in summary

                    // let tlot = compoundData[i].tlots;

                    // console.log(alot)
                    // console.log(tlot)
                    // if ((tlot - alot) / tlot > 0.9 || alot == undefined) {
                    //     $(".row-alots").css({ background: "red" });
                    // } else if ((tlot - alot) / tlot > 0.7) {
                    //     $(".row-alots").css({ background: "orangered" });
                    // } else if ((tlot - alot) / tlot > 0.5) {
                    //     $(".row-alots").css({ background: "orange" });
                    // } else {
                    //     $(".row-alots").css({ background: "green" });
                    // }


                }
            }
            markersLayer.addTo(map);
        }

        // Change the Title of Info Summary Table to Expand or Collapse on Click
        $("#table-oc").on("click", function() {
            $("#table-oc").html("[Click to Collapse]");
            if ($(".row1").hasClass("show")) {
                $("#table-oc").html("[Click to Expand]");
            }
        });

        // Return to Main Page when clicking Iconon Map Page
        $("#mapInfoIcon").on("click", function() {
            homepage.classList.remove("hidden");
            $("#mapPage").hide();
        });

        // Button Tracking and Key press tracking for Search
        $("#userInputBtn").on("click", fetchUserInputAuto);
        $("#userTextInput1").keydown(function(e) {
            let keyPressed = event.keyCode || event.which;
            if (keyPressed === 13) {
                fetchUserInput1();
                $("#userTextInput1").val("");
            }
        });
        $("#userTextInput2").keydown(function(e) {
            let keyPressed = event.keyCode || event.which;
            if (keyPressed === 13) {
                fetchUserInput2();
                $("#userTextInput2").val("");
            }
        });

        // Main Page Text-box Search Call
        function fetchUserInput1() {
            userText = $("#userTextInput1").val();
            // console.log(userText); // Checking Input Value on Front Page
            $("#mapPage").show();
            homepage.classList.add("hidden");
            //Reset Markers on Map to new Circle Boundary
            markersLayer.clearLayers();
            //Reset Information Summary on Map
            if ($(".row1").hasClass("show")) {
                $(".row1").removeClass("show");
                $("#info-list tbody").empty();
            } else {
                $("#info-list tbody").empty();
            }

            let onMapParams = new URLSearchParams({
                searchVal: userText,
                returnGeom: "Y",
                getAddrDetails: "Y",
            });
            let oneMapURL = `https://developers.onemap.sg/commonapi/search?${onMapParams.toString()}`;

            fetch(oneMapURL)
                .then((response) => response.json())
                .then((data) => {
                    mapLat = data.results[0].LATITUDE;
                    mapLong = data.results[0].LONGTITUDE;
                    marker = new L.Marker([mapLat, mapLong], {
                        bounceOnAdd: false,
                    }).addTo(markersLayer);
                    let popup = L.popup()
                        .setLatLng([mapLat, mapLong])
                        .setContent(
                            `<h6>You are here:</h6><br/><b><h3 style="text-transform: capitalize"> ${userText} </h3><b>`
                        )
                        .openOn(map);
                    map.setView([mapLat, mapLong], 16);
                    let circleMarker = new L.circle([mapLat, mapLong], 500).addTo(
                        markersLayer
                    );
                    markersLayer.addTo(map);
                    map.fitBounds(circleMarker.getBounds());
                    setMarkerInfo(circleMarker);
                    //console.log(latLng); For Point Location Accuracy Checking
                    //console.log(mapLat, mapLong); For Point Location Accuracy Checking
                })
                .catch((error) => alert(error));
        }

        // Map Page Text-box Search Call
        function fetchUserInput2() {
            userText = $("#userTextInput2").val();
            // console.log(userText); // Checking Input Value on Map Page
            //Reset Markers on Map to new Circle Boundary
            markersLayer.clearLayers();
            //Reset Information Summary on Map
            if ($(".row1").hasClass("show")) {
                $(".row1").removeClass("show");
                $("#info-list tbody").empty();
            } else {
                $("#info-list tbody").empty();
            }

            let onMapParams = new URLSearchParams({
                searchVal: userText,
                returnGeom: "Y",
                getAddrDetails: "Y",
            });
            let oneMapURL = `https://developers.onemap.sg/commonapi/search?${onMapParams.toString()}`;

            fetch(oneMapURL)
                .then((response) => response.json())
                .then((data) => {
                    mapLat = data.results[0].LATITUDE;
                    mapLong = data.results[0].LONGTITUDE;
                    marker = new L.Marker([mapLat, mapLong], {
                        bounceOnAdd: false,
                    }).addTo(markersLayer);
                    let popup = L.popup()
                        .setLatLng([mapLat, mapLong])
                        .setContent(
                            `<h6>You are here:</h6><br/><b><h3 style="text-transform: capitalize"> ${userText} </h3><b>`
                        )
                        .openOn(map);
                    map.setView([mapLat, mapLong], 16);
                    let circleMarker = new L.circle([mapLat, mapLong], 500).addTo(
                        markersLayer
                    );
                    markersLayer.addTo(map);
                    map.fitBounds(circleMarker.getBounds());
                    setMarkerInfo(circleMarker);
                    //console.log(latLng); For Point Location Accuracy Checking
                    //console.log(mapLat, mapLong); For Point Location Accuracy Checking
                })
                .catch((error) => alert(error));
        }

        // Main Page Using Geolocation(GPS) Search Call
        function fetchUserInputAuto() {
            navigator.geolocation.getCurrentPosition(showPosition);
            $("#mapPage").show();
            homepage.classList.add("hidden");
            //Reset Markers on Map to new Circle Boundary
            markersLayer.clearLayers();
            //Reset Information Summary on Map
            if ($(".row1").hasClass("show")) {
                $(".row1").removeClass("show");
                $("#info-list tbody").empty();
            } else {
                $("#info-list tbody").empty();
            }

            function showPosition(position) {
                autoLat = position.coords.latitude;
                autoLng = position.coords.longitude;
                marker = new L.Marker([autoLat, autoLng], {
                    bounceOnAdd: false,
                }).addTo(markersLayer);
                var popup = L.popup()
                    .setLatLng([autoLat, autoLng])
                    .setContent(
                        `<h6>You are here:</h6><br/><b><h3 style="text-transform: capitalize"> GPS Location </h3><b>`
                    )
                    .openOn(map);
                map.setView([autoLat, autoLng], 16);
                let circleMarker = new L.circle([autoLat, autoLng], 500).addTo(
                    markersLayer
                );
                markersLayer.addTo(map);
                map.fitBounds(circleMarker.getBounds());
                setMarkerInfo(circleMarker);
                //console.log(autoLat, autoLng); For Point Location Accuracy Checking
            }
        }
    })

    //Loading Screen Timer and Reset to enesure API is properly called
    setTimeout(function() {
        if (window.localStorage) {
            if (!localStorage.getItem("reloaded")) {
                localStorage["reloaded"] = true;
                location.reload();
            } else {
                $("#loadingScreen").hide();
                localStorage.removeItem("reloaded");
            }
        }
    }, 3000)



})