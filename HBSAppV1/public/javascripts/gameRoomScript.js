/**
 * Created by nikro on 23-3-2017.
 */
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

            // var socket = io.connect(connection);

            // return socket;


        })
    );
    var url;
    var params;
    var string;
    var room;
    var player;
    socket.on('connect', function (data) {
        url = window.location.href;
        params = parseURLParams(url);
        room = params.Room;
        setTitle(room);
    });

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
});