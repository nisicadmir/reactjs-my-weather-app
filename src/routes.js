import React from 'react';

import { Route } from 'react-router-dom';

import Nav from './components/Nav';
import Dashboard from './components/Dashboard';
import AboutUs from './components/AboutUs';
import CityDetail from './components/CityDetail';


export default (
  <div>
    <Route path="/" component={Nav} />
    <Route exact path="/" component={Dashboard} />
    <Route path="/about-us" component={AboutUs} />
    <Route path="/city/:woeid" component={CityDetail} />
  </div>
)