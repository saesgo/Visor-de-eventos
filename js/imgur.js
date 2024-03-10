document.getElementById("file").addEventListener( "change" ,async Event => {
  Event.preventDefault()
  const headers = new Headers()
  headers.append("Authorization","Client-ID ae16a4008387500")
  const formData = new FormData();
  formData.append( "image",event.target.files[0] )
  const requestOptions={
    method: "POST",
    headers:headers,
    body: formData,
  }
  const url = await fetch("https://api.imgur.com/3/image", requestOptions )
  .then(response=>response.json()).data.link
})