import React from 'react';

import axios from 'axios';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { removeCityFromFavAction } from '../actions/citiesAction';


class Dashboard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      cities: [],
      isLoading: true,
      isCelsius: true
    }
  }
  
  componentWillMount(){
    this.storeCities();
  }
  
  
  storeCities(){
    this.setState({
      isLoading: true,
      cities: []
    })
    if (this.props.cities.length > 0) {
      this.props.cities.map(city => {
        const FETCH_URL = `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(${city})%20and%20u%3D'c'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;
        
        axios.get(FETCH_URL)
          .then((resp) => {
            this.setState((prevState) => ({
              cities: [...prevState.cities, resp.data]
            }))
          })
          .catch((error) => {
            console.log(error);
          });
          this.setState({
            isLoading: false
          })
          return true;
      })
    }
  }
  
  renderCities(){
    if (this.state.cities.length > 0) {
      return(
        this.state.cities.map((city, index) => {
          const woeid = city.query.results.channel.link.split(/[-/]/);
          return(
          <div key={index} className="col-md-4 col-sm-6 col-xs-12 cityWeather-dash">
            <div className="city-name-dash">
              <div><Link to={`/city/${woeid[13]}`}><strong>{city.query.results.channel.location.city}</strong>, {city.query.results.channel.location.country}</Link>
            
                <div className="city-option-dropdown">
                  <div className="city-option-dropdown-button"><span className="glyphicon glyphicon-chevron-down"></span></div>
                      <div className="city-option-dropdown-content">
                        <span
                          onClick={() => this.removeFromFav(city.query.results.channel.link)}
                          >Remove from fav</span>
                      </div>
                </div>
              
              </div>
              

              <div className="city-text-dash">
                <p>{city.query.results.channel.item.condition.text}</p>
              </div>
              <div className="city-temp-dash">
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
              
              <div className="city-img-dash">
                <p><i className={`wi wi-yahoo-${city.query.results.channel.item.condition.code}`}></i></p>
              </div>
              
              <div className="row forecast-dash col-md-12">
                {this.renderForecast(city.query.results.channel.item.forecast)}
              </div>
              
            </div>
          </div>
          )
        })
      )
    }else {
      return(
        <div className="empty-cities-text">Search and add cities to favorites</div>
      )
    }
  }
  
  renderForecast(forecast){
    return(
      forecast.slice(0,3).map((f, index) => {
        return(
          <div key={index} className="col-md-4 col-sm-6 col-xs-12 text-center">
            <p><strong>{f.day}</strong></p>
            <p>{f.date.substring(0,6)}</p>
            <p><i className={`wi wi-yahoo-${f.code}`}></i></p>
            <p>{f.high}/{f.low}</p>
          </div>
        )
      })
    )
  }
  
  removeFromFav(link){
    let newLocation = link.split(/[-/]/);
    this.props.removeCityFromFavAction(newLocation[13]);
    
    setTimeout(() => {
      this.storeCities()
      }, 500);
  }
  
  changeToF(){
    this.setState({
      isCelsius: false
    });
    let cities = this.state.cities;
    cities.map(city => {
      city.query.results.channel.item.condition.temp = Math.round(city.query.results.channel.item.condition.temp*1.8+32);
      
      city.query.results.channel.atmosphere.visibility = parseFloat(city.query.results.channel.atmosphere.visibility/1.609344).toFixed(2);
      
      city.query.results.channel.wind.speed = parseFloat(city.query.results.channel.wind.speed/1.609344).toFixed(2);
      
      city.query.results.channel.item.forecast.map(f => {
        f.high = Math.round(f.high*1.8+32);
        f.low = Math.round(f.low*1.8+32);
        return true;
      })
      return true;
    });
    
    this.setState({
      cities: cities
    })
    
  }
  
  changeToC(){
    this.setState({
      isCelsius: true
    });
    let cities = this.state.cities;
    cities.map(city => {
      city.query.results.channel.item.condition.temp = Math.round((city.query.results.channel.item.condition.temp-32)/1.8);
      
      city.query.results.channel.atmosphere.visibility = parseFloat(city.query.results.channel.atmosphere.visibility*1.609344).toFixed(2);
      
      city.query.results.channel.wind.speed = parseFloat(city.query.results.channel.wind.speed*1.609344).toFixed(2)
      
      city.query.results.channel.item.forecast.map(f => {
        f.high = Math.round((f.high-32)/1.8);
        f.low = Math.round((f.low-32)/1.8);
        return true;
      })
      return true;
    });
    
    this.setState({
      cities: cities
    })
  }
  

  render(){
    return(
      <div className="container">
        <div className="row text-center">
            {
              this.renderCities()
            }
        </div>
      </div>
    )
  }
}

Dashboard.propTypes = {
  cities: PropTypes.array.isRequired
}



function mapStateToProps(state){
  return {
    'cities': state.addCityToFavReducer
  }
}

export default connect(mapStateToProps, {removeCityFromFavAction})(Dashboard);