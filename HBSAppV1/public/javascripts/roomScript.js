/**
 * Created by nikro on 21-3-2017.
 */
$(document).ready(function () {
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
    socket.on('connect', function () {
        socket.emit('adduser', prompt("What's your name: "));
    });

    socket.on('updatechat', function (username, data) {
        $('#conversation').append('<b>'+ username + ':</b> ' + data + '<br>');
    });


    socket.on('updaterooms', function (rooms, current_room) {
        $('#rooms').empty();
        $.each(rooms, function(key, value) {
            if(value == current_room){
                $('#rooms').append('<div>' + value + '</div>');
            }
            else {
                $('#rooms').append('<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
            }
        });
    });

    function switchRoom(room){
        socket.emit('switchRoom', room);
    }

    $(function(){
        $('#datasend').click( function() {
            var message = $('#data').val();
            $('#data').val('');
            socket.emit('sendchat', message);
        });

        $('#data').keypress(function(e) {
            if(e.which == 13) {
                $(this).blur();
                $('#datasend').focus().click();
            }
        });

        $('#roombutton').click(function(){
            var name = $('#roomname').val();
            $('#roomname').val('');
            socket.emit('create', name)
        });
    });
})
});