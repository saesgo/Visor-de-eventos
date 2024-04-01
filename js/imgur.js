<input type="file" id="file">
    <img src="https://i.imgur.com/55a7sap.png" id="img" height="200 px" >
    <p id="url"></p>
    <script>
    const file=document.getElementById('file');
    const img=document.getElementById("img")
    const url=document.getElementById("url")
    file.addEventListener("change", ev => {
        const formdata = new formData()
        formdata.append("image", ev.target.files[0])
        fetch("https://api.imgur.com/3/image/", { 
            method:"post",
            headers: {
                Authorization:"Client-ID ae16a4008387500"
            }
            , body: formData 
        }).then(data=>data.json()).then(data=>{
            img.src=data.data.link;
            url.innerText=data.data.link
        })  
    })