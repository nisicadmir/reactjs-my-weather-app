import React from 'react';

import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';


import '../styles.css';


class Nav extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      searchInput: '',
      searchResults: null
    }
    
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(e){
    this.setState({
      searchInput: e.target.value
    })
    clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        if(this.state.searchInput !== ''){
          this.searchCities();
        }else{
          this.setState({
            searchResults: null
          })
        }
      }, 1000);
  }
  
  searchCities(){
    const FETCH_URL = `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.places%20where%20text%3D%22${this.state.searchInput}%20name%22&format=json`;
    
    axios.get(FETCH_URL)
      .then((response) => {
        this.setState({
          searchResults: response.data
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  
  renderSearchResults(){
    if(this.state.searchResults !== null){
      const cities = this.state.searchResults;
      if(cities.query.results.place.length > 1){
        return(
          cities.query.results.place.map((res, index) => {
            return(
              res.locality1 ?
                (
                  <li 
                    key={index}
                    onClick={() => this.afterClick()}
                    >
                      <Link 
                        to={`/city/${res.locality1.woeid}`}
                        >
                          {res.locality1.content}, {res.country.content}
                      </Link>
                  </li>
                  
                ):
                (null)
            )
          })
        )
      }else{
          return(
            <li 
              key={cities.query.results.place.admin1.woeid}
              onClick={() => this.afterClick()}
              >
                <Link 
                  to={`/city/${cities.query.results.place.locality1.woeid}`}
                   >{cities.query.results.place.locality1.content}, {cities.query.results.place.country.content}</Link>
            </li>
          )
      }
    }
  }
  
  afterClick(){
    this.setState({
      searchInput: '',
      searchResults: null
    });
  }
  
  render(){
    return(
      <nav className="navbar navbar-default">
        <div className="container-fluid">

          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a className="navbar-brand" href="/">Home</a>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
            </ul>

            <div className="navbar-form navbar-left">
                <div className="right-inner-addon">
                  <input 
                    type="search" 
                    className="" 
                    placeholder="Search for cities..."
                    value={this.state.searchInput}
                    onChange={this.handleChange}
                  />
                  <div>
                  <span className="icon-search glyphicon glyphicon-search"></span>
                  </div>
                  
                  <div className="search-div">
                    <ul className="search-result">
                      {this.renderSearchResults()}
                    </ul>
                  </div>
                  
                </div>
            </div>
            <ul className="nav navbar-nav navbar-right">
              <li><a href="/about-us">About us</a></li>
            </ul>
          </div>
        </div>
        
      </nav>
    )
  }
  
}

export default withRouter(Nav);