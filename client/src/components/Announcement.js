import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

// import announcementImg from "./goc_kodewreck.jpg";

//When storing images in MongoDB using Node.js and passing them through a React frontend,
// a common approach is to convert the image into a Base64 string on the frontend and then store it as a string in MongoDB.
// Base64 encoding allows you to represent binary data (such as images) as a string, making it easier to transfer and store.

function Announcement({ isAdmin }) {
  const url = process.env.REACT_APP_API_URL;
  const [announcementImg, setAnnouncementImg] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    // setAnnoucementImage(URL.createObjectURL(acceptedFiles))
    // // Handle the dropped file(s) here
    // console.log('Uploaded file:', acceptedFiles[0]);
    const file = acceptedFiles[0];

    const reader = new FileReader();

    reader.onload = () => {
      setAnnouncementImg(reader.result);
      console.log("reader file", reader.result); //converted to base64 format

      axios
        .post(`${url}/announcement`, { image: reader.result })
        .then((response) => {
          console.log(response.data.message);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    };

    reader.readAsDataURL(file); //this is async op ans onload event will be fired only after this is done,so doesn't matter if written later
  }, []);

  useEffect(() => {
    async function fetchImg() {
      try {
        const { data } = await axios.get(`${url}/announcement`);
        if (data) {
          console.log("img string", data);
          setAnnouncementImg(data.img);
        } else {
          console.log("anncouncment", data.img);
        }
      } catch (err) {
        console.log("announcement img", err);
      }
    }
    fetchImg();
  }, []);

  const deleteAnnouncment=()=>{
    axios
    .get(`${url}/delete_announcement`)
    .then(setAnnouncementImg())
    .catch((error) => {
      console.error("delete annoucement error", error);
    });
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <>
      {/* <div {...getRootProps()} className={`image-uploader ${isDragActive ? 'active' : ''}`}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the image here...</p> :
          <p>Drag and drop an image here, or click to select a file</p>
      }
    </div> */}

      <div style={{ marginTop: "20px" }}>
        <div className="card">
          <div
            className="card-header"
            style={{
              textAlign: "center",
              paddingTop: "0px",
              paddingBottom: "0px",
            }}
          >
            <h5> Announcement </h5>
          </div>
          {announcementImg ? (
            <img
              src={announcementImg}
              className="card-img-bottom"
              alt="uploaded_img"
            />
          ) : (
              isAdmin ? (
                <div {...getRootProps()} className="image-uploader">
                  <input {...getInputProps()} />

                  <p>Drag and drop an image here, or click to select a file</p>
                </div>
              ) : (
                <></>
              )
          )}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {isAdmin&&announcementImg ? (
          <button
            type="button"
            className="btn btn-danger btn-sm"
            style={{ marginTop: "10px" }}
            onClick={deleteAnnouncment}
          >
            remove
          </button>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default Announcement;
