let imgOriginal;
let imgCounter = 0;
var canvasDiv;
var table;
var thumbnail;
var percentCanopyCover;

var resultsTable;
var btnDownload;

var realtimeLatitude;
var latitude;
var latArray;
var latRef;

var realtimeLongitude;
var longitude;
var lonArray;
var lonRef;

var realtimeAltitude;
var altitude;
var altitudeRef;

var country;
var state;
var region;

var vegetationType;
var dateTime;


var imgOriginalsRef;
var imgClassifiedRef;
var storageRef;
var user;
var zip = new JSZip();
var originals = zip.folder("originals");
var classified = zip.folder("classified");

var w = 0;
var h = 0;


var video;
var sanpButton;
var retakeButton;
var weatherObj; 

var capture;
var modo = 0;
var confirmarTakeSnap = false;


// Check for the mesonent data retrive
if (localStorage.getItem("mesonetWeatherData") === null) {
    // Run the file getweather function 
    console.log("Run the file getweather function ");
    getWeatherData();
    alert("connecting to mesonent servers to retrive data");
}else{
    // The object is created 
    // Check the date
    console.log("The object is created/ Check the date ");
    weatherObj =  getMesonentDataFromLocalStorage();
    //2020-02-24 00000000000
    dateCheck = getDate();
    loggedDate = weatherObj.storedDate;
    if(dateCheck == loggedDate){
        console.log("The mesonent data is loaded to the system");
    }else{
        // Retriving data from the Mesonent Api
        getWeatherData();
        alert("Date did not match, gethering Data from the mesonent Api");
    }
}



function setup() {
  
    var containerDiv;

    resultsGrid = document.getElementById('resultGrid');
    resultsGrid.style.display = "none";

    w = window.outerWidth;
    h = window.outerHeight;
    containerDiv = document.getElementById('containerDiv') ;
    containerDiv.style.visibility = "hidden";
    //console.log(clientWindow);

    var body = document.body, html = document.documentElement;

  /*   var clientHeight = Math.max( body.scrollHeight, body.offsetHeight, 
                        html.clientHeight, html.scrollHeight, html.offsetHeight );      
    var clientWidth  =  Math.max( body.scrollWidth, body.offsetWidth, 
        html.clientWidth, html.scrollWidth, html.offsetWidth ); */
    

    sreenHeight =((body.offsetHeight)*90)/100;
    screenWidth =  ((body.offsetWidth)*90)/100;
    //print 
    console.log("screen width",screenWidth);
    console.log("screen height",sreenHeight);

/*     //create a video capture object
    video = createCapture({
        audio: false,
        video: {
            width: screenWidth,
            height: sreenHeight,
            facingMode: "environment"
        }
    }, function() {
        console.log('capture ready.');
        containerDiv.style.visibility = "visible";

    });
    
    
    video.parent('cameraCanvas');
    // If you pass only one parameter to setAttribute in the JavaScript DOM API, 
    // if we dont set in Safari you'll get "playsinline"="undefined" which result crashing the video
    video.elt.setAttribute('playsinline', '');
 */
        // Upload button
    btnUpload = createFileInput(gotFile,'multiple');
    btnUpload.parent('btnUploadLabel');
    btnUpload.style('display','none');
    btnUpload.elt.disabled = true;
    
    //document.getElementById('btnUploadLabel').addEventListener('click',getVegetationType)
 
    w = screenWidth;
    h = sreenHeight;
    
    // Creating the snap button using p5
    sanpButton = createButton('');
    sanpButton.parent('cameraCanvas');
    let col = color(76, 175, 80);
    sanpButton.style('background-color', 'Transparent');
    sanpButton.style('cursor', 'pointer');
    sanpButton.style('height', '80px');
    sanpButton.style('width', '50px');
    sanpButton.style('color', 'white');
    sanpButton.style('padding', '15px 32px');
    sanpButton.style('border-radius','50%');
    sanpButton.style('border-color','white');
    sanpButton.style('border-width','10px');
    sanpButton.position((screenWidth/3)+20,(5*sreenHeight)/4);
    sanpButton.mousePressed(takeSnap);


}  // End setup()


function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  
  /* Set the width of the side navigation to 0 */
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }




/**
 *  Take a picture from the p5 video feed
 */
