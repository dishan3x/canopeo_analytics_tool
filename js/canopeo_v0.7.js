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


//var userDatabaseRef;
var imgOriginalsRef;
var imgClassifiedRef;
var storageRef;
var user;
var zip = new JSZip();
var originals = zip.folder("originals");
var classified = zip.folder("classified");

var w = 0;
var h = 0;

//Creating 


/* 
    - Getting the weather data stored in the system
    - Just to get rid of any delay
    - I think its works , But when tested this in local system its pretty slow. 
*/
/* initApp = function() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        //console.log(user)

        publicDatabaseRef = firebase.database().ref('publicMetadata');
        //userDatabaseRef = firebase.database().ref(user.uid + '/metadata');
        storageRef = firebase.storage().ref(user.uid + '/originals/');

      } else {
        // User is signed out.
        window.location.href = 'index.html'
      }
    }, function(error) {
      console.log(error);
    });
  };

  window.addEventListener('load', function() {
    initApp()
  });

  window.addEventListener('close', function(){
      firebase.auth().signOut();
  }) */


  window.onload = sayHello;

  function sayHello(){
    console.log("hello world to say hello");
}




function setup() {
    // Print software version
    console.log('Running v0.7');
   
    // Dropzone
    // commented by dishan
    // sinse we are not using the drop picture methods
   /*  dropzone = select('body');
    dropzone.drop(gotFile); // Handing the dropzon js library */

    
    // Create table for storing images
    // Handle a  only  one picture 
    // Dishan Changes
    // no need

    table = new p5.Table();
    table.addColumn('name');
    table.addColumn('vegetationType');
    table.addColumn('snapDate');
    table.addColumn('uploadDate');
    table.addColumn('latitude');
    table.addColumn('longitude');
    table.addColumn('altitude');
    table.addColumn('canopyCover');
    table.addColumn('eto');
    table.addColumn('eto-crop');


    //c =createCanvas(window.innerWidth, window.innerHeight);
    w = window.outerWidth;
    h = window.outerHeight;
    //create a video capture object
    capture = createCapture({
        audio: false,
        video: {
            width: w,
            height: h
        }
    }, function() {
        console.log('capture ready.');
    });
    capture.elt.setAttribute('playsinline', '');
    //capture.hide();
    capture.size(w, h);
    canvas = createCanvas(w, h);
    canvas.parent('cameraCanvas');
    //canvas.resize(w,h);

    var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  canvas.position(x, y);
    //https://github.com/processing/p5.js/issues/2847

    //Crreating the Snap button
    //background(0);
    button = createButton('Take snap');
    button.parent('cameraCanvas');
    let col = color(25, 23, 200, 50);
    button.style('background-color', blue);
    button.style('height', '60px');
    button.style('width', '100px');
    button.position(w/2,2*h-100);

    button = createButton('Take snap');
    button.parent('cameraCanvas');
    let colv = color(25, 23, 200, 50);
    button.style('background-color', blue);
    button.style('height', '60px');
    button.style('width', '100px');
    button.position(w/2,2*h-100);
    button.mousePressed(takeSnap);
    //the createCapture() function creates an HTML video tag
    //as well as pulls up image to be used in p5 canvas
    //hide() function hides the HTML video element
    capture.hide();

  

    // Upload button
    //btnUpload = createFileInput(gotFile,'multiple');
    /* btnUpload = createCapture(gotFile);
    btnUpload.parent('btnUploadLabel');
    btnUpload.style('display','none');
    btnUpload.elt.disabled = true; */
    


    // Dishan Somethin important
   // document.getElementById('btnUploadLabel').addEventListener('click',getVegetationType)

 
    //btnUploadLabel = document.getElementById('btnUploadLabel');
    // btnUploadLabel.addEventListener('mouseover', function(){
    //     if (vegetationType === 'empty'){
    //         alert('We would appreciate you contribute with a valid vegetation type.')
    //     }
    // })

    let downloadTimestamp = new Date();

    // Download CSV button
    btnDownloadCSV = document.getElementById("btnDownloadCSV")
    btnDownloadCSV.style.visibility = 'hidden';
    btnDownloadCSV.addEventListener("click", function(){
        saveTable(table, 'metadata_' + downloadTimestamp.getTime() + '.csv'); // p5 Function
    });

    // Download Images button
    btnDownloadImg = document.getElementById("btnDownloadImg")
    btnDownloadImg.style.visibility = 'hidden';
    btnDownloadImg.addEventListener("click", function(){
        zip.generateAsync({type:"blob"})
        .then(function(content) {
            // need FileSaver.js
            //console.log(content)
            saveAs(content, 'images_' + downloadTimestamp + '.zip');
        });
    });

    // Hide results table
    resultsTable = document.getElementById('resultsTable');
    resultsTable.style.visibility = 'hidden';
}


