import React from "react";
import moment from 'moment-timezone';

const PORT = process.env.PORT || 3000;
const BACKENDSERVER = process.env.REACT_APP_URL || `http://localhost:${PORT}`;

class SearchField extends React.Component {
    constructor(props){
        super(props);

        this.inputRef = React.createRef(); // create a ref object
        this.submitRef = React.createRef();

        this.state = {
            input: '',
            nightMode: false,
            currentWeather: {
                city: '',
                weatherDesc: '',
                weatherType: 0, //This can be rain or snow per hour
                wind: '',
                temp: '',
                feelsLike: '',
                visibility: '',
                sunrise: 0,
                sunset: 0,
                currentTime: 0,      
            },
        }
    }


    componentDidMount() {
     this.inputRef.current.addEventListener('keypress', this.handleSearchFieldKeyUp);
    }
      
    componentWillUnmount() {
     this.inputRef.current.removeEventListener('keypress', this.handleSearchFieldKeyUp);
    }
      
    handleSearchFieldKeyUp = (event) => {
     if (event.key === 'Enter') {  this.submitRef.current.click() }
    }
      
    onChangeSearchField = (event) => {
     this.setState({input: event.target.value});
    }
      

    formatCityName = (cityData) => {
     const cityResp = cityData.toLowerCase();
     const cityInput = this.state.input.toLowerCase();

     if(cityResp.includes(cityInput)){
        const getPositionOfCity = cityResp.indexOf(cityInput);
        const getCity = cityResp.slice(getPositionOfCity);
        const formatCity = getCity.charAt(0).toUpperCase() + getCity.slice(1);

        return formatCity;
     }

    }

    convertLocalTime = (timeZone) => {
        const d = new Date()
        const localTime = d.getTime()
        const localOffset = d.getTimezoneOffset() * 60000
        const utc = localTime + localOffset
        const localTimeConversion = utc + (1000 * timeZone)
        const formatted12Hr = new Date(localTimeConversion)
                                                    .toLocaleTimeString('en-US',
                                                    {hour12:true,hour:'numeric',minute:'numeric'}).toLowerCase();
        return formatted12Hr;
    }

    convertSunriseSunset = (timeZoneOffsetInSeconds, sunriseSunsetUnixTime) => {
        const timezone = timeZoneOffsetInSeconds;
        const sunriseSunset = sunriseSunsetUnixTime;
        const sunTime = moment.utc(sunriseSunset,'X').add(timezone,'seconds').format('hh:mm a');     
        return sunTime;
    }

    nightMode = (sunriseUnixTime, sunsetUnixTime, timeZone) => {
        const sunriseTime = moment.unix(sunriseUnixTime).add(timeZone, 'seconds').format();
        const sunsetTime = moment.unix(sunsetUnixTime).add(timeZone, 'seconds').format();
        const currentTime = moment().add(timeZone, 'seconds');
        let isNightmode = false;
    
        if (currentTime.isBefore(sunriseTime) || currentTime.isAfter(sunsetTime)) {
            isNightmode = true;
        } else {
            isNightmode = false;
        }

        return isNightmode;
    };
    

    fetchWeatherData = () => {
        fetch(`${BACKENDSERVER}/CurrentWeather`, { //http://localhost:3000/CurrentWeather
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            cityName: this.state.input,
          })
        })
        .then(resp => resp.json())
        .then(data => {
          if(data.name){
            const transformedData = this.collectWeatherData(data);
            this.setState({
              currentWeather: transformedData,
              nightMode: this.nightMode(data.sys.sunrise, data.sys.sunset, data.timezone) 
            }, () => {
              this.props.loadCurrentWeather(this.state);
            });
          } else {
            this.setState({currentWeather: {}});
          }
        })
        .catch(err => {
          console.log(`Some error in fetch ${err}`);
          this.setState({currentWeather: {}});
        });
      }
      
      collectWeatherData = (data) => {
        return {
          ...this.state.currentWeather,
          city: this.formatCityName(data.name),
          weatherDesc: data.weather[0].main,
          weatherType: data.snow ?
                        data.snow['1h'] : data.rain ?
                            data.rain['1h'] : 0,
          wind: Math.round(data.wind.speed * 3.6),
          humidity: data.main.humidity,
          temp: parseFloat(Math.trunc(data.main.temp-273.15)).toString(), //Have to convert Kelvin to Celscious
          feelsLike: parseFloat(Math.trunc(data.main.feels_like-273.15)).toString(),
          visibility: data.visibility / 1000,
          sunrise: this.convertSunriseSunset(data.timezone, data.sys.sunrise),
          sunset: this.convertSunriseSunset(data.timezone, data.sys.sunset),
          currentTime: this.convertLocalTime(data.timezone)
        };
      }


    render(){
        return(
            <div className='font-sans'>
                <h1 className='p-5 text-5xl text-white'> Weather App </h1>
                <label>
                        <span ref={this.submitRef} 
                              className='relative inline-block -mr-8 z-10' 
                              onClick={this.fetchWeatherData}>
                            <svg className='h-4 w-5 fill-black' 
                                 xmlns='http://www.w3.org/2000/svg' 
                                 viewBox='0 0 25 25'>
                                <path
                                    d='M 13 3 C 7.4889971 3 3 7.4889971 3 13 C 3 18.511003 7.4889971 23 13 23 C 15.396508 23 17.597385 22.148986 19.322266 20.736328 L 25.292969 26.707031 A 1.0001 1.0001 0 1 0 26.707031 25.292969 L 20.736328 19.322266 C 22.148986 17.597385 23 15.396508 23 13 C 23 7.4889971 18.511003 3 13 3 z M 13 5 C 17.430123 5 21 8.5698774 21 13 C 21 17.430123 17.430123 21 13 21 C 8.5698774 21 5 17.430123 5 13 C 5 8.5698774 8.5698774 5 13 5 z'>
                                </path>
                            </svg>
                        </span>
                        <input ref={this.inputRef}
                                className='w-3/4 p-10 z-0 bg-white placeholder:font-italitc rounded-full py-2 pl-10 pr-4 focus:outline-none'
                                placeholder='Enter your city to search' 
                                type='text' 
                                onChange={this.onChangeSearchField}/>
                </label>
            </div>
        )
    }
}

export default SearchField;

