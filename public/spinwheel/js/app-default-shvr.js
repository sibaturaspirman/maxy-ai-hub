// API
const API_URL = 'https://services.galaxystudioexperience.com/v1';
const APP_ID = '42b7bfed-5704-4b72-afb0-e006200da02f'
const APP_KEY = '3d807490f754f7bce5bed329824914473fa41c3772e0212a1b6d1c0b8b6046ce60f3702e24d5eeacfe011bc6344bf40788230ff849b1d2fd91cfd349759565e2'
let APP_RAHASIA = '';
const LINKIMAGE = 'https://ag-gg-assets.s3.ap-southeast-1.amazonaws.com/';
var userDataRaffleSHVR_refreshTokenExpirateAt, userDataRaffleSHVR_refreshToken, userDataRaffleSHVR_accessToken;
var dataMerchandises, dataMerchandisesSegments = [];
var getMerchandiseId, getMerchandiseImage, getMerchandiseStock;

window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const mallId = params.get('mallId');
  const token = params.get('token');

  if (mallId && token) {
    const decoded = decodeURIComponent(token);
    APP_RAHASIA = decoded

    // ✅ Simpan ke localStorage kalau mau dipakai di JS lain
    // localStorage.setItem('mallIdGSE', mallId);
    // localStorage.setItem('tokenDataGSE', token);

    getMerchandise(APP_RAHASIA)

    // Atau panggil API langsung dari sini
    // fetch(`/api/something?mallId=${mallId}`, { headers: { Authorization: `Bearer ${token}` } })
  } else {
    console.warn('Parameter mallId atau token tidak ditemukan di URL');
  }
});

function getMerchandise(accessToken){
  // get merchandise
  axios.get(API_URL+'/prize', {
    headers : {
      'x-app-id': APP_ID,
      'x-app-key': APP_KEY,
      'Authorization': `Bearer ${accessToken}`
    }
  })
  .then(function (response) {
    // console.log(response)

    dataMerchandises = response.data
    console.log(dataMerchandises)
    for(var i = 0; i<dataMerchandises.length; i++){
      let name = ''

      if(dataMerchandises[i].name == 'Wallet Magnet'){
        name = 'Wallet\nMagnet'
      }else{
        name = dataMerchandises[i].name
      }

      // console.log(i)

      if(i % 2 == 0){
        var data = {'fillStyle' : '#45455D', textFillStyle: '#FFFFFF', 'strokeStyle' : '#51E3FF',  'text' : name, 'id' : dataMerchandises[i].id, 'stock' : dataMerchandises[i].stock, 'images' : dataMerchandises[i].imageUrl, 'isAvailable' : dataMerchandises[i].isAvailable}
      }else{
        var data = {'fillStyle' : '#A4A4BF',textFillStyle: '#FFFFFF', 'strokeStyle' : '#51E3FF',  'text' : name, 'id' : dataMerchandises[i].id, 'stock' : dataMerchandises[i].stock, 'images' : dataMerchandises[i].imageUrl, 'isAvailable' : dataMerchandises[i].isAvailable}
      }


      if(i == 2){
        var data = {'fillStyle' : '#686884', textFillStyle: '#FFFFFF', 'strokeStyle' : '#51E3FF',  'text' : name, 'id' : dataMerchandises[i].id, 'stock' : dataMerchandises[i].stock, 'images' : dataMerchandises[i].imageUrl, 'isAvailable' : dataMerchandises[i].isAvailable}
      }

      // if(dataMerchandises[i].isAvailable){
      //   dataMerchandisesSegments.push(data)
      // }
      dataMerchandisesSegments.push(data)

      initWheel(dataMerchandises.length, dataMerchandisesSegments)
    }

  })
  .catch(function (response) {
      // console.log(response);
  })
}

function claimHadiah(){
  const body = new URLSearchParams({
    prizeId: getMerchandiseId
  });
  axios.post(API_URL+'/prize', body, {
    headers : {
      'x-app-id': APP_ID,
      'x-app-key': APP_KEY,
      'Authorization': `Bearer ${APP_RAHASIA}`
    }
  })
  .then(function (response) {
    // console.log(response.data)
    $("#claimHadiah").hide()
    $("#congrats").html('REWARD BERHASIL DI KLAIM!')

  })
  .catch(function (response) {
      console.log(response);
      // console.log(response.response.data.error.message);
      // alert(response.data.error.message)
  })
}