/* function draw() {
    background(220);
    
    //draw video capture feed as image inside p5 canvas
   image(capture, 0, 0);
  }
 */
// Event listener for Logout button
/* btnLogout.addEventListener('click', function(e){
    firebase.auth().signOut();
    window.location.href = 'index.html';
}) */
/* function takeSnap() {
    savedFrame = saveFrames('out', 'png', 1, 1, data => {
        console.log(data);
        gotFile(data.data);
        capture.remove();
    });
} */

var capture;
var buttonTirarFoto;
var buttonSalvarFoto;
var fotoTirada;
var modo = 0;
var confirmarTakeSnap = false;




function draw() {  
    
    width  = window.outerWidth;
    height =  window.outerHeight;  
    //background(0,128,0);
    background(40,128,0);
    

   // console.log("worked");
  if(modo == 0){ 
    //image(capture, width+ 25, 0); 
     
    image(capture, 0,0);   
    console.log("lol");
  }else if(modo == 1){
    background(255);
    console.log("here mode 1");
    image(fotoTirada, 0, 0, 0, 0);
    saveCanvas("minhaFoto", "jpg");
    capture.remove();
    //background(255);
    modo = 0;
  }
} 

function takeSnap(){
    //tint(255);
    image(capture, 0, 0);
    fotoTirada = capture.get();
    console.log(fotoTirada);
    gotFile(fotoTirada);
    image(fotoTirada, 20, 0);
    noLoop();
    //capture.remove();
    //capture.hide();
    
    //Tive que usar esse codigo abaixo anteriormente para a camera não travar ao usar o capture.get().
    // capture = createCapture(VIDEO); consegui evitar de usar esse codigo que suja cada vez mais o html com novas tags de video
    //capture.hide(); colocando o tint ali em cima.
    
    confirmarTakeSnap = true;
}


