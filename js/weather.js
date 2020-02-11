class weather {
    constructor(TIMESTAMP,STATION,TEMP2MAVG,TEMP2MMIN,TEMP2MMAX,RELHUM2MMAX,RELHUM10MMIN,PRECIP,SR,WSPD10MAVG,DOY,storedDate) {
      this.timestamp = TIMESTAMP;
      this.station = STATION;
      this.tempAvg = TEMP2MAVG;
      this.tempMin  = TEMP2MMIN;
      this.tempMax = TEMP2MMAX;
      this.humidityMax = RELHUM2MMAX;
      this.humidityMin = RELHUM10MMIN;
      this.precp = PRECIP;
      this.solarRad = SR;
      this.windSpeed = WSPD10MAVG;
      this.doy = DOY;
      this.storedDate = storedDate;
    }
  }


  class locationCustom {
    constructor(latitude,longitude,elevation) {
      this.latitude = latitude;
      this.longitude = longitude;
      this.elevation = elevation;
    }
  }



