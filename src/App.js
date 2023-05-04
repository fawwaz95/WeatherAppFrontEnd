import './App.css';
import Searchfield from './components/SearchField.js';
import CurrentWeather from './components/CurrentWeather';
import React from 'react';
import FiveDayForecast from './components/FiveDayForecast';

class App extends React.Component {
  constructor(props){
    super();
  
    this.state = {
      userInput: '',
      nightMode: false,
      weather: {
        city: '',
        weatherDesc: '',
        wind: '',
        humidity: '',
        temp: '',
        feelsLike: '',
        visibility: '',
        icon: '',
        weatherType: 0,
        sunrise: 0,
        sunset: 0,
        currentTime: 0,
      }
    }
  }

  loadCurrentWeather = (stateObj) => {
    const { currentWeather, nightMode } = stateObj;
    this.setState({
      weather: {
        ...this.state.weather,
        city: currentWeather.city,
        weatherDesc: currentWeather.weatherDesc,
        weatherType: currentWeather.weatherType,
        wind: currentWeather.wind,
        humidity: currentWeather.humidity,
        temp: currentWeather.temp,
        feelsLike: currentWeather.feelsLike,
        visibility: currentWeather.visibility,
        sunrise: currentWeather.sunrise,
        sunset: currentWeather.sunset,
        currentTime: currentWeather.currentTime
      },
      nightMode: nightMode
    })
  }

  render(){
    return(
      <div className="App center" id="cloud-intro">
        {this.state.nightMode ? <style>{'body {background:linear-gradient(112.1deg, rgb(32, 38, 57) 11.4%, rgb(63, 76, 119) 70.2%) }'}</style>
         : <style>{'body {background: linear-gradient(to bottom, #007ced 1%,#cce7ff 100%)'}</style>}
        <div>
          <Searchfield loadCurrentWeather={this.loadCurrentWeather}/>
          <CurrentWeather weather={this.state.weather} isNight={this.state.nightMode}/>
          <FiveDayForecast city={this.state.weather.city}/>
        </div>
      </div>
    );
  }
}

export default App;