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