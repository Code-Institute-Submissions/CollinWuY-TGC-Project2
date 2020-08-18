$(document).ready(function() {
    $('#mapPage').hide();


    const createMap = function() {
        const center = L.bounds([1.56073, 104.11475], [1.16, 103.502]).getCenter();
        const map = L.map('mapdiv').setView([center.x, center.y], 11);

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

    createMap();



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
        let homepage = document.querySelector('#homepage');
        homepage.classList.remove('hidden');
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
        let userText = $('#userTextInput1').val();
        console.log(userText);

        let homepage = document.querySelector('#homepage');
        homepage.classList.add('hidden');
        let mappage = document.querySelector('#mapPage');
        mappage.classList.remove('hidden');

        const onMapParams = new URLSearchParams({
            searchVal: userText,
            returnGeom: 'Y',
            getAddrDetails: 'Y'
        })

        const oneMapURL = `https://developers.onemap.sg/commonapi/search?${onMapParams.toString()}`;
        const oneMapThemeURL = `https://developers.onemap.sg/privateapi/themesvc/retrieveTheme?${onMapThemeParams.toString()}`;

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
                const onMapThemeParams = new URLSearchParams({
                    queryName: 'hdb_car_park_information',
                    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjUzMjksInVzZXJfaWQiOjUzMjksImVtYWlsIjoieGxhenVyZWx4QGdtYWlsLmNvbSIsImZvcmV2ZXIiOmZhbHNlLCJpc3MiOiJodHRwOlwvXC9vbTIuZGZlLm9uZW1hcC5zZ1wvYXBpXC92MlwvdXNlclwvc2Vzc2lvbiIsImlhdCI6MTU5NzY0Nzg4MSwiZXhwIjoxNTk4MDc5ODgxLCJuYmYiOjE1OTc2NDc4ODEsImp0aSI6ImYxN2RlNGQ2YmYxNzMyYjQ5YjM4NTc2YzU5OWM2OGNiIn0.Gnm8uI2a4epvdeBE8lKyU2-JOItCtA7-Ake36tiSOog'
                });
                fetch(oneMapThemeURL)
                    .then(themeResp => {
                        let latLng = themeResp.SrchResults[1].LatLng;
                        console.log(latLng);
                    })
            }).catch(error => console.log(error));

    }

    function fetchUserInput2() {
        let userText = $('#userTextInput2').val();
        console.log(userText);

        const onMapParams = new URLSearchParams({
            searchVal: userText,
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

    function fetchUserInputAuto() {
        $('#mapPage').show();
        navigator.geolocation.getCurrentPosition(showPosition);
        let homepage = document.querySelector('#homepage');
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