// TEMPORARY DATA
var tempData = [
  {
    id:1, text:'Wallet\nMagnet', image:'hadiah-1', stock:10,
    'fillStyle' : '#1A1A4E', 'strokeStyle' : '#51E3FF',textFillStyle: '#FFFFFF'
  },
  {
    id:2, text:'Sticker', image:'hadiah-2', stock:10,
    'fillStyle' : '#C3E8F0', 'strokeStyle' : '#51E3FF',textFillStyle: '#1A1A4E'
  },
  {
    id:3, text:'Chagee', image:'hadiah-3', stock:10,
    'fillStyle' : '#1A1A4E', 'strokeStyle' : '#51E3FF',textFillStyle: '#FFFFFF'
  },
  {
    id:4, text:'Coffee', image:'hadiah-4', stock:10,
    'fillStyle' : '#C3E8F0', 'strokeStyle' : '#51E3FF',textFillStyle: '#1A1A4E'
  }
];
var totalHadiah = tempData.length;
// !TEMPORARY DATA

let theWheel;
let audio = new Audio('./assets/tick.mp3');  // Create audio object and load tick.mp3 file.
function playSound()
{
    // Stop and rewind the sound if it already happens to be playing.
    audio.pause();
    audio.currentTime = 0;

    // Play the sound.
    audio.play();
}

// Vars used by the code in this page to do power controls.
let wheelPower    = 0;
let wheelSpinning = false;
function initWheel(totalHadiah, dataMerchandisesSegments){
  // CREATE WHEEL
  // Create new wheel object specifying the parameters at creation time.
  theWheel = new Winwheel({
    'numSegments'       : totalHadiah, 
    'drawText'          : true,    
    'textFontSize'      : 42,
    // 'textOrientation'   : 'curved',
    // 'textAlignment'     : 'inner',
    'textMargin'        : 70,
    'textFontFamily'    : 'Samsung Sharp Sans',
    'textFontWeight'    : 'Bold',
    'responsive'        : true,
    'segments'          :dataMerchandisesSegments,
    'animation' :
    {
        'type'     : 'spinToStop',
        'duration' : 15,
        'spins'    : totalHadiah,
        'callbackFinished' : alertPrize,
        'callbackSound'    : playSound,
        'soundTrigger'     : 'pin'  
    },
    'pins' :
    {
        'number' : totalHadiah,
        'outerRadius' : 7,
        'margin'      : -18,
        'fillStyle'   : '#51E3FF'
    }
  });
  
  // -------------------------------------------------------
  // Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
  // note the indicated segment is passed in as a parmeter as 99% of the time you will want to know this to inform the user of their prize.
  // -------------------------------------------------------
  function alertPrize(indicatedSegment)
  {
    wheelSpinning = false;

    // console.log(indicatedSegment)

    // alert(indicatedSegment.text)
    console.log(indicatedSegment.isAvailable)
    if(!indicatedSegment.isAvailable){
      $("#popupUlang").removeClass("hide")
    }else{
      getMerchandiseId = indicatedSegment.id
      getMerchandiseImage = indicatedSegment.images
      getMerchandiseStock =  indicatedSegment.stock
      $("#hadiahName").html(indicatedSegment.text)
      $("#hadiahShow").html('<img src="'+indicatedSegment.images+'" alt="" style="width: 100%;">')
      $("#popupResult").removeClass("hide")
    }

  }
}


// -------------------------------------------------------
// Click handler for spin button.
// -------------------------------------------------------
function startSpin()
{
  if(!wheelSpinning){
    $("#popupUlang").addClass("hide")
    wheelSpinning = true;
    // Stop any current animation.
    theWheel.stopAnimation(false);

    // Reset the rotation angle to less than or equal to 360 so spinning again
    // works as expected. Setting to modulus (%) 360 keeps the current position.
    theWheel.rotationAngle = theWheel.rotationAngle % 360;

    // Start animation.
    theWheel.startAnimation();
  }
}

// initWheel(tempData.length, tempData)


const checkbox = document.getElementById('checkShare');
const button = document.getElementById('spinButton');
const buttonImg = button.querySelector('img');

checkbox.addEventListener('change', () => {
  if (checkbox.checked) {
    button.disabled = false;
    buttonImg.style.opacity = '1';
  } else {
    button.disabled = true;
    buttonImg.style.opacity = '0.5';
  }
});