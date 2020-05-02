window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
const synth = window.speechSynthesis;
const recognition = new SpeechRecognition();

const icon = document.querySelector('button.fa.fa-microphone');
let paragraph = document.createElement('p');
paragraph.id ='typewriter-paragraph';
let container = document.querySelector('.text-box');
container.appendChild(paragraph);
const sound = document.querySelector('.sound');

icon.addEventListener('click', () => {
    sound.play();
    dictate();
});


const dictate = () => {
    recognition.start();
    recognition.onresult = (event) => {
        const speechToText = event.results[0][0].transcript;

    typeWriter(speechToText);

        if (event.results[0].isFinal) {

            if (speechToText.includes('what is the time')) {
                speak(getTime);
            }

            else if (speechToText.includes('what is today\'s date')) {
                speak(getDate);
            }

            else if (speechToText.includes('what is the weather in')) {
                getTheWeather(speechToText);
            }
            else if(speechToText.includes('what is the total number of cases in')){
                getTheCasesDistrictWise(speechToText);
            }
            else if(speechToText.includes('give me the summary of cases in')){
                getTheSummaryCasesDistrictWise(speechToText);
            }
            else {
                unsupportedText();
            }
        }
    }
};

const speak = (action) => {
    utterThis = new SpeechSynthesisUtterance(action());
    synth.speak(utterThis);
};


const getTheCasesDistrictWise = (speech) => {
  fetch('https://api.covid19india.org/v2/state_district_wise.json')
      .then(function (response) {
          return response.json();
      })
      .then(function (response) {
          response.map(function (state) {
              for (let i = 0; i < state.districtData.length; i++) {
                  var district = state.districtData[i];
                  console.log(speech.split(' ')[8]);
                  if(speech.split(' ')[8] === district.district){
                      debugger;
                      console.log(district.district);
                      utterThis = new SpeechSynthesisUtterance(`The total number of cases in district ${district.district} is ${district.confirmed}`);
                      synth.speak(utterThis);
                  }
              }
          })
      })
};

const getTheSummaryCasesDistrictWise = (speech) => {
    fetch('https://api.covid19india.org/v2/state_district_wise.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            response.map(function (state) {
                for (let i = 0; i < state.districtData.length; i++) {
                    var district = state.districtData[i];
                    console.log(speech.split(' ')[7]);
                    if(speech.split(' ')[7] === district.district){
                        debugger;
                        console.log(district.district);
                        utterThis = new SpeechSynthesisUtterance(`The summary of cases in district ${district.district} is as follows. The total number of confirmed cases is ${district.confirmed}. The number of active cases among them is ${district.active}. The number of deaths reported in this region is ${district.deceased}, while on the bright side, there are ${district.recovered} recovered patients. Stay safe and wash your hands! Bye!!!!!!`);
                        synth.speak(utterThis);
                    }
                }
            })
        })
};

const getTime = () => {
    const time = new Date(Date.now());
    return `the time is ${time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`
};

const getDate = () => {
    const time = new Date(Date.now());
    return `today is ${time.toLocaleDateString()}`;
};

const getTheWeather = (speech) => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?q=${speech.split(' ')[5]}&appid=58b6f7c78582bffab3936dac99c31b25&units=metric`)
        .then(function(response){
            return response.json();
        })
        .then(function(weather){
            if (weather.cod === '404') {
                utterThis = new SpeechSynthesisUtterance(`I cannot find the weather for ${speech.split(' ')[5]}`);
                synth.speak(utterThis);
                return;
            }
            utterThis = new SpeechSynthesisUtterance(`the weather condition in ${weather.name} is mostly full of ${weather.weather[0].description} at a temperature of ${weather.main.temp} degrees Celcius`);
            synth.speak(utterThis);
        });

};
const unsupportedText = () => {
  utterCrapList = ["Sorry I don't understand what you are saying. Please try again","Kya bol rha hai be","Could you please read the options carefully before speaking","I won't tell you because I don't know that","What the hell did you just say?"];
    var randomNumber = Math.floor((Math.random()*5)+1);
     utterThis = new SpeechSynthesisUtterance(utterCrapList[randomNumber]);
    synth.speak(utterThis);

};

var i=0;
function typeWriter(txt) {
    debugger;
    if (i < txt.length) {
        document.getElementById("typewriter-paragraph").innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter(txt), 500);
    }
};