function takeSnap(){

    var capturedFrame = video.get();
    const orignalImageDiv = document.getElementById("orignalImage");
    orignalImageDiv.innerHTML = '';
    const classifiedImageDiv = document.getElementById("classifiedImage");
    classifiedImageDiv.innerHTML = '';

    gotFile(capturedFrame);
    confirmarTakeSnap = true;
}

function retakeSnap(){

  
    modo = 1;
    //resultsGrid.style.visibility = 'hidden';
    resultsGrid.style.display = "none";
    cameraCanvas = document.getElementById('cameraCanvas');
    cameraCanvas.style.display = 'block';
    confirmarTakeSnap = true;
}

function gotFile(file) {
    if(imgCounter <= 50){
        if (file.type === 'image'){
            loadImage(file.data,function(imgOriginal){
                d = distance(59.3293371, 13.4877472, 59.3225525, 13.4619422)
                console.log(d);
        cameraCanvas = document.getElementById('cameraCanvas');
        cameraCanvas.style.display = 'none';
        document.getElementById("canopeoCover_val").innerHTML ="";
        document.getElementById("cropCoefficient_val").innerHTML = "";
        document.getElementById("evapotranspiration_val").innerHTML = "";
        document.getElementById("cropEvapotranspiration_val").innerHTML ="";

                // Get geographic coordinates
                //getLocation();
               

                // Start counting images
                imgCounter += 1;

                // Displaying the result grid 
                resultsGrid.style.visibility = 'visible';
                resultsGrid.style.display = "block";
    
                let imgOriginalId = 'img-original' + imgCounter; // Needed to call EXIF data
                console.log("imgOriginalId",imgOriginalId);
                let imgClassifiedId = 'img-classified' + imgCounter; // Not needed, but added for consistency with imgOriginal
    
 
    
          
                // Get upload timestamp
                uploadDate = new Date();
                
                // Resize image so that the largest side has 1440 pixels
                if(imgOriginal.width>=imgOriginal.height){
                    imgOriginal.resize(1440,0); 
                } else {
                    imgOriginal.resize(0,1440);
                }
                imgOriginal.loadPixels();
               
                
                // Initiatve classified image
                imgClassified = createImage(imgOriginal.width,imgOriginal.height);
                imgClassified.loadPixels();

                // Classify image following manuscript settings
                let RGratio = 0.95;
                let RBratio = 0.95;
                let canopyCover = 0;

                for(let y=0; y<imgClassified.height; y++){
                    for(let x=0; x<imgClassified.width; x++){
                        let index = (x + y * imgClassified.width)*4;
                    
                        let R = float(imgOriginal.pixels[index+0]);
                        let G = float(imgOriginal.pixels[index+1]);
                        let B = float(imgOriginal.pixels[index+2]);
                    
                        if (R/G < RGratio && B/G < RBratio && 2*G-R-B>20){
                            imgClassified.pixels[index+0] = 255;
                            imgClassified.pixels[index+1] = 255;
                            imgClassified.pixels[index+2] = 255;
                            imgClassified.pixels[index+3] = 255;
                            canopyCover += 1;
                            

                        } else {
                            imgClassified.pixels[index+0] = 0;
                            imgClassified.pixels[index+1] = 0;
                            imgClassified.pixels[index+2] = 0;
                            imgClassified.pixels[index+3] = 255;
                        }
                    }
                }

                imgClassified.updatePixels();
                percentCanopyCover = round(canopyCover/(imgClassified.width * imgClassified.height)*1000)/10;

                // Calculate aspect ratio for thumbnails and resize images
                var aspectRatio = imgClassified.width/imgClassified.height;

                var cardData = document.getElementById('cardData') ;
                var cardHeight = cardData.offsetHeight;
                var cardWidth = cardData.offsetWidth;

                // Thumbnail original image
                thumbnailOriginal = createImg(imgOriginal.canvas.toDataURL());
                thumbnailOriginal.size(128*aspectRatio,128);
                thumbnailOriginal.size(cardWidth,cardHeight);
                thumbnailOriginal.id(imgOriginalId);
                thumbnailOriginal.parent(orignalImage);
                //originalID
                
                // Thumbnail classified image
                thumbnailClassified = createImg(imgClassified.canvas.toDataURL());
                thumbnailClassified.size(128*aspectRatio,128);
                thumbnailClassified.size(cardWidth,cardHeight);
                thumbnailClassified.id(imgClassifiedId);
                thumbnailClassified.parent(classifiedImage);
                thumbnailClassified.style.border = "5px solid black;"
                
                // Check EXIF dateTime
                if (typeof snapDate === 'undefined'){
                    snapDate = null;
                }

                // Check EXIF latitude
                if (typeof latArray === 'undefined'){
                    latitude = null;
                } else {
                    latitude = degreeToDecimal(latArray[0],latArray[1],latArray[2],latRef);
                }

                // Check EXIF longitude
                if (typeof lonArray === 'undefined'){
                    longitude = null;
                } else {
                    longitude = degreeToDecimal(lonArray[0],lonArray[1],lonArray[2],lonRef);
                }

                // Check EXIF altitude
                if (typeof altitude === 'undefined' || altitude === null){
                    altitude = null;
                } else {
                    altitude = altitudeToMeters(altitude, altitudeRef) ;
                }
           

                // Replace any null values with realtime GPS data. Only replace if null to avoid overwriting
                // EXIF data.
                // Check real time latitude
                if (latitude === null){
                    latitude = realtimeLatitude;
                }

                // Check real time latitude
                if (longitude === null){
                    longitude = realtimeLongitude;
                }
                
                // Check real time latitude
                if (altitude === null){
                    altitude = realtimeAltitude;
                }

                // Get weather data
                 weatherObj = getMesonentDataFromLocalStorage()
                 lt = new locationCustom(37.77071,-457.23999,-9999);
                 etoVal = getETOValue(lt,weatherObj);
                 etCrop = getETCrop(percentCanopyCover,etoVal);

               
                // Assiging the data to cards
                document.getElementById("canopeoCover_val").innerHTML =percentCanopyCover;
                cropCoffection = float(getCropCoeffcient(percentCanopyCover));
                document.getElementById("cropCoefficient_val").innerHTML = cropCoffection.toFixed(2);
                document.getElementById("evapotranspiration_val").innerHTML = etoVal;
                document.getElementById("cropEvapotranspiration_val").innerHTML =etCrop;

                var imgName = 'img_' + uploadDate.getTime();
                var data = {
                    name: imgName,
                    snapDate: snapDate,
                    uploadDate: uploadDate.getTime(),
                    latitude: latitude,
                    longitude: longitude,
                    altitude: altitude,
                    cover: percentCanopyCover,
                    vegetationType: vegetationType,
                    country: country,
                    state: state,
                    region: region
                };

                // Add original and classified images to ZIP file
                originals.file(imgName + '.jpg', dataURItoBlob(imgOriginal.canvas.toDataURL('image/jpeg')), {base64: true});
                classified.file(imgName + '.jpg', dataURItoBlob(imgClassified.canvas.toDataURL('image/jpeg')), {base64: true});
          });
    /*     }
        // getting the weather data
       
    } */
        }
    }
}


