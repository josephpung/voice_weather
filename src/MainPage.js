import React from 'react'
import Artyom from 'artyom.js'
import axios from 'axios'
import {geolocated} from 'react-geolocated'
import {Row, Col, Preloader, Button, Table, Icon} from 'react-materialize'
const Jarvis = new Artyom();

class Mainpage extends React.Component {
    constructor (props, context){
        super(props, context)


        this.state = {
            artyomActive: false,
            textareaValue: "",
            artyomIsReading: false,
            loadingData: false,
            icon:"50d",
            country: "-",
            temperature: "-",
            weather: "-",
            clouds: "-"
        };

        Jarvis.addCommands([
            {
                indexes: ["What is the weather like"],
                action: () => {
                  axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${this.props.coords.latitude}&lon=${this.props.coords.longitude}&APPID=6feeacb3997e0e4f4a7f9e9c4b193934`)
                .then(result=>{

                  this.setState({
                    country: result.data.sys.country,
                    weather: result.data.weather[0].description,
                    temperature: Math.floor(result.data.main.temp) - 273,
                    clouds: result.data.clouds.all,
                    icon: result.data.weather[0].icon
                  })

                  let data = Math.floor(result.data.main.temp) - 273
                  let weather = result.data.weather[0].description
                  Jarvis.say(`Temperature is ${data} degrees celcius with ${weather}`);
                })


                }

              }
            ])
    }

    startAssistant() {

        Jarvis.initialize({
            lang: "en-GB",
            debug: false, //turn on to see console logs and commands
            continuous: true,
            soundex: true,
            listen: true
        }).then(() => {

            Jarvis.say("S.W.A has been initialized");

            this.setState({
                artyomActive: true
            });
        }).catch((err) => {
            console.error("Oopsy daisy, this shouldn't happen !", err);
        });
    }

    stopAssistant() {

        Jarvis.fatality().then(() => {

            this.setState({
                artyomActive: false
            });

        }).catch((err) => {
            console.error("Oopsy daisy, this shouldn't happen neither!", err);

            this.setState({
                artyomActive: false
            });
        });
    }


    render() {
      if (!this.props.isGeolocationAvailable)
        return <div className="white-text">Your browser does not support Geolocation</div>
        else if( !this.props.isGeolocationEnabled)
          return <div className="white-text vertical-align"><h3>Geolocation is not enabled</h3>
          <p> If you have enabled location tracking and the page does not load in 5 seconds please refresh the page! If that does not help please ensure that you are using HTTPS, not HTTP</p></div>
          else if( this.props.coords){
            return(

                <div id="weather_assistant" className="white-text">
                    <h1 >Welcome to S.W.A (Simple Weather Assistant)</h1>
                    <br />
                    <br />
                    <br />
                    <h2 className="grey-text">Instructions</h2>
                    <p>Please press <strong>"Start speech detection"</strong> and say "What is the weather like" to check the current weather.</p>



                    <br />
                    <br />
                    <Row>
                    <Table>
                      <tbody>
                      <tr>
                        <th>Country</th>
                        <th>Temperature</th>
                        <th>Weather</th>
                        <th>Clouds</th>
                      </tr>
                      <tr>
                        <td>{this.state.country}</td>
                        <td>{this.state.temperature}&deg;C</td>
                        <td>{this.state.weather} <img src={`http://openweathermap.org/img/w/${this.state.icon}.png`} alt=""/></td>
                        <td>{this.state.clouds}%</td>
                      </tr>
                      </tbody>
                    </Table>
                    </Row>
                    <Row>
                    {/* Voice commands action buttons */}
                    <Button className="green" disabled={this.state.artyomActive} onClick={(e)=>{this.startAssistant()}}>Start Speech Detection<Icon left>settings_voice</Icon></Button>
                    {/* <Button className="red" disabled={!this.state.artyomActive} onClick={(e)=>{this.stopAssistant()}}>Stop Speech Detection</Button> */}
                    </Row>
                    <Row>
                      &copy; Joseph Pung (2017) |  Version 1.0.9
                    </Row>
                </div>
            )
          }else{
            return (<div className="white-text vertical-align">
            <br />
            <Row>
              <Col s={12}>
  		            <Preloader flashing/>
  	           </Col>
            </Row>
            <Row>
              <h3>Getting your location data, please wait!</h3>
            </Row>
                  </div>)
          }
    }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: true,
  },
  userDecisionTimeout: 5000,
})(Mainpage)
