function init() {
  $('input[type="submit"]').click(lastfmArtists);
}

function lastfmArtists() {
  var key = "0d5ffce4d06bffa87a0415eddf078cde";
  var username = $('input[name="username"]').val();
  var url = "http://ws.audioscrobbler.com/2.0/?method=library.getartists&format=json&limit=100&api_key=" + key + "&user=" + username;
  $.ajax({url: url, dataType: "jsonp", success: soundcloudUsers});
}

function soundcloudUsers(lastfmResponse) {
  var artists = lastfmResponse.artists.artist;   
  var template = $("#artist-template").html();
  $("ul").empty();
  for (var i in artists) {
    var artist = artists[i];
    artist.id = normalize(artist.name);
    artist.image = artist.image[2]["#text"];
    $("#results").append(Mustache.render(template, artist));
    SC.initialize({'client_id': '000d9ae8898f80c0fe2ace5bd9e8f58e'});
    SC.get('/users', {q: artist.name}, addSoundcloud);
  }
}

function addSoundcloud(response) {
  for (var j in response) {
    var user = response[j];
    var username = normalize(user.username);
    console.log("looking for id=" + username);
    var li = $("#" + username)[0];
    var template = $("#soundcloud-template").html();
    if (li) {
      $(li).append(Mustache.render(template, user));
    }
  }
}

function normalize(s) {
  return s.toLowerCase().replace(/[^\w]/g, "");
}