function degreeToDecimal(D,M,S,ref) {
    let decimal = Math.round( (D + M/60 + S/3600) * 1000000 )/ 1000000;
    if (ref === 'W' || ref === 'S'){
        decimal = decimal * -1;
    }
    return decimal;
}

function altitudeToMeters(value, ref) {
    let meters;
    if(ref === 1){
        value = value * -1;
    }
    meters = Math.round(value);
    return meters;
}

function dataURItoBlob(dataURI) {
    // Found this solution at: https://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type:mimeString});
}

function getVegetationType(){
    if(document.getElementById('vegetationTypeList') !== null){
        vegetationType = document.getElementById('vegetationTypeList').value;
        if(vegetationType !== 'empty'){
            btnUpload.elt.disabled = false;
            document.getElementById('vegetationTypeRequireMsg').innerHTML = '';
        } else {
            btnUpload.elt.disabled = true;
            document.getElementById('vegetationTypeRequireMsg').innerHTML = 'Required field';
        }
    }
}


function getLocation() {
    console.log("wating on lnavigator.geolocationocation");
    if (navigator.geolocation) {
        console.log("getting the location from the browser");
        navigator.geolocation.getCurrentPosition(realtimePosition);
        return navigator.geolocation.getCurrentPosition(realtimePosition);
    } else {
        realtimeLatitude = null;
        realtimeLongitude = null;
        realtimeAltitude = null;
        country = null;
        state = null;
        region = null;
        console.log('Navigator not available')
    }
    console.log("Passed the location test");
}

function realtimePosition(position) {
   realtimeLatitude =  position.coords.latitude;
   realtimeLongitude = position.coords.longitude; 
   realtimeAltitude = position.coords.altitude;
}

