const methods = require('./methods');
const userInput = process.stdin;
userInput.setEncoding('utf-8');

// welcome the user and explain how program works
console.log(
    `******** Welcome to the CLI Weather app ****************
        Here is how it works: 
            You can check weather by typing either:
                - cityName as a string 
                - city ID as a number
                - coordinates in the following format '[lat,lon]'
            To get a list of commands type 'help'
            To exit the app type 'exit' `
);
//  reading user inputs
userInput.on('data', data => {
    // User input exit.
    if(data == 'exit\r\n'){
        // Program exit
        console.log("Thank you for trying out our app. See you soon o/");
        process.exit();
    //  user input help
    } else if (data == 'help\r\n'){
        console.log(`
            In order to retrieve data, you need to enter valid input for the city by either entering: 
                1. CityName (doesn't have to be in capital letters)
                2. Enter a City ID (you can find the list of IDs here: http://bulk.openweathermap.org/sample/)
                3. By entering the coordinates of the city. Please note that coordinates need to be entered in the following format [lat,lon]
        `);
    } else{
        // call the weather app 
        methods.getData(data);
    }
});






