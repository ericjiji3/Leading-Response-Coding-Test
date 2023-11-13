//Get important elements that will be manipulated in JS
let form = document.querySelector('.formContainer');
let accidentDate = form.querySelector('#accidentDate')
let radioSet1 = form.querySelectorAll('.radioSet1');
let radioSet2 = form.querySelectorAll('.radioSet2');
let radioSet3 = form.querySelectorAll('.radioSet3');
let fName = form.querySelector('#fName');
let lName = form.querySelector('#lName');
let phone = form.querySelector('#phone');
let email = form.querySelector('#email');
let zip = form.querySelector('#zip');
let submitButt = form.querySelector('.submit')

//Only allow user to select accident dates up to the current date
accidentDate.max = new Date().toLocaleDateString('fr-ca');


//function runs everytime submit button is clicked
function validateForm(){
    //Resets and hides required text
    clearForm();
    //Only run validation if all fields are filled and in the correct format
    if(fieldsFilled()){
        //start loading animation of sumbit button
        submitButt.classList.add('loading');
        submitButt.disabled = true;
        if(validateFields()){
            //Setting a timeout to give the appearance that the form is processing
            setTimeout(() => {
                submitButt.querySelector('.submitText').innerText = 'Success!';
                submitButt.classList.remove('loading');
                submitButt.classList.add('success');
            }, "2000");
        }else{
            //Setting a timeout to give the appearance that the form is processing
            setTimeout(() => {
                submitButt.querySelector('.submitText').innerText = 'Sorry, you do not qualify.';
                submitButt.classList.remove('loading');
                submitButt.classList.add('failed');
            }, "2000");
        }
        
    }
    
}

function clearForm(){
    let requiredTexts = form.querySelectorAll('.reqText');
    requiredTexts.forEach((requiredText, index) => {
        if(requiredText.classList.contains('active')){
            requiredText.classList.remove('active');
        }
    })
}

function fieldsFilled(){
    let allFilled = true;
    
    if(!accidentDate.value){
        form.querySelector('.reqText.quest1').classList.add('active');
        allFilled = false;
    }
    //ES6 spread syntax that converts StaticNodeList to Array of items. The some() method checks to see if at least one radio button is checked in each question
    if(![...radioSet1].some(answer => answer.checked)){
        form.querySelector('.reqText.quest2').classList.add('active');
        allFilled = false;
    }
    if(![...radioSet2].some(answer => answer.checked)){
        form.querySelector('.reqText.quest3').classList.add('active');
        allFilled = false;
    }
    if(![...radioSet3].some(answer => answer.checked)){
        form.querySelector('.reqText.quest4').classList.add('active');
        allFilled = false;
    }
    if(!fName.value){
        form.querySelector('.reqText.questFName').classList.add('active');
        allFilled = false;
    }
    if(!lName.value){
        form.querySelector('.reqText.questLName').classList.add('active');
        allFilled = false;
    }
    if(!phone.value){
        form.querySelector('.reqText.questPhone').classList.add('active');
        allFilled = false;
    }else{
        //Regex validation for phone to ensure correct format
        if(!phone.value.match(/\d{3}[\-]\d{3}[\-]\d{4}/)){
            form.querySelector('.reqText.questPhone').innerHTML = '*Invalid Phone Number';
            form.querySelector('.reqText.questPhone').classList.add('active');
            allFilled = false;
        }
    }
    if(!email.value){
        form.querySelector('.reqText.questEmail').classList.add('active');
        allFilled = false;
    }else{
        //Regex validation for email to ensure correct format
        if(!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
            form.querySelector('.reqText.questEmail').innerHTML = '*Invalid Email';
            form.querySelector('.reqText.questEmail').classList.add('active');
            allFilled = false;
        }
    }
    if(!zip.value){
        form.querySelector('.reqText.questZip').classList.add('active');
        allFilled = false;
    }

    return allFilled;
}

function formatAndValidateDates(dateVal, date2YearsAgoVal){
    //Comparing dates can be a bit tricky in vanilla javascript... this is my method of working with 2 different date object types

    //Convert user accident date input to date string, and remove the time from the string
    dateVal = dateVal.toISOString().split('T', 1)[0]

    //Setting time to 0 for the date from 2 years ago from current date 
    date2YearsAgoVal.setHours(0,0,0,0);
    //Getting the date from 2 years ago from current date
    date2YearsAgoVal.setFullYear(date2YearsAgoVal.getFullYear() - 2);

    //Separating the user input date into integer values for year, month, and day
    let dateYear = parseInt(dateVal.substring(0,4));
    //The date input field type is a different Date type than the date2YearsAgo Value. I want to match the date2YearsAgo object type, which starts the month from 0-11 rather than 1-12, which is why I subtracted 1 from this value.
    let dateMonth = parseInt(dateVal.substring(5,7)) - 1;
    let dateDay = parseInt(dateVal.substring(8, 10));

    //Separating the date 2 years ago into integer values for year, month, and day
    let date2YearsAgoYear = date2YearsAgoVal.getFullYear();
    let date2YearsAgoMonth = date2YearsAgoVal.getMonth();
    let date2YearsAgoDay = date2YearsAgoVal.getDate();

    //Get user input date object formatted in universal time rather than local time
    let utcDate = new Date(Date.UTC(dateYear, dateMonth, dateDay));
    //Get date 2 years ago object formatted in universal time rather than local time
    let utcDate2YearsAgo = new Date(Date.UTC(date2YearsAgoYear, date2YearsAgoMonth, date2YearsAgoDay));
    

    let within2Years = false;
    if(utcDate.getTime() >= utcDate2YearsAgo.getTime()){
        within2Years = true;
    }
    return within2Years;
}

function validateFields(){
    let validated = true;

    let dateVal = new Date(accidentDate.value);
    let date2YearsAgoVal = new Date();
    
    if(!formatAndValidateDates(dateVal, date2YearsAgoVal)){
        validated = false;
    }
    if(radioSet1[1].checked){
        validated = false;
    }
    if(radioSet2[0].checked){
        validated = false;
    }
    if(radioSet3[0].checked){
        validated = false;
    }
    
    return validated;
}