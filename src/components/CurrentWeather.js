import React from "react";
import ShowWeatherIcon from "./ShowWeatherIcon";

const CurrentWeather = (props) => {
     
     const {city, temp, feelsLike, wind, humidity, weatherDesc, visibility, sunrise, sunset, currentTime} = props.weather; 

    return (      
        //If on mobile grid will follow grid-cols-1. If small screen it will use sm. If medium screen it will use md. If large screen it will use lg.
        <div className='m-10 p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8 font-bold text-white text-2xl font-mono border-solid border-2 border-white-600 drop-shadow-xl rounded-3xl'>
            <p className='text-3xl font-bold order-first sm:order-first md:order-first lg:order-first'>{city}</p>
            <ShowWeatherIcon className='order-2 sm:order-3 md:order-3 lg:order-3' weatherDesc={weatherDesc} isNight={props.isNight} />
            <p className='order-3 sm:order-10'>{weatherDesc}</p>
            <p className='order-4 text-md lg:text-2xl 2xl:text-3xl sm:order-11'>Temperature {temp}°C</p>
            <p className='order-5 text-md lg:text-2xl 2xl:text-3xl sm:order-13'>Feels like {feelsLike}°C {props.isNight}</p>
            <p className='order-6 text-md lg:text-2xl 2xl:text-3xl sm:order-2'>Windspeed {wind} km/h</p>
            <p className='order-7 text-md lg:text-2xl 2xl:text-3xl sm:order-4'>Visiblity {visibility} km</p>
            <p className='order-8 text-md lg:text-2xl 2xl:text-3xl sm:order-6'>Humidity {humidity}%</p>
            <p className='order-9 text-md lg:text-2xl 2xl:text-3xl sm:order-9'>Current time {currentTime}</p>
            <p className='order-10 text-md lg:text-2xl 2xl:text-3xl sm-order-12'>Sunrise {sunrise}</p>
            <p className='order-11 text-md lg:text-2xl 2xl:text-3xl sm:order-14'>Sunset {sunset}</p>      
        </div>
    )
}

 export default CurrentWeather;