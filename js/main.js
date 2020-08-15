$(document).ready(function() {
    const successCallBack = (position) => console.log(position);
    const errorCallBack = (error) => console.error(error);

    $('#user-input').on('click', function() {
        navigator.geolocation.getCurrentPosition(successCallBack, errorCallBack);

        const onMapParams = new URLSearchParams({
            searchVal: 'URA',
            returnGeom: 'Y',
            getAddrDetails: 'Y'
        })
        const oneMapURL = `https://developers.onemap.sg/commonapi/search?${onMapParams.toString()}`;

        fetch(oneMapURL)
            .then(response => response.json())
            .then(data => mapLong = data.results[0].LONGTITUDE)
            .then(() => console.log(mapLong));

        fetch(oneMapURL)
            .then(response => response.json())
            .then(data => mapLat = data.results[0].LATITUDE)
            .then(() => console.log(mapLat));

    })
})