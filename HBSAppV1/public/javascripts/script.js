$( document ).ready(function() {

    function loadJSON(callback) {

        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("../json/");
        xobj.open('GET', '../json/data.json', true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {

                // .open will NOT return a value but simply returns undefined in async mode so use a callback
                callback(xobj.responseText);

            }
        }
        xobj.send(null);

    }

// Call to function with anonymous callback
    loadJSON(function (response) {

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


    });


/*========================Audio====================================================*/
    var SuccesAudio = "../audio/162473-successful.mp3";
    $('#image_rock,#image_paper,#image_scissor').click(function () {
        new Audio(SuccesAudio).play();
    });

    var BackgroundMusic = "../audio/8bitBackgroundMusic.mp3";
    var BGLoop = new Audio(BackgroundMusic);
    BGLoop.loop = true;
    BGLoop.play();

    /*========================Register Page=========================================*/
    $('#UsernameplayButton').click(function () {
        if ($('#userNameInput').val() != null && $('#userNameInput').val() != "" ){
            console.log($('#userNameInput').val())
            console.log(jsonresponse.Connecten.ConnectString);
            window.location.href = jsonresponse.Connecten.ConnectString + "/room?name=" + $('#userNameInput').val();
        } else {
            console.log("Geen valide waarde")
        }
    });
});