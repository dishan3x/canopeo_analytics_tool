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
    let date = new Date();
    year = str(date.getFullYear);
    month = str(date.getMonth);
    day = str(date.getDay);
    hour = str(date.getHours);
    minutes =str(date.getMinutes);
    seconds = str(date.getSeconds);

    let newFormatedDate = year + month+day+day+hour+minutes+seconds;

    console.log(newFormatedDate);

    console.log(date);
    url = "http://mesonet.k-state.edu/rest/stationdata/?stn=Ashland%20Bottoms&int=day&t_start=20190101000000&t_end=20190201000000&vars=PRECIP,WSPD2MVEC,TEMP2MAVG,TEMP2MMIN,TEMP2MMAX,RELHUM2MMAX,RELHUM10MMIN,SR";
    daata = fetch(url)
    .then(res => {
        return res.text();
    })
    .then(data => {
        console.log(data);
        //$('#container').html(data);
    });

    console.log(daata);

    weather = new weather();
}

getWeatherData();