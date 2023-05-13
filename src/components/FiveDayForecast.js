import React from "react";
import { isCompositeComponent } from "react-dom/test-utils";
import LoadingIcons from 'react-loading-icons'
import { Puff } from 'react-loading-icons'
import WeatherCard from './WeatherCard';

const PORT = process.env.PORT || 3000;
const backEndServer = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;

class FiveDayForecast extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            fetchingData: false,
            cityName: props.city,
            fiveDayForecastArray: [],
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.city !== prevProps.city) {
          this.setState({cityName: this.props.city,
                         fetchingData: true},() => {
                this.fetch24HourWeatherData(this.state.cityName);
            });
        }
    }
 
    fetch24HourWeatherData = (city) => {
        console.log(`What server are we using ${backEndServer}`);
        fetch(`${backEndServer}/FiveDayForecast`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                cityName: city,
            })
        })
        .then(resp => {
            if (!resp.ok) {
                throw new Error('Network response error');
              }
              return resp.json();
        })
        .then(data => {
            if(data.list){

                const afternoonDataArray = data.list.filter(item => {
                    return item.dt_txt.includes("15:00:00");
                })    
                this.saveData(afternoonDataArray);

            }
        })
        .catch(err => console.log(`Error fetching data: ${err}`));
    }

    saveData = (afternoonDataArray) => {
        const fiveDayForecastDataArray = afternoonDataArray.map(items => {
                return {
                    dayOfWeek: this.convertFullDateToDayOfWeek(items.dt_txt),
                    fullDate: this.convertFullDateToDate(items.dt_txt),
                    temp: parseFloat(Math.trunc(items.main.temp-273.15)).toString(),
                    feelsLike: parseFloat(Math.trunc(items.main.feels_like-273.15)).toString(),
                    windSpeed: Math.round(items.wind.speed * 3.6),
                };
        })

        let weatherArray = [];
        for(let i=0; i<afternoonDataArray.length;i++){
            let innerWeatherArray = afternoonDataArray[i].weather;
            
            for(let j=0; j<innerWeatherArray.length; j++){
                let newObj = Object.assign({}, {weatherDesc: innerWeatherArray[j].main});
                weatherArray.push(newObj);             
            }
        }

        //Save the weatherArray data into fiveDayForecastDataArray
        //That way we can lopp through fiveDayForecastDataArray which contains a list of objects and show data
        //We would need to loop through fiveDayForecastDataArray and have access to each object
        //Then loop through weatherArray have access to each object
        //Then combine each object from weatherArray into each object of fiveDayForecastDataArray
        const combinedArray = fiveDayForecastDataArray.flatMap(s => weatherArray.map(f => ({...s, ...f})))

        //This will filter through the combined array and findIndex will return the FIRST element thats matches
        //Hence any other element wont be found and added to the filter
        const removeDuplicates = combinedArray.filter((value, index, array) =>
             index === array.findIndex((t) => (
                t.dayOfWeek === value.dayOfWeek
            ))
        );

        const fiveDayForecastArray = removeDuplicates;

        this.setState({fiveDayForecastArray});
        this.setState({fetchingData: false});
    }

    convertFullDateToDayOfWeek = (dateArray) => {
        let date = new Date(dateArray);
        let getDay = date.getDay();

        switch(getDay){
            case 0:
                getDay = 'Sunday';
                break;
            case 1:
                getDay = 'Monday';
                break;
            case 2:
                getDay = 'Tuesday';
                break;
            case 3:
                getDay = 'Wednesday';
                break; 
            case 4:   
                getDay = 'Thursday';
                break;      
            case 5:   
                getDay = 'Friday';
                break;   
            case 6:   
                getDay = 'Saturday';
                break; 
            default: 
                getDay = 'Wrong day';
        }
        return getDay;
    }

    convertFullDateToDate = (dateArray) => {
        let date = new Date(dateArray);
        let getMonth = date.getMonth();

        switch(getMonth){
            case 0:
                getMonth = "January";
                break;
            case 1:
                getMonth = "February";
                break;
            case 2:
                getMonth = "March";
                break;
            case 3:
                getMonth = "April";
                break; 
            case 4:   
                getMonth = "May";
                break;      
            case 5:   
                getMonth = "June";
                break;   
            case 6:   
                getMonth = "July";
                break;
            case 7:
                getMonth = "August";
                break;
            case 8:
                getMonth = "September";
                break;
            case 9:
                getMonth = "October";
                break;
            case 10:
                getMonth = "November";
                break; 
            case 11:   
                getMonth = "December";
                break;               
            default: 
                getMonth = 'Wrong Month';
        }
        return getMonth + ' ' + date.getDate();
    }

    render(){
         return(
            this.state.fiveDayForecastArray.length > 1 ?
                <div className='m-5 p-2 grid grid-cols-1 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 border-solid border-2 border-white-600 drop-shadow-xl rounded-3xl bg-gradient-to-r from-gray-100 to-gray-300'>
                    {             
                         !this.state.fetchingData ?
                                this.state.fiveDayForecastArray.map((fiveDayForeCastItems, index) => {
                                    return <WeatherCard key={index} fiveDayForecast={fiveDayForeCastItems}/>
                            }) :   
                            <div  className='sm:col-start-2 sm:col-end-5 md:col-start-2 sm:col-end-5 lg:col-start-2 sm:col-end-5 xl:col-start-2 sm:col-end-5 place-self-center mono text-2xl text-gray font-bold italic'>
                                Loading 5 Day Five Day Forecast
                                <LoadingIcons.ThreeDots style={{display: 'inline'}}/>
                            </div>
                    }          
                </div>
                :<div> </div>
        )
    }
}

export default FiveDayForecast;