import React from "react";
import { WiDayCloudy, WiDaySunny, WiDayHaze, WiDaySnow, WiRain, WiFog, WiNightCloudy, 
        WiNightClear, WiNightSnow, WiSmoke, WiThunderstorm} from "weather-icons-react";

const ShowWeatherIcon = (props) => {
    const {weatherDesc, isNight} = props;
    const weatherDescLowerCase = weatherDesc.toLowerCase();
    return (
        <div className='row-start-2 row-end-5 place-self-center'>
            {
                isNight ? 
                    weatherDescLowerCase.includes('cloud') ? 
                    <WiNightCloudy size={200} color='white'/>
                    : weatherDescLowerCase.includes('snow') ?
                    <WiNightSnow size={200} color='white'/>
                    : weatherDescLowerCase.includes('rain') ?
                    <WiRain size={200} color='white'/>
                    : weatherDescLowerCase.includes('thunder') ?
                    <WiThunderstorm size={200} color='white'/>
                    : weatherDescLowerCase.includes('fog') ? 
                    <WiFog size={200} color='white' /> 
                    : weatherDescLowerCase.includes('smoke') ?
                    <WiSmoke size={200} color='white'/>
                    : <WiNightClear size={200} color='white'/>
                :
                    weatherDescLowerCase.includes('cloud') ? 
                    <WiDayCloudy size={200} color='white'/>
                    : weatherDescLowerCase.includes('haze') ?
                    <WiDayHaze size={200} color='white'/>
                    : weatherDescLowerCase.includes('sun') ||  weatherDesc.includes('clear')?
                    <WiDaySunny size={200} color='white'/>
                    : weatherDescLowerCase.includes('snow') ?
                    <WiDaySnow size={200} color='white'/>
                    : weatherDescLowerCase.includes('rain') ?
                    <WiRain size={200} color='white'/>
                    : weatherDescLowerCase.includes('thunder') ?
                    <WiThunderstorm size={200} color='white'/>
                    : weatherDescLowerCase.includes('fog') ? 
                    <WiFog size={200} color='white' /> 
                    : weatherDescLowerCase.includes('smoke') ?
                    <WiSmoke size={200} color='white'/>
                    : <WiDaySunny size={200} color='white'/> 
            }
        </div>
    )

}

export default ShowWeatherIcon;

