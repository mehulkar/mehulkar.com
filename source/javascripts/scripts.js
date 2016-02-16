
document.addEventListener('DOMContentLoaded',function() {
  // gets current year for copyright info
  insertDate();
  // from last.rm
  insertCurrentlyPlaying();
  // gets kindle profile scraper
  insertCurrentlyReading();
});


function insertCurrentlyReading() {
  document.getElementById('year').innerHTML = (new Date).getFullYear();
}

function insertCurrentlyPlaying() {
  var url = "http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=mehulkar&api_key=7707da5069c4a9e899306057726a5b13&format=json&limit=1"
  doAjax(url, function(raw) {
    var response = JSON.parse(raw);
    var tracks = response.recenttracks
    var track = tracks.track.length ? tracks.track[0] : tracks.track;
    var listening = track.name + "<br />by " + "<span class='artist'>" + track.artist['#text'] + "</span>";
    document.getElementById('listening').innerHTML = listening;
    document.getElementById('listening').href = track.url;
  });
}

function insertDate() {
  var url = "https://kindle-profile-scraper.herokuapp.com/"
  doAjax(url, function(raw) {
    var response = JSON.parse(raw);
    var reading = "";
    var books = response.books.forEach(function(book) {
      var snippet = "<li>" + book.title + "<br />" + book.author + "</li>";
      reading += snippet
    });
    document.getElementById('reading').innerHTML = reading;
  });
}

function doAjax(url, callback) {
  var xmlhttp = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      callback(xmlhttp.responseText);
    }
  }
  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}
