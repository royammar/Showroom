export default{
    uploadImg
}

 function uploadImg(ev) {
     console.log('uploadImg' , ev);
     
    const CLOUD_NAME = 'moriz'
    const PRESET_NAME = 'a4lpv72z'
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    console.log('UPLOAD_URL' , UPLOAD_URL);
    

    const formData = new FormData();
    formData.append('file', ev.target.files[0])
    formData.append('upload_preset', PRESET_NAME);

    return fetch(UPLOAD_URL, {
        method: 'POST',
        body: formData
    })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            return res
        })
        .catch(err => console.error(err))
}