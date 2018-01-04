import React from 'react'
import Artyom from 'artyom.js'
import axios from 'axios'
import {geolocated} from 'react-geolocated'
import {Row,Col, Preloader, Button, Table} from 'react-materialize'
const Jarvis = new Artyom();

class Mainpage extends React.Component {
    constructor (props, context){
        super(props, context)

        this.startAssistant = this.startAssistant.bind(this)
        this.stopAssistant = this.stopAssistant.bind(this)
        this.speakText = this.speakText.bind(this)

        this.state = {
            artyomActive: false,
            textareaValue: "",
            artyomIsReading: false,
            loadingData: false,
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
                    clouds: result.data.clouds.all
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
        let _this = this;

        Jarvis.initialize({
            lang: "en-GB",
            debug: true,
            continuous: true,
            soundex: true,
            listen: true
        }).then(() => {

            Jarvis.say("A.W.S has been initialized");

            _this.setState({
                artyomActive: true
            });
        }).catch((err) => {
            console.error("Oopsy daisy, this shouldn't happen !", err);
        });
    }

    stopAssistant() {
        let _this = this;

        Jarvis.fatality().then(() => {

            _this.setState({
                artyomActive: false
            });

        }).catch((err) => {
            console.error("Oopsy daisy, this shouldn't happen neither!", err);

            _this.setState({
                artyomActive: false
            });
        });
    }

    speakText() {
        let _this = this;

        _this.setState({
            artyomIsReading: true
        });

        // Speak text with Artyom
        Jarvis.say( _this.state.textareaValue, {
            onEnd() {
                _this.setState({
                    artyomIsReading: false
                });
            }
        });
    }

    render() {
      if (!this.props.isGeolocationAvailable)
        return <div className="white-text">Your browser does not support Geolocation</div>
        else if( !this.props.isGeolocationEnabled)
          return <div className="white-text">Geolocation is not enabled</div>
          else if( this.props.coords){
            return(

                <div id="weather_assistant" className="white-text">
                    <h1 >Welcome to S.W.A (Simple Weather Assistant)</h1>

                    <p>Please press "Start speech detection" and say "What is the weather like" to check the current weather.
                       continuous voice detection is enabled, you do not need to press stop after every test, only press it when you are done</p>
                    <p>Press "Stop speech detection" when you are done with voice testing</p>

                    {/* Voice commands action buttons */}
                    <Button className="green" disabled={this.state.artyomActive} onClick={this.startAssistant}>Start Speech Detection</Button>
                    <Button className="red" disabled={!this.state.artyomActive} onClick={this.stopAssistant}>Stop Speech Detection</Button>

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
                        <td>{this.state.weather}</td>
                        <td>{this.state.clouds}%</td>
                      </tr>
                      </tbody>
                    </Table>
                    </Row>
                    <Row>
                      &copy; Joseph Pung (2017)
                    </Row>
                </div>
            )
          }else{
            return (<div className="white-text">
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
