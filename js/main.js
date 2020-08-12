$(document).ready(function() {
    const successCallBack = (position) => console.log(position);
    const errorCallBack = (error) => console.error(error);

    $('#user-input').on('click', function() {
        navigator.geolocation.getCurrentPosition(successCallBack, errorCallBack);
    })
})