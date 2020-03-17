
if (localStorage.getItem("mesonentStations") === null) {
    // Getting data from the mesonent stations and store it in the local storage
    getMesonetStations();
}

if (localStorage.getItem("userLatitude") === null) {
// Get the user locations if userLatitude is not set
   getLocation();
}

// What you need
// All the mesonent station need to be loadeed and set
// User geolocation need to be set
findClosestStation();

function getLocation() {
    console.log("wating on lnavigator.geolocationocation");
    if (navigator.geolocation) {
        console.log("Got approval");
        navigator.geolocation.getCurrentPosition(realtimePosition);
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
   localStorage.setItem('userLatitude', realtimeLatitude);
   localStorage.setItem('userLongitude', realtimeLongitude);
  /*  CoordinatesHolder.setAttribute('data-latitude', realtimeLatitude);
   CoordinatesHolder.setAttribute('data-longitude', realtimeLongitude); */
}


function getMesonetStations(){
   
    const FETCH_TIMEOUT = 5000;
    let didTimeOut = false;
    new Promise(function(resolve, reject) {
        const timeout = setTimeout(function() {
            didTimeOut = true;
            findNearestStation();
            reject(new Error('Request timed out'));
        }, FETCH_TIMEOUT);
        
        fetch('https://mesonet.k-state.edu/rest/stationnames/')
        .then(response =>  {
            // Clear the timeout as cleanup
            clearTimeout(timeout);
            if(!didTimeOut) {
                //console.log('fetch good! ', response);
                //var objthing = response.text();
                resolve(response);
            }
            return response.text();
        })
        .then(data => {
            // The returned data set has columns names and values devidede  by /n 
            // Seperated by /n 
            console.log("got in the system");
            //console.log(data);

            array = dataToArray(data);
            //localStorage.setItem('mesonentStationsArray', JSON.stringify(newArray));
            localStorage.setItem('mesonentStations', JSON.stringify(array));
            //var lineSeperation = data.split(/\r?\n/);
            // Setting the value in the local storage
        // localStorage.setItem('mesonetWeatherData', JSON.stringify(lineSeperation[1]));
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

// Convert a string to an array sdsds /n sdsdsd,asdsd,sdsd,sd /n
function dataToArray (data) {
    rows = data.split("\n");

    return rows.map(function (row) {
    	return row.split(",");
    });
};


function findClosestStation(){
    var mesonentStations = localStorage.getItem('mesonentStations');
    //mylocationLat = 39.1863889 ;
    var mylocationLat = localStorage.getItem('userLatitude');
    //mylocationLon  = -96.5894169;
    var mylocationLon = localStorage.getItem('userLongitude');
    var stationData = JSON.parse(mesonentStations);

    // 2 lat
    // 3 long
    var d ; // distance
    var distanceList = [];
    for (var i=1;i < stationData.length; i++){
        d = distance(mylocationLat,mylocationLon,stationData[i][2],stationData[i][3])
        console.log(i,stationData[i][0],d);
        distanceList.push(d);  
    } 

    Array.min = function( array ){
        return Math.min.apply( Math, array );
    };

    var minimum = Array.min(distanceList);
    var key = distanceList.indexOf(minimum);
    var index = key +1
    //  Returning the station
  //  localStorage.setItem("nearestStation",stationData[index][0]);
    return minimum;
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