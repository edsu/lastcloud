function init() {
  SC.initialize({'client_id': '000d9ae8898f80c0fe2ace5bd9e8f58e'});
  $('input[type="submit"]').click(lastfmArtists);
  $('input[type="text"]').change(lastfmArtists);
}

function lastfmArtists() {
  $("#results").empty();
  var key = "0d5ffce4d06bffa87a0415eddf078cde";
  var username = $('input[name="username"]').val();
  var url = "http://ws.audioscrobbler.com/2.0/?method=library.getartists&format=json&limit=100&api_key=" + key + "&user=" + username;
  $.ajax({url: url, dataType: "jsonp", success: soundcloudUsers});
}

function soundcloudUsers(lastfmResponse) {
  var artists = lastfmResponse.artists.artist;   
  var template = $("#artist-template").html();
  for (var i in artists) {
    var artist = artists[i];
    artist.id = normalize(artist.name);
    artist.image = artist.image[2]["#text"];
    $("#results").append(Mustache.render(template, artist));
    SC.get('/users', {q: artist.name}, addSoundcloud);
  }
}

function addSoundcloud(response) {
  if (response.length == 0) {
    console.log("no results from Soundcloud...");
    return;
  }
  for (var j in response) {
    var user = response[j];
    var username = normalize(user.username);
    var li = $("#" + username)[0];
    var template = $("#soundcloud-template").html();
    if (li) {
      $(li).append(Mustache.render(template, user));
      // only report first match
      return;
    }
  }
}

function normalize(s) {
  return s.toLowerCase().replace(/[^\w]/g, "");
}
