import React from "react";
import ShowWeatherIcon from "./ShowWeatherIcon";

const WeatherCard = (props) => {
    const {dayOfWeek, fullDate, temp, feelsLike, windSpeed, weatherDesc} = props.fiveDayForecast;

    return(
        <div className='grid font-mono text-black border-solid border-2 border-gray-300 rounded-3xl hover:font-serif'>
            <div className='pt-3 text-2xl font-bold'>
                {dayOfWeek}
            </div>
            <div className=''>
                {fullDate}
            </div>
            <div className='p-2 italic text-xl'>
                {weatherDesc}
            </div>
            <div className='p-5 place-self-center'>
                <ShowWeatherIcon weatherDesc={weatherDesc}/>
            </div>
            <div className='p-5'>
                <div className='legend'>
                    Temp
                </div>  
                <div className='text-2xl font-bold'>{temp}°C</div>
            </div>
            <div className='p-5'>
            <div className='legend'>
                Feels like
            </div>
                {feelsLike}°C
            </div>
            <div className='p-5'>
                {windSpeed} km//h
            </div>
        </div> 
    )
}

export default WeatherCard;