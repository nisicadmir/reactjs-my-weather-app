import React from 'react';
import PropTypes from 'prop-types';

import axios from 'axios';
import { connect } from 'react-redux';

import { addCityToFavAction, removeCityFromFavAction } from '../actions/citiesAction';


class CityDetail extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      city: null,
      isCelsius: true,
      units: {
        distance: 'km',
        pressure: 'mb',
        speed: 'km/h',
        temperature: 'C'
      },
      isInList: false,
      isLoading: false,
      isLoadingFav: false
    }
  }
  
  
  componentWillMount(){
    this.checkCityInList(this.props.match.params.woeid);
    this.getCityByWoeid(this.props.match.params.woeid);
  }
  
  componentWillReceiveProps(nextProps){
    let location = nextProps.location.pathname
    let newLocation = location.split('/', 3);
    this.getCityByWoeid(newLocation[2]);
    this.checkCityInList(newLocation[2]);
  }
  
  getCityByWoeid(w){
    const FETCH_URL = `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(${w})%20and%20u%3D'c'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`
    
    axios.get(FETCH_URL)
      .then((response) => {
        this.setState({
          city: response.data
        });
      })
      .catch((error) => {
        console.log(error);
      });
    
  }
  
  renderCity(){
    if(this.state.city !== null){
      const city = this.state.city;
      if (city.query.results === null) {
        return(
          <div>There is no city with provided WOEID</div>
        )
      }else {
        return(
          <div>
          <div className="col-md-10 col-md-offset-1 city-detail">
            <div className="container col-md-12">
              
            <div className="city-name">
              <div><strong>{city.query.results.channel.location.city}</strong>, {city.query.results.channel.location.country}
              
              <div className="city-option-dropdown">
                <div className="city-option-dropdown-button"><span className="glyphicon glyphicon-chevron-down"></span></div>
                
                <div className="city-option-dropdown-content">
                {this.state.isInList ?
                  (
                    <span
                      className={this.state.isLoadingFav ? 'loading-fav' : ''}
                      onClick={() => this.removeFromFav(city.query.results.channel.link)}
                      >Remove from fav</span>
                  ):
                  (
                    <span
                      className={this.state.isLoadingFav ? 'loading-fav' : ''}
                      onClick={() => this.addToFav(city.query.results.channel.link)}
                      >Add to fav</span>
                  )
                }
                </div>
                
              </div>
              
            </div>
            </div>
            <div className="city-date">
              <p>{city.query.results.channel.item.condition.date}</p>
            </div>
            <div className="city-text">
              <p>{city.query.results.channel.item.condition.text}</p>
            </div>
              
              <div className="container col-md-6 col-sm-12">
                <div className="city-temp">
                  <p>{city.query.results.channel.item.condition.temp}
                    {this.state.isCelsius ? 
                      (
                      <span>
                        °C | 
                        <button
                          onClick={() => this.changeToF()}
                          >°F</button>
                      </span>
                    )
                    :
                    
                      (
                        <span>
                          °F | 
                          <button
                            onClick={() => this.changeToC()}
                            >°C</button>
                        </span>
                      )
                  }
                  </p>
                </div>
                <div className="city-img">
                  <p><i className={`wi wi-yahoo-${city.query.results.channel.item.condition.code}`}></i></p>
                </div>
              </div>
              
              <div className="container col-md-6 col-sm-12">
                <div className="city-astronomy">
                  <p>Sunrise: {city.query.results.channel.astronomy.sunrise}, Sunset: {city.query.results.channel.astronomy.sunset}</p>
                </div>
                <div className="city-atmosphere">
                  <p>Humidity: {city.query.results.channel.atmosphere.humidity}%, Visibility: {city.query.results.channel.atmosphere.visibility} {this.state.units.distance}</p>
                </div>
                <div className="city-wind">
                  <p>Wind speed: {city.query.results.channel.wind.speed} {this.state.units.speed}, Wind chill: {city.query.results.channel.wind.chill}</p>
                </div>
              </div>
              
            </div>
          </div>
            
            <div className="row forecast col-md-12">
               <div className="col-md-1 text-center">
              </div>
              {this.renderForecast(city.query.results.channel.item.forecast)}
              <div className="col-md-1 text-center">
              </div> 
            </div>
            
            </div>
        )
      }
    }
    
  }
  
  renderForecast(forecast){
    return(
      forecast.map((f, index) => {
        return(
          <div key={index} className="col-md-1 col-sm-3 col-xs-4 text-center">
            <p><strong>{f.day}</strong></p>
            <p>{f.date.substring(0,6)}</p>
            <p><i className={`wi wi-yahoo-${f.code}`}></i></p>
            <p>{f.high}/{f.low}</p>
          </div>
        )
      })
    )
  }
  
  changeToF(){
    this.setState({
      isCelsius: false
    })
    this.celsiusToF();
  }
  
  changeToC(){
    this.setState({
      isCelsius: true
    })
    this.fahrenheitToC()
  }
  
  celsiusToF(){
    let city = this.state.city;
    city.query.results.channel.item.condition.temp = Math.round(city.query.results.channel.item.condition.temp*1.8+32);
    
    city.query.results.channel.atmosphere.visibility = parseFloat(city.query.results.channel.atmosphere.visibility/1.609344).toFixed(2);
    
    city.query.results.channel.wind.speed = parseFloat(city.query.results.channel.wind.speed/1.609344).toFixed(2);
    
    city.query.results.channel.item.forecast.map(f => {
      f.high = Math.round(f.high*1.8+32);
      f.low = Math.round(f.low*1.8+32);
      return true;
    })
    
    this.setState({
      units: {
        distance: 'mi',
        pressure: 'mb',
        speed: 'mp/h',
        temperature: 'F'
      },
      city: city
    })
    
  }
  
  fahrenheitToC(){
    let city = this.state.city;
    city.query.results.channel.item.condition.temp = Math.round((city.query.results.channel.item.condition.temp-32)/1.8);
    
    city.query.results.channel.atmosphere.visibility = parseFloat(city.query.results.channel.atmosphere.visibility*1.609344).toFixed(2);
    
    city.query.results.channel.wind.speed = parseFloat(city.query.results.channel.wind.speed*1.609344).toFixed(2)
    
    city.query.results.channel.item.forecast.map(f => {
      f.high = Math.round((f.high-32)/1.8);
      f.low = Math.round((f.low-32)/1.8);
      return true;
    })
    
    this.setState({
      units: {
        distance: 'km',
        pressure: 'mb',
        speed: 'km/h',
        temperature: 'C'
      },
      city: city
    })
  }
  
  addToFav(link){
    this.setState({
      isLoadingFav: true
    })
    let woeid = link.split(/[-/]/);
    this.props.addCityToFavAction(woeid[13]);
  }
  
  removeFromFav(link){
    this.setState({
      isLoadingFav: true
    })
    let newLocation = link.split(/[-/]/);
    this.props.removeCityFromFavAction(newLocation[13]);
  }
  
  checkCityInList(woeid){
    
    setTimeout(() => {
      const cityList = this.props.cities;
        if(this.state.email !== ''){
          if (cityList.includes(woeid)){
            this.setState({
              isInList: true,
              isLoadingFav: false
            })
          }else {
            this.setState({
              isInList: false,
              isLoadingFav: false
            })
          }
        }
      }, 500);
      

  }
  
  render(){
    return(
      <div className="container">
        <div className="row">
          
          {this.renderCity()}
        </div>
      </div>
    )
  }
  
}

CityDetail.propTypes = {
  cities: PropTypes.array.isRequired,
  addCityToFavAction: PropTypes.func.isRequired,
  removeCityFromFavAction: PropTypes.func.isRequired
}



function mapStateToProps(state){
  return {
    'cities': state.addCityToFavReducer
  }
}

export default connect(mapStateToProps, {addCityToFavAction,removeCityFromFavAction})(CityDetail);