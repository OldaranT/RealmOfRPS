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
    var socket = io.connect(loadJSON(function (response) {
            jsonresponse = JSON.parse(response);
            var connection = jsonresponse.Connecten.ConnectString;

            return connection;

        })
    );
    var url;
    var params;
    var string;
    var room;
    var player;
    socket.on('connect', function (data) {
        url = window.location.href;
        // alert(url);
        params = parseURLParams(url);
        room = params.Room;

        setTitle(room);
        socket.emit('gameRoomJoin', params.Name, room);
        socket.emit('users');
    });

    socket.on('Players', function (arrayN, arrayS) {
        $("#Players").html('');
        for(var p in arrayN){
            if(arrayS[p] == 0){
                $("<p>" + arrayN[p] + ": Heeft nog niet gekozen" + "</p>").appendTo($("#Players"));
            }
            else if(arrayS[p] == 1){
                $("<p>" + arrayN[p] + ": Heeft gekozen" + "</p>").appendTo($("#Players"));
            }
        }
    });

    $('#results-view').addClass('hide');

    $('#button').click(function(){
        console.log('button');
        url = window.location.href;
        params = parseURLParams(url);
        // string = JSON.stringify(params);
        string = urlString(params);
        alert('hi');
        alert(string);
    });

    function parseURLParams(url) {
        var queryStart = url.indexOf("?") + 1,
            queryEnd   = url.indexOf("#") + 1 || url.length + 1,
            query = url.slice(queryStart, queryEnd - 1),
            pairs = query.replace(/\+/g, " ").split("&"),
            parms = {}, i, n, v, nv;

        if (query === url || query === "") return;

        for (i = 0; i < pairs.length; i++) {
            nv = pairs[i].split("=", 2);
            n = decodeURIComponent(nv[0]);
            v = decodeURIComponent(nv[1]);

            if (!parms.hasOwnProperty(n)) parms[n] = [];
            parms[n].push(nv.length === 2 ? v : null);
        }
        return parms;
    }

    function urlString(params) {
        var string;
        for (var p in params){
            string += p + ' : ' + params[p] + '\n';
        }
        return string;
    }

    function setTitle(title) {
        $('#title').html('Welcome to room: ' + title);
    }

/*========================Audio====================================================*/
    var SuccesAudio = "../audio/162473-successful.mp3";
    $('#image_rock,#image_paper,#image_scissor').click(function () {
        new Audio(SuccesAudio).play();
    });

    var BackgroundMusic = "../audio/8bitBackgroundMusic.mp3";
    var BGLoop = new Audio(BackgroundMusic);
    BGLoop.loop = true;
    BGLoop.play();

/*========================Game inputs====================================================*/

    $('#image_scissor').click(function () {
        console.log("Schaar geklikt!");
        OnClickUpdate(1);
        // $('.choices img').not('#image_scissor').addClass('hide');
        $('.choices img').not('#image_scissor').animate({
            padding: "0px",
            'margin-left':'-10px',
            'height': "0px",
            'width': "0px"
        }, 500, function() {

            $(this).addClass('hide');
        });

        //Status updaten
        $('.status').fadeOut(500, function() {
            $(this).html("<b>You've chosen: Scissors</b>").fadeIn(500);
        });

    });

    $('#image_paper').click(function () {
        console.log("Papier geklikt!");
        OnClickUpdate(2);
        // $('.choices').addClass('hide');
        $('.choices img').not('#image_paper').animate({
            padding: "0px",
            'margin-left':'-10px',
            'height': "0px",
            'width': "0px"
        }, 500, function() {

            $(this).addClass('hide');
        });

        //Status updaten
        $('.status').fadeOut(500, function() {
            $(this).html("<b>You've chosen: Paper</b>").fadeIn(500);
        });
    });

    $('#image_rock').click(function () {
        console.log("Steen geklikt!");
        OnClickUpdate(3);
        //$('.choices').addClass('hide');
        $('.choices img').not('#image_rock').animate({
            padding: "0px",
            'margin-left':'-10px',
            'height': "0px",
            'width': "0px"
        }, 500, function() {

            //$(this).addClass('hide');
            $(this).remove();
        });

        //Status updaten
        $('.status').fadeOut(500, function() {
            $(this).html("<b>You've chosen: Rock</b>").fadeIn(500);
        });
    });

    function OnClickUpdate(choice) {
        socket.emit('choice', choice);
        socket.emit('updateUsers', 1, choice);
        socket.emit('users');
        socket.emit('gameStatus');
    }

    socket.on('GameData', function(arrayN, arrayP, arrayC) {
        var scissorImg = '<img id="image_scissor" src="https://cdn0.iconfinder.com/data/icons/rock-paper-scissors-emoji/792/rock-paper-scissors-emoji-cartoon-014-512.png" height="200"/>';
        var paperImg = '<img id="image_paper" src="https://cdn0.iconfinder.com/data/icons/rock-paper-scissors-emoji/792/rock-paper-scissors-emoji-cartoon-005-512.png" height="200"/>';
        var rockImg = '<img id="image_rock" src="https://cdn0.iconfinder.com/data/icons/rock-paper-scissors-emoji/792/rock-paper-scissors-emoji-cartoon-016-512.png" height="200"/>';

        $('#results').empty();
        $('#results-view').removeClass('hide');
        $('#game-view').addClass('hide');
        for(var n in arrayN){
            if(arrayC[n] == 1){
                $(scissorImg + '<div>Naam: ' + arrayN[n] + ' Punten: ' + arrayP[n] + '</div>').appendTo($("#results"));
            }else if(arrayC[n] == 2){
                $(paperImg + '<div>Naam: ' + arrayN[n] + ' Punten: ' + arrayP[n] + '</div>').appendTo($("#results"));
            }else if(arrayC[n] == 3){
                $(rockImg + '<div>Naam: ' + arrayN[n] + ' Punten: ' + arrayP[n] + '</div>').appendTo($("#results"));
            }
        }
        $('.choices #image_scissor,#image_rock,#image_paper').css("height", "100px").css("width", "100px");

    });



    /*========================Server response====================================================*/
    socket.on('results', function (data, user_id) {
        $('.status').append("<p>You've</p>");

    });

    /*============================================Chat==========================================*/

    socket.on('updatechat', function (username, data) {
        if(data != null && data != ""){
            $('#conversation').append('<b>'+ username + ':</b> ' + data + '<br>');
            var element = document.getElementById("conversation");
            element.scrollTop = element.scrollHeight;
        }else{
            console.log('geen valide waarde');
        }
    });

    $('#datasend').click( function() {
        var message = $('#data').val();
        $('#data').val('');
        socket.emit('sendchat', message);
    });

});


