const https = require('https');
const apiKey = "1bfdd925b835ebbcd49be5ee78e67fa8";
/**
 * Function to retrieve weather data by the specified search param
 * Function makes a request based on the search param and prints out the results 
 * @param {string} searchBy, value user has entered as a search param for weather 
 */
function getData(searchBy){
    const url = createURL(searchBy);
    https.get(url, resp =>{
        if(resp.statusCode === 200){
            let data = '';
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                    data += chunk;
            });
             // The whole response has been received. Printing out results to the user 
            resp.on('end', () => {
                try{
                    // convert string data to the js object
                    const weatherData = JSON.parse(data);
                    // check if data was found before logging it
                    if(weatherData.weather){
                        console.log(writeWeatherData(weatherData));
                    } else {
                        const queryError = new Error(`The location "${searchBy}" was not found.`);
                        console.error(queryError.message);
                    }    
                } catch (err){
                    console.error('There was an error parsing response data: ', err);
                }
            });
        } else {
            console.log(`Woops. There was an error. It seems like the request was not successful. Error code: (${resp.statusCode})`);
        }
    }).on("error", (err) => {
        console.log("Error: " + err.message);
});
}
/**
 * Function to create a URL for the call to the API based on the passed search param
 * Function checks if entered value is string - for Name search, number - for ID search, or an array - for coordinates search
 * If value is not one of the three mentioned above, it throws an error
 * If value is valid, it return a URL for the API call 
 * @param {string} searchBy , value user has entered as a search param for weather
 */
function createURL(searchBy){
    let searchParam = '';
    // trim the searchParam:
    searchBy = searchBy.replace(/\s+/g, '');
    // check if search should be done by cityname, id or lon and lat
    // searching for the number part first, because searchBy is already a type of string, so it will always fill the "string" condition
    if(!isNaN(searchBy)){
        searchParam =  `id=${searchBy}`;
    } else if (searchBy.includes('[')) {
        // remove []
        searchBy = searchBy.replace('[', '');
        searchBy = searchBy.replace(']', '');
        let values = searchBy.split(',');
        console.log(values);
        searchParam =  `lat=${values[0]}&lon=${values[1]}`;
    } else if (typeof searchBy == 'string'){
        searchParam =  `q=${searchBy}`;
    } else {
        throw Error('Woops, it looks like the entered params are not correct. Please read the description and try again.');
    }
    return `https://api.openweathermap.org/data/2.5/weather?${searchParam}&appid=${apiKey}`;
}
/**
 * Function takes the object of data and parses it into a string response
 * @param {object} weatherData , object containing weather information received from the API
 */
function writeWeatherData(weatherData){
    return `
    ******************************************************
        city: ${weatherData.name},
        weather: ${weatherData.weather[0].description},
        temperature: ${convertTempToCel(weatherData.main.temp).toFixed(1)}°C,
        feels like: ${convertTempToCel(weatherData.main.feels_like).toFixed(1)}°C,
        humidity: ${weatherData.main.humidity}%
    ******************************************************
    `;   
}
/**
 * Function takes a Kelvin temperature as a paramether and returns that value converted to Celsius 
 * @param {number} tempInK , kelvin temperature value
 */
function convertTempToCel(tempInK){
    return tempInK - 273.15;
}

module.exports =  {
    getData
};