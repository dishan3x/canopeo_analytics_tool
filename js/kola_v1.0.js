let imgOriginal;
let imgCounter = 0;
var percentCanopyCover;

var resultsTable;

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

var weatherObj; 
var instances ="";
var elems = "";
var apiInformationDiv = "";

let mesonentStations;
var stationDataCSV;
var loadingWeatherDataLabel;
var btnUploadLabel;

function preload() {

     // Check whether the user variable get set from the index.html page
     // If not redirect the user to the inorder to preserve the flow of the code.
     if (localStorage.getItem("userLatitude") === null  || localStorage.getItem("userLongitude") === null) {
         window.location = "index.html";
     }

     //stationDataCSV = loadTable("data/stationData.csv","csv", "header");
     stationDataCSV = loadTable("https://raw.githubusercontent.com/dishan3x/canopeo_analytics_tool/master/data/stationData.csv","csv", "header");
       
}

function setup() {

    console.log("Running Kola app. version 1.0.");

    // Converting the data in to JSON
    convertStationsTOJSON();

    // All the mesonent station need to be loadeed and set
    var userLocationLat = localStorage.getItem('userLatitude');
    var userLocationLon = localStorage.getItem('userLongitude');
    var [matchedStation,minimumDistance] = findClosestStation(userLocationLat,userLocationLon); // User geolocation need to be set
    var distanceLabelText = document.getElementById("distanceLabelText");
    var nearestStationLabelText = document.getElementById("nearestStationLabelText");

    localStorage.setItem('nearestStation',matchedStation); 
    
    distanceLabelText.innerHTML = minimumDistance.toFixed(2)+" miles ";
    
    nearestStationLabelText.innerHTML = matchedStation;
    
    btnUploadLabel = document.getElementById('btn-upload-label');

    // Users altutude and latitude
    userLattitudeText = document.getElementById('userLattitudeText');
    userLattitudeText.innerHTML = localStorage.getItem("userLatitude");

    // Users altutude and latitude
    userLongitudeText = document.getElementById('userLongitudeText');
    userLongitudeText.innerHTML = localStorage.getItem("userLongitude");

    // Arranging HTML content 
    resultsGrid = document.getElementById('resultGrid');
    resultsGrid.style.display = "none";
    apiInformationDiv = document.getElementById('api-information-div');
    leafImageContainer = document.getElementById("leafcontainer");
    loadingWeatherDataLabel = document.getElementById('weatherDataStatusLabel');

    // Upload button
    btnUpload = createFileInput(gotFile,'multiple');
    btnUpload.style('display','none');
    btnUpload.parent("btn-upload-label");

    // Check for the mesonent data retrive
    // null, undefined , Nan, Empty string ,  0 ,false  
    // ************************** only for testing remove afterwards 

    /* if (localStorage.getItem("mesonetWeatherData") == null) {
        localStorage.setItem("mesonetWeatherData","");
    } */

    if (Object.keys(localStorage.getItem("mesonetWeatherData")).length < 1) {
        // This function will run until it achieved the data
        getWeatherData();
        btnUpload.attribute('disabled', '');

    }else{
        // if the object is in the local storage check the date stored
        // Getting the data object from local storage
        weatherObj =  getMesonentDataFromLocalStorage();
        // format of datq  : 2020-02-2400000000000
        //               ex :2020-02-24 00000000000
        dateCheck = getDate();
        loggedDate = weatherObj.storedDate;
        btnUploadLabel.onclick = null;
        if(dateCheck == loggedDate){ // check the weather updated time stamo
            console.log("The mesonent data is loaded to the system");
        }else{
            // Retriving data from the Mesonent Api
            // update has a old date. 
            getWeatherData();
            alert("Date did not match, gethering Data from the mesonent Api");
        }
    }

}  // End setup()


/** 
 * Navigation Bar Functions
 * */  
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    alert("open");
  }
  
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    alert("close");
  }

function retakeSnap(){
    resultsGrid.style.display = "none";
    apiInformationDiv.style.display = "block";
    leafImageContainer.style.display  ="block";
}

/**
 * got File function will trigger when the data is updated.
 */
