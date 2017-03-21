$( document ).ready(function() {

    function loadJSON(callback) {

        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("../json/");
        xobj.open('GET', '../json/data.json', true);
        xobj.onreadystatechange = function() {
            if (xobj.readyState == 4 && xobj.status == "200") {

                // .open will NOT return a value but simply returns undefined in async mode so use a callback
                callback(xobj.responseText);

            }
        }
        xobj.send(null);

    }

// Call to function with anonymous callback
    loadJSON(function(response) {
        jsonresponse = JSON.parse(response);
        var connection = jsonresponse.Connecten.ConnectString;

    var socket = io.connect(connection);

    socket.on('connect', function (data) {

    });
    socket.on('heartbeat', function (data) {
        console.log(data);
    });

    socket.on('broad', function (data) {
        $('body').append("Message: " + data + "<br>");
    });

    socket.on('UpdateAmountOfPlayers', function (amount_of_players) {
        $('.player_count').html('<p>Amount of players: ' + amount_of_players + '</p>');
    });

    var room = "";

    $('form').submit(function (e) {
        e.preventDefault();
        room = $('#Room').val();
        socket.emit('Room', room);
        // dit verwijderd de join room form voor testen uitgeschakeld
//     $('form').html('');
        console.log("User joined room: " + room);
    });

    $('#call').click(function () {
        socket.emit('Call', room);
        console.log('calling');
    });

    socket.on('message', function (data) {
        alert(data);
        console.log('incoming message: ', data);
    });

// Added since first release
    $('#image_scissor').click(function () {
        console.log("Schaar geklikt!")
        socket.emit('choice', "scissor");
        $('.choices').addClass('hide');
    });

    $('#image_paper').click(function () {
        console.log("Papier geklikt!")
        socket.emit('choice', "paper");
        $('.choices').addClass('hide');
    });

    $('#image_rock').click(function () {
        console.log("Steen geklikt!")
        socket.emit('choice', "rock");
        $('.choices').addClass('hide');
    });

    socket.on('choice', function (data, user_id) {
        $('body').append("keuze: " + data + " " + user_id + "<br>");
    });

    /*Audio*/
    var SuccesAudio = "../audio/162473-successful.mp3";
    $('#image_rock,#image_paper,#image_scissor').click(function () {
        var succesclick = new Audio(SuccesAudio)
        succesclick.play();
    });

    var BackgroundMusic = "../audio/8bitBackgroundMusic.mp3";
    var BGLoop = new Audio(BackgroundMusic);
    BGLoop.loop = true;
    BGLoop.play();

    });

});
