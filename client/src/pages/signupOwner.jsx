import React, { useState } from 'react'
import '../designs/sign_up_for_owner.css'
import { useEffect } from 'react';
// import '../designs/sign_up_for_owner.js';


function SignupOwner() {
    useEffect(()=>{
        document.title="sign up for owner"
    })
    const [image,setimage]=useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    //const [password,setPassword]=useState('');
    const maxLength=5;
    const [imgArray, setImgArray] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');




    const loadfile=(e)=>{
        //uplead profile pic
        const file=  e.target.files[0];
        console.log("abc"+file)
        setimage(file);
    }

    const toggleeye=()=>{
    setIsPasswordVisible(!isPasswordVisible);
    }

    
    const imgUpload = (event) => {
        //mess pics upload
        const filesArr = event.target.files;
    
        for (let i = 0; i < filesArr.length; i++) {
          const file = filesArr[i];
    
          if (!file.type.match('image.*')) {
            setErrorMessage('Only image files are allowed.');
            continue;
          }
    
          if (imgArray.length >= maxLength) {
           setErrorMessage('Maximum number of images reached.');
            break;
          } 
            const reader = new FileReader();
            reader.onload = () => {
              setImgArray(prevArray => [...prevArray, { src: reader.result, name: file.name }]);
              console.log({ name: file.name })
            };
            reader.readAsDataURL(file);
          
        }
      };

    const removeImage = (index) => {
        setImgArray(prevArray => prevArray.filter((_, i) => i !== index));
        setErrorMessage('');
      }
      
      
      ;
    
  return (
<body className='bodystyle'>


<div className="uppernav">
<div className='flex aligncentre wid90'>
    <div className="signupheader">sign up</div>
    <div className="headertext">House owner</div>
</div>
<div className='flex alighncentre' >
    <div className="logo flex" >
       <div className='blue'>Easy</div>
       <div className='purple'>Pg</div>
    </div>
</div>
</div>

<form action="" method="
">
<div className="formbody" >
   


        <div className="leftform" >
        <div className="formheader">create a Account</div>
         <div className="inputboxes grid">
      <div className="inputbox r1x">
        <input type="text" placeholder="First Name" name="firstName" />
      </div>
      <div className="inputbox r1x">
        <input type="text" placeholder="Last Name" name="lastName" />
      </div>
      <div className="inputbox r2x">
        <input type="text" placeholder="Email Address" name="email" />
      </div>
      <div className="inputbox r3x">
        <input type="text" placeholder="Address" name="address"  />
      </div>
      <div className="inputbox r4x">
        <input type={isPasswordVisible ? "text" : "password"} name="password"placeholder="Password"/>
        <img src={isPasswordVisible ? "./assets/openEye.png" : "./assets/closeEye.png"} alt="eye" id="eyeicon" onClick={toggleeye} />
      </div>
      <div className="inputbox r4x">
        <input type="text" placeholder="Pincode" name="pincode"   />
      </div>
      <div className="inputbox r5x">
        <input type="text" placeholder="Mobile No." name="mobileNo"  />
      </div>
    </div>
        </div>

        <div className="rightform" >
            <div className="Ellipse3" id="">
                <input type="file" accept="image/*" name="image" id="file" onChange={loadfile} className='displaynone'/>
<label for="file"><img src="./assets/upload 2.png" alt="" className='cursorpointer' /></label>
{image ? <img id="output" alt='' className="Ellipse3  absolute z-1" src={URL.createObjectURL(image)} /> : <img id="output" alt='' className="Ellipse3 displaynone absolute z-1" /> }
            
            </div>
            <div className="uploadtxt">Uplode Your Profile  Photo</div>
        </div> 
      
</div>

<div className="downform grid" >
    <div className='flex'><div className="checkfacilitytxt" >Check your Provide Fecility</div></div>
    <div className="checkboxes grid checkboxgrid" >

    <div >
        <div className="checkboxicon"><img src="./assets/air-conditioner 1.png" alt="" srcset=""/></div><input type="checkbox" className="checki" id="test1" />
        <label for="test1"></label><div className="checkboxtxt">A/C</div>
    </div>
    <div >
        <div className="checkboxicon"><img src="./assets/screen 1.png" alt="" srcset=""/></div><input type="checkbox" className="checki" id="test2" 
        />
        <label for="test2"></label><div className="checkboxtxt">TV</div>
</div>
    <div >
        <div className="checkboxicon"><img src="./assets/power 1.png" alt="" srcset=""/></div><input type="checkbox" className="checki" id="test3" />
        <label for="test3"></label><div className="checkboxtxt">Power Backup</div>
    </div>
    <div >
        <div className="checkboxicon"><img src="./assets/wifi (1) 1.png" alt="" srcset=""/></div><input type="checkbox" className="checki" id="test4" />
        <label for="test4"></label><div className="checkboxtxt">Wi-fi</div>
    </div>
    <div >
        <div className="checkboxicon"><img src="./assets/restaurant 1.png" alt="" srcset=""/></div><input type="checkbox" className="checki" id="test5" />
        <label for="test5"></label><div className="checkboxtxt">Kitchen</div>
    </div>
    <div >
        <div className="checkboxicon"><img src="./assets/tank-water 1.png" alt="" srcset=""/></div><input type="checkbox" className="checki" id="test6" />
        <label for="test6"></label><div className="checkboxtxt">Water Available Anytime</div>
    </div>
    <div >
        <div className="checkboxicon"><img src="./assets/single-bed (1) 1.png" alt="" srcset=""/></div><input type="checkbox" className="checki" id="test7" />
        <label for="test7"></label><div className="checkboxtxt">Double Bed</div>
    </div>
    <div >
        <div className="checkboxicon"><img src="./assets/single-bed 1.png" alt="" srcset=""/></div><input type="checkbox" className="checki" id="test8" />
        <label for="test8"></label><div className="checkboxtxt">Single Bed</div>
    </div>
</div>

<div className="inputbox wid30" ><input type="text" placeholder="Mess Name" id="MessName" name="MessName"/></div>
<div className="inputbox h90" ><input type="text" placeholder="About Your Mess" name="AboutMess" id="AboutMess"/></div>
<div className='flex'><div className="inputbox wid50" ><input type="text" placeholder="Using Map for Your Mess , Tap a Location Button" name="Location" id="Location"/>
</div>
<img src="./assets/map-marker 1.png" alt="" className='map-maker' srcset="" />
</div>

<div className='flex aligncentre wid90vw' >
    <div className="uploadphoto wid80"  >
    <div className="upload__box flex justifycentre flexcolumn" >
    {errorMessage && <p className='errormsg'>{errorMessage}</p>}
         <div className="upload__btn-box flex justifycentre aligncentre nowrap width100 overflowauto" >
         
            <div className="upload__img-wrap inlineblock" > 

            
            <div className="upload__img-box">
        {imgArray.map((img, index) => (
          <div key={index} className="upload__img-box">
            <img src={img.src} alt={img.name} className="img-bg" />
            <div className="upload__img-close" onClick={() => removeImage(index)}></div>
          </div>
        ))}
      </div>



            </div>
            
            <div className="img-bg1">
            <label className="madarchod upload__btn" for="upload__inputfile" ><img src="./assets/upload 1.png" alt="" className='cursorpointer' />
                <input type="file" multiple="" data-max_length="20" className="upload__inputfile displaynone" id="upload__inputfile" onChange={imgUpload} /></label>  
            </div>
           
            
        </div>
        <div className="uploadmesstxt">Uplode Your Room Photo</div>
        <div className="uploadphotowarning">Maximum 1.5 MB Ratio Photo Support</div>
    </div>
    </div>
</div>

<div className="terms flex justifycentre" >
    <input type="checkbox" className="checki" id="test9" />
    <label  for="test9"></label>
    <div className="termstxt">Check all </div><div className="termstxt blue" >Trems & Condition </div><div className="termstxt">and Privacy</div>
    <div className="termstxt blue" >Policy</div>
</div>

<div className="terms  flex justifycentre" >
    <button className="creataccountbtn  cursorpointer" type="submit"  >Create a Account</button>
</div>
</div>

</form>

{/* <script type="module" src="../designs/sign_up_for_owner.js"></script> */}

</body>
  )
}

export default SignupOwner