function gotFile(file) {
    if(imgCounter <= 50){
        if (file.type === 'image'){
            loadImage(file.data,function(imgOriginal){

                // Clean the result grid value
                document.getElementById("canopeoCover_val").innerHTML ="";
                document.getElementById("cropCoefficient_val").innerHTML = "";
                document.getElementById("evapotranspiration_val").innerHTML = "";
                document.getElementById("cropEvapotranspiration_val").innerHTML ="";

                var anlysedImgTag = document.getElementsByClassName('analysed-images-tag');
                    if (anlysedImgTag !== null){
                        document.getElementById("orignal-image").innerHTML ="";
                        document.getElementById("classified-image").innerHTML ="";
                    }

                leafImageContainer.style.display = "none";
  
                // Start counting images
                imgCounter += 1;

                // Displaying the result grid 
                resultsGrid.style.visibility = 'visible';
                resultsGrid.style.display = "block";
                // Hide the api status from the screen
                apiInformationDiv.style.display = "none";
    
                let imgOriginalId = 'img-original' + imgCounter; // Needed to call EXIF data
                
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

                // Thumbnail original image
                thumbnailOriginal = createImg(imgOriginal.canvas.toDataURL());
                thumbnailOriginal.size(imgClassified.width*aspectRatio,imgClassified.height*aspectRatio);
                thumbnailOriginal.size(imgOriginal.width,imgOriginal.height);
                thumbnailOriginal.id(imgOriginalId);
                thumbnailOriginal.parent('orignal-image');
                thumbnailOriginal.addClass('analysed-images-tag');
                
                // Thumbnail classified image
                thumbnailClassified = createImg(imgClassified.canvas.toDataURL());
                thumbnailClassified.size(128*aspectRatio,128*aspectRatio);
                thumbnailClassified.size(imgOriginal.width,imgOriginal.height);
                thumbnailClassified.id(imgClassifiedId);
                thumbnailClassified.parent('classified-image');
                thumbnailClassified.addClass('analysed-images-tag');
                //thumbnailClassified.style.border = "5px solid black;"
                
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
                 locationObj = new customLocation(37.77071,-457.23999,-9999);
                 etoVal = getETOValue(locationObj,weatherObj);
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
               /*  originals.file(imgName + '.jpg', dataURItoBlob(imgOriginal.canvas.toDataURL('image/jpeg')), {base64: true});
                classified.file(imgName + '.jpg', dataURItoBlob(imgClassified.canvas.toDataURL('image/jpeg')), {base64: true}); */
          });
        }else{
            alert("The file entered is not valid. Please enter a image");
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
/* 
    Get users location
    The location will be updated to the local storage
*/
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(realtimePosition);
    } else {
        realtimeLatitude = null;
        realtimeLongitude = null;
        realtimeAltitude = null;
        country = null;
        state = null;
        region = null;
        console.log('Navigator not available')
    }
}

/**
 * Call back function for get location
 * */ 
function realtimePosition(position) {
 
   realtimeLatitude =  position.coords.latitude;
   realtimeLongitude = position.coords.longitude; 
   realtimeAltitude = position.coords.altitude;

   // Reduce the sensitivit of the cordinates

   realtimeLatitude = realtimeLatitude * 1000
   realtimeLatitude = realtimeLatitude.toFixed(2);
   realtimeLatitude = realtimeLatitude/1000;
   realtimeLatitude = realtimeLatitude.toFixed(2);
   
   realtimeLongitude = realtimeLongitude * 1000
   realtimeLongitude = realtimeLongitude.toFixed(2);
   realtimeLongitude = realtimeLongitude/1000;
   realtimeLongitude = realtimeLongitude.toFixed(2);

   localStorage.setItem('userLatitude', realtimeLatitude);
   localStorage.setItem('userLongitude', realtimeLongitude);

   // Users altutude and latitude
    var userLattitudeText = document.getElementById('userLattitudeText');
    userLattitudeText.innerHTML = realtimeLatitude;

    // Users altutude and latitude
    var userLongitudeText = document.getElementById('userLongitudeText');
    userLongitudeText.innerHTML = realtimeLongitude;

}

/**
 *  Retrive data from the Mesonet Api and store the infromaton from in the local storage of the browser
 */
function getWeatherData(){
    nearestStation = localStorage.getItem("nearestStation");
    dateStr = getDate();
    weatherT = ""; 
    url = "https://mesonet.k-state.edu/rest/stationdata/?stn="+nearestStation+"&int=day&t_start="+dateStr+"&t_end="+dateStr+"&vars=PRECIP,WSPD2MVEC,TEMP2MAVG,TEMP2MMIN,TEMP2MMAX,RELHUM2MMAX,RELHUM10MMIN,SR,WSPD2MAVG";
    loadingWeatherDataLabel.innerHTML = 'Loading Weather Data <i class="fas fa-sync fa-spin">';
    const FETCH_TIMEOUT = 5000;
    let didTimeOut = false;
    new Promise(function(resolve, reject) {
        const timeout = setTimeout(function() {
            didTimeOut = true;
            getWeatherData();
            reject(new Error('Request timed out'));
        }, FETCH_TIMEOUT);
        
        fetch(url)
        .then(response =>  {
            // Clear the timeout as cleanup
            clearTimeout(timeout);
            if(!didTimeOut) {
                console.log('fetch good! ', response);
                resolve(response);
            }
            return response.text();
        })
        .then(data => {
                // The returned data set has columns names and values devidede  by /n 
                // Seperated by /n 
                loadingWeatherDataLabel.innerHTML = 'Weather data retrieved <i class="fas fa-check"></i>';
                btnUpload.removeAttribute('disabled');    
                btnUploadLabel.onclick = null;
                var lineSeperation = data.split(/\r?\n/);
                // Setting the value in the local storage
                localStorage.setItem('mesonetWeatherData', JSON.stringify(lineSeperation[1]));
        })
        .catch(function(err) {
            console.log('fetch failed! ', err);
            
            // Rejection already happened with setTimeout
            if(didTimeOut) return;
            // Reject with error
            reject(err);
        });
    })
    .then(function() {
        // Request success and no timeout
        console.log('good promise, no timeout! ');
    })
    .catch(function(err) {
        // Error: response error, request timeout or runtime error
        console.log('promise error! ', err);
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
 * @param {object} location  An object carries langgitude and latitude
 * @param {object} weather  Kansas mesonent api data
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
    var diff = today - start; // time differnece by second
    var oneDay = 1000 * 60 * 60 * 24;
    var days = Math.floor(diff / oneDay); // calculate days 
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
   * Generate the string which contain the date string guidline for Kansas mesonet api 
   * January 1 is the first day of the year
   * @return  
   * ex : If we are planning to return Jan 1st 2020
   *      20200101000000 - > 2020 + 01 + 01 + 000000
   */
  function getDate(){
    
    date = new Date();
    // getting the yesterday date
    date.setDate(date.getDate() - 1);
    var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
    var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
    var yyyy = date.getFullYear();
 
    // create the year
    return (yyyy + MM +dd +"000000" );
 }

/**
 * calculate great-circle distance between two points on a sphere using 
 * haversine function
 * @param {float} lat1  location 1 latitude
 * @param {float} lon1  location 1 longitude
 * @param {float} lat2  location 2 latitude
 * @param {float} lon2  location 2 longitude
 * @returns {float} distant in miles
 */
function distance(lat1, lon1, lat2, lon2) {

     // Prototype function to ease the calucation of the radians
   
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
        // converting to radians in to radians
        var dLat =((lat2 - lat1) * Math.PI ) / 180;  
        var dLon = ((lon2 - lon1)* Math.PI ) / 180;  
        // convert to radians 
        lat1 = (lat1 * Math.PI ) / 180; 
        lat2 = (lat2 * Math.PI ) / 180; 
        // apply formulae 
        var a = Math.pow(Math.sin(dLat / 2), 2) +  
                Math.pow(Math.sin(dLon / 2), 2) *  
                Math.cos(lat1) *  
                Math.cos(lat2); 
        var rad = 3958.8;  // radias of the earth in miles
        var c = 2 * Math.asin(Math.sqrt(a)); 
        return rad * c ; // distance in miles 
		
	}
}

/**
 *  Read the data/stationData.csv and save the file in the 
 */
function convertStationsTOJSON(){

  //cycle through the table
  var strMesonentStation ="{"

  for ( let r = 0; r < stationDataCSV.getRowCount(); r++){
    strMesonentStation += '"'+ stationDataCSV.getString(r, 0)+'":{';
    for (let c = 0; c < stationDataCSV.getColumnCount(); c++) {
        strMesonentStation += '"'+stationDataCSV.columns[c] + '":"'+stationDataCSV.getString(r, c) +'",';  
    }
    strMesonentStation = strMesonentStation.substring(0, strMesonentStation.length - 1);
    strMesonentStation += "}," ;   
  } 
  
  strMesonentStation = strMesonentStation.substring(0, strMesonentStation.length - 1);
  strMesonentStation += "}"
  // Place the strigyfy JSON string in the local storage
  localStorage.setItem('mesonentStations', strMesonentStation);   

}

// Generate array from an input of string from file
/**
 * 
 * @param {string} data input string with '/n' 
 */
function dataToArray (data) {
    rows = data.split("\n");
    return rows.map(function (row) {
    	return row.split(",");
    });
};


/**
 * Finds the nearest station to the user location
 * @param {float} userLocationLat : users current location latitude  
 * @param {float} userLocationLon : users current location longitute
 * @returns {list} [ nearest station , minimim distance]
 */

function findClosestStation(userLocationLat,userLocationLon){

    var retrievedStations = localStorage.getItem('mesonentStations');
    var stationData = JSON.parse(retrievedStations); // Getting the data from the local storage
    var d ; // distance
    var distanceArray = new Array();

    // Calculate distance between two locations
    for ( stationName in stationData){  
        d = distance(userLocationLat,userLocationLon,stationData[stationName].LATITUDE,stationData[stationName].LONGITUDE);
        distanceArray[stationName] = d;
    }

    var keys   = Object.keys(distanceArray);
    var minimumDistance = Math.min.apply(null, keys.map(function(x) { return distanceArray[x]} ));
    var matchedStation  = keys.filter(function(y) { return distanceArray[y] === minimumDistance });

    return [matchedStation,minimumDistance];
}