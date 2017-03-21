$( document ).ready(function() {

var conJordy =  'http://192.168.1.21:4200';
var conTim =  'http://192.168.1.20:4200';
var conNick = 'http://localhost:4200';
var socket = io.connect(conJordy);

socket.on('connect', function(data) {

});

socket.on('broad', function(data) {
    $('body').append("Message: " + data + "<br>");
});

socket.on('UpdateAmountOfPlayers', function (amount_of_players) {
    $('.player_count').html('<p>Amount of players: ' + amount_of_players +'</p>');
})

var room = "";

$('form').submit(function(e){
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
})

socket.on('message', function (data) {
    alert(data);
    console.log('incoming message: ', data);
})

// Added since first release
$('#image_scissor').click(function () {
    console.log("Schaar geklikt!")
    socket.emit('choice', "scissor");
    $('.choices').addClass('hide');
})

$('#image_paper').click(function () {
    console.log("Papier geklikt!")
    socket.emit('choice', "paper");
    $('.choices').addClass('hide');
})

$('#image_rock').click(function () {
    console.log("Steen geklikt!")
    socket.emit('choice', "rock");
    $('.choices').addClass('hide');
})

socket.on('choice', function(data, user_id) {
    $('body').append("keuze: " + data + " " + user_id + "<br>");
});

});