function getLocationInitial(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(realtimePositionInitial);
    }
}

function realtimePositionInitial(position) {
    getAddress(position.coords.latitude, position.coords.longitude)
}

getLocationInitial()


function getAddress(lat,lon) {
    var url = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=' + lat + '&' + 'lon=' + lon;

    fetch(url)
        .then(function(response) {
            return response.json();
        })
        .then(function(jsonData) {
            //console.log(JSON.stringify(jsonData));

            // Country
            if ('country' in jsonData.address){
                country = jsonData.address.country;
            } else {
                country = null;
            }
        
            // State
            if ('state' in jsonData.address){
                state = jsonData.address.state;
            } else {
                state = null;
            }
        
            // Region (this entry is not the same for different parts of the world)
            if ('state_district' in jsonData.address){
                region = jsonData.address.state_district;
            } else if ('county' in jsonData.address) {
                region = jsonData.address.county;
            } else {
                region = null;
            }
            console.log(country)
        });
}

/**
 *  Retrive data from the Mesonet Api and store the infromaton from in the local storage of the browser
 */
function getWeatherData(){
    // module for weather
    
    dateStr = getDate();
    weatherT = ""; 
    url = "https://mesonet.k-state.edu/rest/stationdata/?stn=Ashland%20Bottoms&int=day&t_start="+dateStr+"&t_end="+dateStr+"&vars=PRECIP,WSPD2MVEC,TEMP2MAVG,TEMP2MMIN,TEMP2MMAX,RELHUM2MMAX,RELHUM10MMIN,SR,WSPD2MAVG";
    fetch(url)
    .then(res => {
        return res.text();
    })
    .then(data => {
       // The returned data set has columns names and values devidede  by /n 
       // Seperated by /n 
       var lineSeperation = data.split(/\r?\n/);
       // Setting the value in the local storage
       localStorage.setItem('mesonetWeatherData', JSON.stringify(lineSeperation[1]));
   });
}

/**
 * Storing the Api data in the local storage 
 */
function getMesonentDataFromLocalStorage(){
    // Retrieve the object from storage
    var retrievedObject = localStorage.getItem('mesonetWeatherData');
    var apiData = retrievedObject.split(",").map(function(item) {
        return parseInt(item, 10);
    });      
    
    dateStr = getDate();
    weatherT = new weather();

    weatherT.timestamp     = apiData[0];
    weatherT.station       = apiData[1];
    weatherT.tempAvg       = apiData[2];
    weatherT.tempMin       = apiData[3];
    weatherT.tempMax       = apiData[4];
    weatherT.humidityMax   = apiData[5];
    weatherT.humidityMin   = apiData[6];
    weatherT.precp         = apiData[7]; // raim fall
    weatherT.solarRad      = apiData[8];
    weatherT.windSpeed     = apiData[9];
    weatherT.doy           = dayOftheYear();
    weatherT.storedDate    = dateStr;
    
    return weatherT;

}

/**
 * Return short(grass) evapotranspiration value
 * @param {*} location  An object carries langgitude and latitude
 * @param {*} weather  Kansas mesonent api data
 * @returns  evapotranspiration ETo
 */