function gotFile(imgOriginal) {
    console.log("logged");
    //createImage(image(cam, 0, 0, 320, 240),'somefiel');
    //saveCanvas(cc, 'myCanvas', 'jpg');
   // loadImage(image(cam, 0, 0, 320, 240));
    console.log("arrive here also");
    
    console.log("arrive here also 2");
    
    console.log("arrive here also 3");
   //image(savedFrame,10, 10, 50, 50);
        console.log("almost there");
/*     if(imgCounter <= 50){
        if (savedFrame.type === 'image'){ */
            console.log("almost there");
          //  loadImage(file,function(imgOriginal){
                console.log("in geo location");
                // Get geographic coordinates
                getLocation();
                //console.log(geoCordinates);
                console.log(getLocation());
               
               console.log("pass location");

                // Start counting images
                imgCounter += 1;

                // Make results table visible
                if (imgCounter === 1){
                   // dragDropBanner.remove()
                    resultsTable.style.visibility = 'visible';
                    btnDownloadCSV.style.visibility = 'visible';
                    btnDownloadImg.style.visibility = 'visible';
                }
    
                let imgOriginalId = 'img-original' + imgCounter; // Needed to call EXIF data
                let imgClassifiedId = 'img-classified' + imgCounter; // Not needed, but added for consistency with imgOriginal
    
                // Generate Id for table cells
                let imgCounterCellId = 'img-counter-cell';
                let imgOriginalCellId = 'img-original-cell' + imgCounter; //'img-container'+imgCounter;
                let imgClassifiedCellId = 'img-classified-cell' + imgCounter; //'img-container'+imgCounter;
                let vegetationTypeCellId = 'vegetation-type-cell' + imgCounter;
                let filenameCellId = 'filename-cell' + imgCounter;
                let canopyCoverCellId = 'canopy-cover-cell' + imgCounter;
                let latitudeCellId = 'latitude-cell' + imgCounter;
                let longitudeCellId = 'longitude-cell' + imgCounter;
                let altitudeCellId = 'altitude-cell' + imgCounter;
                let etoCellId ='eto-cell'+ imgCounter;
                let etoCropId ='eto-crop'+ imgCounter;
     

                console.log("passed creating elements");
                console.log(imgOriginal);
                // Create table row
                let tableRow = createElement('tr','<td '+ 'id="' + imgCounterCellId + '"' + '></td>' + '<td '+ 'id="' + imgOriginalCellId + '"' +'></td>'+'<td '+ 'id="' + imgClassifiedCellId + '"' +'></td>' + '<td class="is-hidden-mobile" '+ 'id="' + vegetationTypeCellId + '"' + '></td>' + '<td class="is-hidden-mobile" '+ 'id="' + filenameCellId + '"' + '></td>' + '<td class="is-hidden-mobile" '+ 'id="' + latitudeCellId + '"' + '></td>' + '<td class="is-hidden-mobile" ' + 'id="' + longitudeCellId + '"' + '></td>' + '<td class="is-hidden-mobile" '+ 'id="' + altitudeCellId + '"' + '></td>'+'<td '+ 'id="' + canopyCoverCellId + '"' + '></td>' +'<td '+ 'id="' + etoCellId + '"' + '></td>'+'<td '+ 'id="' + etoCropId + '"' + '></td>'  ).parent('resultsTable');    
               // let createGrid =     <div class="row">
    
          
                // Get upload timestamp
                uploadDate = new Date();
                
                // Resize image so that the largest side has 1440 pixels
                if(imgOriginal.width>=imgOriginal.height){
                    imgOriginal.resize(1440,0); 
                } else {
                    imgOriginal.resize(0,1440);
                }
                imgOriginal.loadPixels();

                console.log("passed resizing");
                
                // Initiatve classified image
                imgClassified = createImage(imgOriginal.width,imgOriginal.height);
                imgClassified.loadPixels();
                console.log("passed classify images");
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
                thumbnailOriginal = createImg(imgOriginal);
                thumbnailOriginal.size(128*aspectRatio,128)
                thumbnailOriginal.id(imgOriginalId)
                thumbnailOriginal.parent(imgOriginalCellId)
                
                // Thumbnail classified image
                thumbnailClassified = createImg(imgClassified.canvas.toDataURL());
                thumbnailClassified.size(128*aspectRatio,128);
                thumbnailClassified.id(imgClassifiedId);
                thumbnailClassified.parent(imgClassifiedCellId);
                thumbnailClassified.style.border = "5px solid black;"

                /* EXIF.getData(document.getElementById(imgOriginalId), function() {
                     //var allMetaData = EXIF.getAllTags(this);
                     //console.log(JSON.stringify(allMetaData, null, "\t"));
                    snapDate = EXIF.getTag(this, "DateTime");
                    latArray = EXIF.getTag(this, "GPSLatitude");
                    latRef = EXIF.getTag(this, "GPSLatitudeRef")
                    lonArray = EXIF.getTag(this, "GPSLongitude");
                    lonRef = EXIF.getTag(this, "GPSLongitudeRef");
                    altitude = EXIF.getTag(this, "GPSAltitude");
                    altitudeRef = EXIF.getTag(this, "GPSAltitudeRef");
                });
 */
                
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
                 weather =  getWeatherData();
                 lt = new locationCustom(37.77071,-457.23999,-9999);
                 etoVal = getETOValue(lt,weather);
                 etCrop = getETCrop(percentCanopyCover,etoVal);
                 console.log("passed eto crop value",etCrop);
                // Update HTML table
                resultsTable.rows[imgCounter].cells[imgCounterCellId].innerHTML = imgCounter;
                resultsTable.rows[imgCounter].cells[vegetationTypeCellId].innerHTML = vegetationType;
                resultsTable.rows[imgCounter].cells[filenameCellId].innerHTML = "some file";
                resultsTable.rows[imgCounter].cells[canopyCoverCellId].innerHTML = percentCanopyCover;
                resultsTable.rows[imgCounter].cells[etoCellId].innerHTML = etoVal;
                resultsTable.rows[imgCounter].cells[etoCropId].innerHTML = etCrop;

                if(latitude === null){
                    resultsTable.rows[imgCounter].cells[latitudeCellId].innerHTML = 'Unknown';
                } else {
                    console.log("lattitude",latitude);
                    resultsTable.rows[imgCounter].cells[latitudeCellId].innerHTML = latitude;
                }

                if(longitude === null){
                    resultsTable.rows[imgCounter].cells[longitudeCellId].innerHTML = 'Unknown';
                } else {
                    console.log("lattitude",longitude);
                    resultsTable.rows[imgCounter].cells[longitudeCellId].innerHTML = longitude;
                }

                if(altitude === null){
                    resultsTable.rows[imgCounter].cells[altitudeCellId].innerHTML = 'Unknown';
                } else {
                    console.log("lattitude",altitude);
                    resultsTable.rows[imgCounter].cells[altitudeCellId].innerHTML = altitude;
                }

               

                // Append to output table
                var newRow = table.addRow();
                newRow.set('name', "somefile");
                newRow.set('vegetationType', vegetationType);
                newRow.set('snapDate', snapDate);
                newRow.set('uploadDate', uploadDate.toString()); // For downloadable file write date on a human readable format
                newRow.set('latitude', latitude);
                newRow.set('longitude', longitude);
                newRow.set('altitude', altitude);
                newRow.set('canopyCover', percentCanopyCover);
                newRow.set('eto', etoVal);
                newRow.set('eto-crop', etoVal);

                document.getElementById("canopeoCover_val").innerHTML =percentCanopyCover;
                document.getElementById("cropCoefficient_val").innerHTML = getCropCoeffcient(percentCanopyCover);
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

            
                // Send metadata to Firebase
                //publicDatabaseRef.push(data);
                
                // Send original images to Firebase
                imgOriginalsRef = storageRef.child(imgName);
                imgOriginalsRef.put(dataURItoBlob(imgOriginal.canvas.toDataURL('image/jpeg'))); //refImages.put(file.file); for full resolution img
                
                // Send classified images to Firebase
                //imgClassifiedRef = storageRef.child(imgName);
                //imgClassifiedRef.put(dataURItoBlob(imgClassified.canvas.toDataURL('image/jpeg')));
                //storageRef.put(dataURItoBlob(imgOriginal.canvas.toDataURL('image/jpeg')));

                // Add original and classified images to ZIP file
                originals.file(imgName + '.jpg', dataURItoBlob(imgOriginal.canvas.toDataURL('image/jpeg')), {base64: true});
                classified.file(imgName + '.jpg', dataURItoBlob(imgClassified.canvas.toDataURL('image/jpeg')), {base64: true});
           // });
    /*     }
        // getting the weather data
       
    } */
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
//getVegetationType(); 

function getLocation() {
    console.log("wating on lnavigator.geolocationocation");
    if (navigator.geolocation) {
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




 function getWeatherData(){
    // module for weather
    
    /*windspeed = WSPD2MVEC	
    tempAvg =  TEMP2MAVG
    tempMin = TEMP2MMIN
    tempMax =TEMP2MMAX
    humidityMax =RELHUM2MMAX
    humidityMin = RELHUM10MMIN
    doy = 1
    solarRad = SR
    */
    console.log("esd");
    // Date today
    // 
    
   date = new Date();
    console.log("todaysDate",date);
    dateCustomize = "" ; 
    
    dateStr = getDate();
    weatherT = ""; 
   url = "https://mesonet.k-state.edu/rest/stationdata/?stn=Ashland%20Bottoms&int=day&t_start="+dateStr+"&t_end="+dateStr+"&vars=PRECIP,WSPD2MVEC,TEMP2MAVG,TEMP2MMIN,TEMP2MMAX,RELHUM2MMAX,RELHUM10MMIN,SR,WSPD2MAVG";
   console.log("asdasdsadaddadadd ", url);
    fetch(url)
   .then(res => {
       
       return res.text();
   })
   .then(data => {
       // The returned data set has columns names and values devidede  by /n 
       // Seperated by /n 
       console.log("************************ Date Recieved *******************************************");
       var lineSeperation = data.split(/\r?\n/);
       console.log("someDate",lineSeperation[0]);
       var apiData = lineSeperation[1].split(",");
       //PRECIP,WSPD2MVEC,TEMP2MAVG,TEMP2MMIN,TEMP2MMAX,RELHUM2MMAX,RELHUM10MMIN,SR
       console.log("thevalue",apiData[0]);
       //var weather  = new weather("2019-02-04 00:00:00","Ashland Bottoms",14.98,12.29,20.69,90.38,49.51,0.0,10.32,4.73,day,dateStr);

       localStorage.setItem('testObject', JSON.stringify(lineSeperation[1]));

    
      
       /*  timestamp = 2019-02-04 00:00:00
       station = Ashland Bottoms
       tempAvg = 14.98
       tempMin = 12.29
       tempMax = 20.69
       humidityMax = 90.38
       humidityMin =  49.51
       precp =  0.0
       solarRad =  10.32
       windSpeed = 4.73
       doy = daay
       storedDate =  dateStr */


       /* apiData[0] // PRECIP
       apiData[1] // WSPD2MVEC
       apiData[2] // TEMP2MAVG
       apiData[3] // TEMP2MMIN 
       apiData[4] // TEMP2MMAX
       apiData[5] // RELHUM2MMAX
       apiData[6] // RELHUM10MMIN
       apiData[7] // SR
    */
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
       wr = new weather(apiData[0],apiData[1],apiData[2],apiData[3],apiData[4],apiData[5],apiData[6],apiData[7],apiData[8],dayOftheYear(),dateStr);
       weatherT = wr;
       console.log("printing new creted date", weatherT);
      // console.log("newDataSetCrated",data);
       
   });

   /* var data=JSONArray([TIMESTAMP,STATION,TEMP2MAVG,TEMP2MMIN,TEMP2MMAX,RELHUM2MMAX,RELHUM10MMIN,PRECIP,SR],
   [2019-01-01 00:00:00,Ashland Bottoms,-1.73,-9.77,2.76,90.74,67.15,0.0,2.14],
   [2019-01-02 00:00:00,Ashland Bottoms,-9.75,-11.67,-7.85,77.15,62.65,0.0,3.74); */
   // 2019-02-04 00:00:00,Ashland Bottoms,14.98,12.29,20.69,90.38,49.51,0.0,10.32,4.73 // for today
    console.log("testing the weather",  weatherT);
    //console.log("testing the weather", dataa);

    day = dayOftheYear();
    //timestamp: "2020-02-10 00:00:00",station: "Ashland Bottoms",tempAvg: "2.79",tempMin: "-1.76",tempMax: "6.28",humidityMax: "77.43",humidityMin: "55.88",precp: "0.0",solarRad: "10.26",windSpeed: undefined,doy: 41,storedDate: "20200210000000"
    //var weather  = new weather("2019-02-04 00:00:00","Ashland Bottoms",14.98,12.29,20.69,90.38,49.51,0.0,10.32,4.73,day,dateStr);
    var testObject = { 'one': 1, 'two': 2, 'three': 3 };


    if (localStorage.getItem("retrievedObject") === null) {
        // Run the file getweather function 
        console.log("Run the file getweather function ");
    }else{
        // The object is created 
        // Check the date
        console.log("The object is created/ Check the date ");
        //if()

    }
// Put the object into storage
   // localStorage.setItem('testObject', JSON.stringify(weather));

    
// Retrieve the object from storage
    var retrievedObject = localStorage.getItem('testObject');
    var apiData = retrievedObject.split(",").map(function(item) {
        return parseInt(item, 10);
    });
    wr = new weather(apiData[0],apiData[1],apiData[2],apiData[3],apiData[4],apiData[5],apiData[6],apiData[7],apiData[8],dayOftheYear(),dateStr);
    //local storage 
    console.log("retrievedObject",retrievedObject);
    console.log("wr",wr);

   // console.log('retrievedObject: ', JSON.parse(retrievedObject));
    console.log(weather);
    console.log("temperatuure avg"+weather.tempAvg);
    return wr;
    
}

/* function getWeatherDatau(){
    return fetch('http://mesonet.k-state.edu/rest/stationdata/?stn=Ashland%20Bottoms&int=day&t_start=20190101000000&t_end=20190201000000&vars=PRECIP,WSPD2MVEC,TEMP2MAVG,TEMP2MMIN,TEMP2MMAX,RELHUM2MMAX,RELHUM10MMIN,SR',
    {
    	method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log(responseData);
      return responseData;
    })
    .catch(error => console.warn(error));
  } */

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
    console.log("ETO value from the ",ETo);
    return Math.round(ETo*10)/10;
  }

  function dayOftheYear(){
    var today = new Date();
    var start = new Date(today.getFullYear(), 0, 0);
    console.log("start",start);
    var diff = today - start;
    var oneDay = 1000 * 60 * 60 * 24;
    var days = Math.floor(diff / oneDay);
    console.log("day",days);
    return days;
  }


  function getETCrop(cc,eto){
    let etCrop;
    etCrop = eto * getCropCoeffcient(cc);
    console.log("eto",eto);
    console.log("cc",cc);
    console.log("etcrop",etCrop);
    return Math.round(etCrop * 100) / 100;
  }

  function getCropCoeffcient(cropCoffection){
     return  (1.1 * (cropCoffection/100) + 0.17);
  }

  function getDate(){
    
    var day = date.getDate();

    var dd = (date.getDate() < 10 ? '0' : '') + date.getDate();
    
    var MM = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
    
    var yyyy = date.getFullYear();
 
    // create the yeart
    return (yyyy + MM +dd +"000000" );
 }


