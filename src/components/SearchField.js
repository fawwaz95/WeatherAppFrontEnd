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
     }else{
        return cityData;
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
                  <div className="flex justify-center">
                    <div className="relative w-3/4">
                      <input ref={this.inputRef}  
                             onChange={this.onChangeSearchField} 
                             className="block p-2.5 w-full z-20 text-sm rounded-lg border-l-gray-50 border-l-2 border border-gray-300" 
                             placeholder="Search a City..." 
                             required/>
                      <button type="submit" 
                              ref={this.submitRef}
                              onClick={this.fetchWeatherData}
                              className="absolute top-0 right-0 p-2.5 text-sm font">
                                  <svg aria-hidden="true" 
                                       className="w-5 h-5" 
                                       fill="none" 
                                       stroke="currentColor" 
                                       viewBox="0 0 24 24" 
                                       xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" 
                                              strokeLinejoin="round" 
                                              strokeWidth="2" 
                                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z">
                                        </path>
                                    </svg>
                                  <span className="sr-only">Search</span>
                      </button>
                    </div>
                  </div>
            </div>
        )
    }
}

export default SearchField;

