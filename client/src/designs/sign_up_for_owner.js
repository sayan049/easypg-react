$(function () {
    let eyeicon = $("#eyeicon");
    let password = $("#password");

    eyeicon.on("click", function () {
        if (password.attr("type") === "password") {
            password.attr("type", "text");
            eyeicon.attr("src", "openEye.png");
        } else {
            password.attr("type", "password");
            eyeicon.attr("src", "closeEye.png");
        }
    });

    // File input change event for image preview
    $('#upload__inputfile').on('change', function (e) {
        ImgUpload();
    });


    var imgArray = [];
    // ImgUpload function for handling image uploads
    function ImgUpload() {
        // var setupload=document.getElementsByClassName('img-bg1');
        // setupload.style.height="350px";
        var setupload= $(".img-bg1");
        setupload.css("height","240px");
        setupload.css("border","2px dashed #000");

        console.log("ImgUpload function called");
        var imgWrap = $(".upload__img-wrap");
        
        var maxLength = $("#upload__inputfile").attr('data-max_length');

        var files = $('#upload__inputfile')[0].files;
        var filesArr = Array.prototype.slice.call(files);

        filesArr.forEach(function (f, index) {
            if (!f.type.match('image.*')) {
                return;
            }

            if (imgArray.length >= maxLength) {
                return false;
            } else {
                imgArray.push(f);

                var reader = new FileReader();
                reader.onload = function (e) {
                   
                    // var html = "<div class='upload__img-box'><div style='background-image: url("+ e.target.result +")' data-number='" + $(".upload__img-close").length + "' data-file='" + f.name + "' class='img-bg'><div class='upload__img-close'></div></div></div>";
                    var html = "<div class='upload__img-box'><img src="+ e.target.result +" data-number='" + $(".upload__img-close").length + "' data-file='" + f.name + "' class='img-bg'><div class='upload__img-close'></div></div>";

                    imgWrap.append(html);
                     console.log("<div class='upload__img-box'><img src="+ e.target.result +" data-number='" + $(".upload__img-close").length + "' data-file='" + f.name + "' class='img-bg'><div class='upload__img-close'></div></div>");
                     
                };
                reader.readAsDataURL(f);
            }
        });
    }

    // Click event for removing uploaded images
    $('body').on('click', ".upload__img-close", function (e) {
        // Target the specific image box that needs to be removed
        var imgBox = $(this).parent();
    
        // Get the file associated with the image
        var file = imgBox.data("file");
    
        // Remove only the clicked image box
        imgBox.remove();
    
        // Remove the file from the imgArray
        imgArray = imgArray.filter(img => img.name !== file);
    });
    
});
const submitBtn = document.getElementsByClassName("creataccountbtn")[0];
const checkboxbtn = document.getElementById("test9");
const FirstName = document.getElementById('FirstName');
const Email = document.getElementById('Email');
const Address = document.getElementById('Address');
const MobileNo = document.getElementById('MobileNo');
const password = document.getElementById('password');
const pincode = document.getElementById('Pincode');
const MessName = document.getElementById('MessName');
const AboutMess = document.getElementById('AboutMess');
const Location = document.getElementById('Location');


function updateSubmitBtn() {
    const FirstNameValue = FirstName.value.trim();
    const EmailValue = Email.value.trim(); // Fix typo here
    const Addressvalue = Address.value.trim();
    const MobileNoValue = MobileNo.value.trim();
    const passwordValue = password.value.trim();
    const pincodeValue = pincode.value.trim();
    const MessNameValue = MessName.value.trim();
    const AboutMessValue = AboutMess.value.trim();
    const LocationValue = Location.value.trim();

    // debugger;
    if (FirstNameValue && EmailValue && Addressvalue && MobileNoValue && passwordValue && pincodeValue && MessNameValue && AboutMessValue && LocationValue) {
        submitBtn.removeAttribute('disabled');
        checkboxbtn.removeAttribute('disabled');
    } else {
        submitBtn.setAttribute('disabled', 'disabled');
        checkboxbtn.setAttribute('disabled', 'disabled');
    }
}

FirstName.addEventListener('change', updateSubmitBtn); // Fix typo here
Email.addEventListener('change', updateSubmitBtn);
Address.addEventListener('change', updateSubmitBtn);
password.addEventListener('change', updateSubmitBtn);
MobileNo.addEventListener('change', updateSubmitBtn);
pincode.addEventListener('change', updateSubmitBtn);
MessName.addEventListener('change', updateSubmitBtn);
AboutMess.addEventListener('change', updateSubmitBtn);
Location.addEventListener('change', updateSubmitBtn);