function getETOValue(location,weather) {

    const missingData = -9999;
    const atmPressure = 101.3 * ((293 - 0.0065 * location.elevation) / 293)**5.26;
    const Cp = 0.001013; // Approx. 0.001013 for average atmospheric conditions
    const epsilon =  0.622;
    const lamda = 2.45;
    const gamma = (Cp * atmPressure) / (epsilon * lamda); // Approx. 0.000665

    //// Wind speed
    const windHeight = 1.5; // Most common height in[meters]
    let windSpeed2m;
    if (weather.windSpeed === missingData || weather.windSpeed === null) {
      windSpeed2m = 2;
    } else {
      windSpeed2m = weather.windSpeed * (4.87 / Math.log((67.8 * windHeight) - 5.42));  // Eq. 47, FAO-56 windHeight in [m]
    }
    
    //// Air humidity
    const eTmax = 0.6108 * Math.exp(17.27 * weather.tempMax / (weather.tempMax + 237.3)); // Eq. 11, //FAO-56
    const eTmin = 0.6108 * Math.exp(17.27 * weather.tempMin / (weather.tempMin + 237.3));
    const es = (eTmax + eTmin) / 2;

    //// Vapor pressure
    const delta = 4098 * (0.6108 * Math.exp(17.27 * weather.tempAvg / (weather.tempAvg + 237.3))) / (weather.tempAvg + 237.3)**2;
    let ea;
    if (weather.humidityMin === missingData || weather.humidityMax === missingData || weather.windSpeed === null) {
      ea = 0.6108 * Math.exp(17.27 * weather.tempMin/(weather.tempMin + 237.3));
    } else {
      ea = (eTmin * (weather.humidityMax / 100) + eTmax * (weather.humidityMin / 100)) / 2;
    }

    //// Solar radiation
    const dr = 1 + 0.033 * Math.cos(2 * Math.PI * weather.doy/365);  // Eq. 23, FAO-56
    const phi = Math.PI / 180 * location.latitude; // Eq. 22, FAO-56
    const d = 0.409 * Math.sin((2 * Math.PI * weather.doy/365) - 1.39);
    const omega = Math.acos(-Math.tan(phi) * Math.tan(d));
    const Gsc = 0.0820; // Approx. 0.0820
    const Ra = 24 * 60 / Math.PI * Gsc * dr * (omega * Math.sin(phi) * Math.sin(d) + Math.cos(phi) * Math.cos(d) * Math.sin(omega));

    // Clear Sky Radiation: Rso (MJ/m2/day)
    const Rso =  (0.75 + (2 * 10**-5) * location.elevation) * Ra ; // Eq. 37, FAO-56

    // * Measured solar Radiation: Rs (MJ/m2/day)
    if (weather.solarRad === missingData || weather.windSpeed === null) {
      weather.solarRad = Math.min(0.16 * Ra * Math.sqrt(weather.tempMax - weather.tempMin), Rso);
    }

    // Rs/Rso = relative shortwave radiation (limited to <= 1.0)
    const alpha = 0.23; // 0.23 for hypothetical grass reference crop
    const Rns = (1 - alpha) * weather.solarRad; // Eq. 38, FAO-56
    const sigma  = 4.903 * 10**-9;
    const maxTempK = weather.tempMax + 273.16;
    const minTempK = weather.tempMin + 273.16;
    const Rnl =  sigma * (maxTempK**4 + minTempK**4) / 2 * (0.34 - 0.14 * Math.sqrt(ea)) * (1.35 * (weather.solarRad / Rso) - 0.35); // Eq. 39, FAO-56
    const Rn = Rns - Rnl; // Eq. 40, FAO-56

    // Soil heat flux density
    const soilHeatFlux = 0; // Eq. 42, FAO-56 G = 0 for daily time steps  [MJ/m2/day]

    // ETo calculation*
    
    const ETo = (0.408 * delta * (weather.solarRad - soilHeatFlux) + gamma * (900 / (weather.tempAvg + 273)) * windSpeed2m * (es - ea)) / (delta + gamma * (1 + 0.34 * windSpeed2m));

    return Math.round(ETo*10)/10;
  }


  /**
   * Return the day of the year
   * January 1 is the first day of the year
   * @return  n th number of the year
   */
  function dayOftheYear(){
    var today = new Date();
    var start = new Date(today.getFullYear(), 0, 0); // Constructing the Jan 1 for the given year
    var diff = today - start; // returns days by second
    var oneDay = 1000 * 60 * 60 * 24;
    var days = Math.floor(diff / oneDay);
    return days;
  }

 /**
   * Return the day of the year
   * January 1 is the first day of the year
   * @param  cc the first {@cc float} canopy cover percentage
   * @param etc the second  {@eto float}  reference evapotranspiration (mm, mm d^-1)
   * @return  crop evapotranspiration ETc
   */
  function getETCrop(cc,eto){
    let etCrop;
    etCrop = eto * getCropCoeffcient(cc);
    return Math.round(etCrop * 100) / 100;
  }

   /**
   * Get crop coffeicient Kc
   * @param  cc the first {@cc float} canopy cover percentage
   * @return crop coffecient  Kc
   */
  function getCropCoeffcient(cc){
     return  (1.1 * (cc/100) + 0.17);
  }


  /**
   * Return the day of the year
   * January 1 is the first day of the year
   * @return  If we are planning to return Jan 1st 2020
   * ex : 20200101000000 - > 2020 01 01 000000
   */
  function getDate(){
    
    date = new Date();
    var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
    var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
    var yyyy = date.getFullYear();
 
    // create the year
    return (yyyy + MM +dd +"000000" );
 }



 function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}


