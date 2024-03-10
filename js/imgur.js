var form = new FormData();
form.append("image", fileInput.files[0], "GHJQTpX.jpeg");
form.append("type", "image");
form.append("title", "Simple upload");
form.append("description", "This is a simple image upload in Imgur");

var settings = {
  "url": "https://api.imgur.com/3/image",
  "method": "POST",
  "timeout": 0,
  "headers": {
    "Authorization": "Client-ID {{ae16a4008387500}}"
  },
  "processData": false,
  "mimeType": "multipart/form-data",
  "contentType": false,
  "data": form
};

$.ajax(settings).done(function (response) {
  console.log(response);
});

var form = new FormData();
form.append("refresh_token", "{{e600474ca163ca9bcb77b60c5c30c0b1517a94dd}}");
form.append("client_id", "{{ae16a4008387500}}");
form.append("client_secret", "{{0d1eaed0da8d151b2a7593ddc49e32778f999e3b}}");
form.append("grant_type", "refresh_token");

var settings = {
  "url": "https://api.imgur.com/oauth2/token",
  "method": "POST",
  "timeout": 0,
  "processData": false,
  "mimeType": "multipart/form-data",
  "contentType": false,
  "data": form
};

$.ajax(settings).done(function (response) {
  console.log(response);
});