import axios from 'axios';
import React, { useEffect, useState } from 'react';
import '../designs/sign_up_for_owner.css';
import { signupownerUrl } from '../constant/urls';
import { useNavigate } from 'react-router-dom';

function SignupOwner() {
  const [image, setImage] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const maxLength = 5;
  const [imgArray, setImgArray] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  const amenities = [
    { id: 'test1', label: 'A/C', imgSrc: './assets/air-conditioner 1.png' },
    { id: 'test2', label: 'TV', imgSrc: './assets/screen 1.png' },
    { id: 'test3', label: 'Power Backup', imgSrc: './assets/power 1.png' },
    { id: 'test4', label: 'WiFi', imgSrc: './assets/wifi (1) 1.png' },
    { id: 'test5', label: 'Kitchen', imgSrc: './assets/restaurant 1.png' },
    { id: 'test6', label: 'Tank Water', imgSrc: './assets/tank-water 1.png' },
    { id: 'test7', label: 'Double Bed', imgSrc: './assets/single-bed (1) 1.png' }
  ];

  useEffect(() => {
    document.title = "Sign up for owner";
    
  }, []);

  // const mapmake=()=>{
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const loc = `${position.coords.latitude}, ${position.coords.longitude}`;
  //        // setLocation(loc);
  //        setFormData((prevData) => ({
  //         ...prevData,
  //         location: loc
  //       }));
  //       //  setLoading(false);z
  //       },
  //       // (error) => {
  //       //   setError('Error getting location: ' + error.message);
  //       // //  setLoading(false);
  //       // }
  //     );
  //   } else {
  //    // setError('Geolocation is not supported by this browser.');
  //  //   setLoading(false);
  //   }
  // }
  const mapMake = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const apiKey = "AIzaSyAlJ2p7ePie8E9JH4TeouoayKAvathIGr0";
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        );
        const data = await response.json();
        const address = data.results[0]?.formatted_address || "Location not found";
        console.log("fuck  "+address);
        setFormData((prevData) => ({
          ...prevData,
          location: address,
        }));
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };
  

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    password: '',
    pincode: '',
    mobileNo: '',
    messName: '',
    aboutMess: '',
    location: '',
    profilePhoto: null,
    messPhoto: [],
    facility: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const loadfile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePhoto: file });
      setImage(file);
    }
  };

  const handleFacilityChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => {
      const facilities = checked
        ? [...prevData.facility, value]
        : prevData.facility.filter((facility) => facility !== value);

      return { ...prevData, facility: facilities };
    });
  };

  const removeImage = (index) => {
    setImgArray((prevArray) => prevArray.filter((_, i) => i !== index));
    setFormData((prevFormData) => ({
      ...prevFormData,
      messPhoto: prevFormData.messPhoto.filter((_, i) => i !== index)
    }));
    setErrorMessage('');
  };

  const imgUpload = (event) => {
    const filesArr = Array.from(event.target.files);
    const newMessPhotos = [];

    filesArr.forEach((file) => {
      if (!file.type.match('image.*')) {
        setErrorMessage('Only image files are allowed.');
        return;
      }
      if (imgArray.length >= maxLength) {
        setErrorMessage('Maximum number of images reached.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setImgArray((prevArray) => [...prevArray, { src: reader.result, name: file.name }]);
      };
      reader.readAsDataURL(file);
      newMessPhotos.push(file);
    });

    setFormData((prevFormData) => ({
      ...prevFormData,
      messPhoto: [...prevFormData.messPhoto, ...newMessPhotos]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === 'messPhoto') {
          formData.messPhoto.forEach((file) => formDataToSend.append(key, file));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

      const response = await axios.post(signupownerUrl, formDataToSend, {
        headers: { "Content-Type": 'multipart/form-data' }
      });

      if (response.status === 201) {
        console.log("Response:", response.data);

        // Redirect to login page upon successful signup
        const a = "Please verify your email to log in";
        localStorage.setItem('loginMessageOwner', a);
        navigate('/LoginOwner', { state: { message: a } });

      } else {
        console.error("Signup failed:", response.data);
      }
    } catch (error) {
      console.error("Error creating user:", error.response ? error.response.data : error.message);
    }
  };

  const toggleEye = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const isFormComplete = () => {
    return formData.mobileNo && formData.address && formData.email && formData.firstName && formData.lastName && formData.pincode && formData.messName && formData.profilePhoto;
  };

  // const handleLocationChange = (e) => {
  //   setLocation(e.target.value);
  // };

  return (
    <form className='bodystyle' onSubmit={handleSubmit} method='POST' encType="multipart/form-data">
      <div className="uppernav">
        <div className='flex aligncentre wid90'>
          <div className="signupheader">Sign Up</div>
          <div className="headertext">House Owner</div>
        </div>
        <div className='flex alighncentre'>
          <div className="logo flex">
            <div className='blue'>Easy</div>
            <div className='purple'>Pg</div>
          </div>
        </div>
      </div>

      <div className="formbody">
        <div className="leftform">
          <div className="formheader">Create an Account</div>
          <div className="inputboxes grid">
            <div className="inputbox r1x">
              <input type="text" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="inputbox r1x">
              <input type="text" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
            <div className="inputbox r2x">
              <input type="text" placeholder="Email Address" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="inputbox r3x">
              <input type="text" placeholder="Address" name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="inputbox r4x">
              <input type={isPasswordVisible ? "text" : "password"} name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
              <img src={isPasswordVisible ? "./assets/openEye.png" : "./assets/closeEye.png"} alt="eye" id="eyeicon" onClick={toggleEye} />
            </div>
            <div className="inputbox r4x">
              <input type="text" placeholder="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} />
            </div>
            <div className="inputbox r5x">
              <input type="text" placeholder="Mobile No." name="mobileNo" value={formData.mobileNo} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="rightform">
          <div className="Ellipse3">
            <input type="file" accept="image/*" name="profilePhoto" id="file" onChange={loadfile} className='displaynone' required />
            <label htmlFor="file"><img src="./assets/upload 2.png" alt="" className='cursorpointer' /></label>
            {image ? <img id="output" alt='' className="Ellipse3 absolute z-1" src={URL.createObjectURL(image)} /> : <img id="output" alt='' className="Ellipse3 displaynone absolute z-1" />}
          </div>
          <div className="uploadtxt">Upload Your Profile Photo</div>
        </div>
      </div>

      <div className="downform grid">
        <div className='flex'>
          <div className="checkfacilitytxt">Check your Provided Facility</div>
        </div>
        <div className="checkboxes grid checkboxgrid">
          {amenities.map(amenity => (
            <div key={amenity.id}>
              <div className="checkboxicon">
                <img src={amenity.imgSrc} alt={amenity.label} />
              </div>
              <input type="checkbox" className="checki" id={amenity.id} onClick={handleFacilityChange} value={amenity.label} />
              <label htmlFor={amenity.id}></label>
              <div className="checkboxtxt">{amenity.label}</div>
            </div>
          ))}
        </div>

        <div className="inputbox wid30">
          <input type="text" placeholder="Mess Name" id="MessName" name="messName" value={formData.messName} onChange={handleChange} />
        </div>
        <div className="inputbox h90">
          <input
            type="text"
            placeholder="About Your Mess"
            name="aboutMess"
            id="AboutMess"
            value={formData.aboutMess}
            onChange={handleChange}
          />
        </div>
        <div className='flex'>
          <div className="inputbox wid50">
           
              <input type="text" placeholder="Location (Latitude, Longitude)" name="location" id="Location" value={formData.location} onChange={handleChange} />
           
          </div>
          <img
        src="./assets/map-marker 1.png"
        alt="Map Marker"
        style={{ cursor: "pointer" }}
        className="map-maker"
        onClick={mapMake}
      />
        </div>

        <div className='flex aligncentre wid90vw'>
          <div className="uploadphoto wid80">
            <div className="upload__box flex justifycentre flexcolumn">
              {errorMessage && <p className='errormsg'>{errorMessage}</p>}
              <div className="upload__btn-box flex justifycentre aligncentre nowrap width100 overflowauto">
                <div className="upload__img-wrap inlineblock">
                  {imgArray.map((img, index) => (
                    <div key={index} className="upload__img-box">
                      <img src={img.src} alt={img.name} className="img-bg" />
                      <div className="upload__img-close" onClick={() => removeImage(index)}></div>
                    </div>
                  ))}
                </div>
                <div className="img-bg1">
                  <label className="upload__btn" htmlFor="upload__inputfile"><img src="./assets/upload 1.png" alt="" className='cursorpointer' />
                    <input type="file" multiple name='messPhoto' className="upload__inputfile displaynone" id="upload__inputfile" onChange={imgUpload} /></label>
                </div>
              </div>
              <div className="uploadmesstxt">Upload Your Room Photo</div>
              <div className="uploadphotowarning">Maximum 1.5 MB Ratio Photo Support</div>
            </div>
          </div>
        </div>

        <div className="terms flex justifycentre">
          <input type="checkbox" className="checki" id="test9" disabled={!isFormComplete()} />
          <label htmlFor="test9"></label>
          <div className="termstxt">Check all </div><div className="termstxt blue">Terms & Condition </div><div className="termstxt">and Privacy</div>
          <div className="termstxt blue">Policy</div>
        </div>

        <div className="terms flex justifycentre">
          <button className="creataccountbtn cursorpointer" type="submit" disabled={!isFormComplete()} style={{background: isFormComplete()?  '#2CA4B5' : 'grey'}}   >Create Account</button>
        </div>
      </div>
    </form>
  );
}

export default SignupOwner;
