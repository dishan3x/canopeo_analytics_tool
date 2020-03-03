//getStations();
function getStations(){
    // module for weather
    
    url = "https://mesonet.k-state.edu/rest/stationnames/";
    fetch(url)
    .then(res => {
        console.log("res");
        console.log(res);
        return res.text();
    })
    .then(data => {
       // The returned data set has columns names and values devidede  by /n 
       // Seperated by /n 
       console.log(data);
       var lineSeperation = data.split(/\r?\n/);
       // Setting the value in the local storage
      // localStorage.setItem('mesonetWeatherData', JSON.stringify(lineSeperation[1]));
   });
}



//ss();
caculateClosestStation();
function caculateClosestStation(){
    var retrievedObject = localStorage.getItem('mesonentStations');
    mylocationLat = 39.1863889 ;
    mylocationLon  = -96.5894169;
    var someData = JSON.parse(retrievedObject);
    // 2 lat
    // 3 long
    var d ; // distance
    var distanceList = [];
    for (var i=1;i < someData.length; i++){
        //console.log(someData[i][2]);
        d = distance(mylocationLat,mylocationLon,someData[i][2],someData[i][3])
        console.log(i,someData[i][0],d);
        distanceList.push(d);
        
        
    } 

    Array.min = function( array ){
        return Math.min.apply( Math, array );
    };

    var minimum = Array.min(distanceList);
    var key = distanceList.indexOf(minimum);
    var index = key +1
    
    //console.log(someData[i][0],distanceList);
    console.log("log the pushed array",key,index);
    console.log(someData[index])
    //kk = someData.split('\n');
    
    //console.log(kk[5]);

}


function ss(){
    console.log("in");
const FETCH_TIMEOUT = 5000;
let didTimeOut = false;

new Promise(function(resolve, reject) {
    const timeout = setTimeout(function() {
        didTimeOut = true;
        ss();
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

function dataToArray (data) {
    rows = data.split("\n");

    return rows.map(function (row) {
    	return row.split(",");
    });
};

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
