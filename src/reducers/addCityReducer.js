import { ADD_CITY_TO_FAV, REMOVE_CITY_FROM_FAV } from '../constants';

import { bake_cookie, read_cookie } from 'sfcookies';


const addCityReducer = (state = [], action) => {
  state = read_cookie('favCities');
  
  switch(action.type) {
    case ADD_CITY_TO_FAV:
      if (state.includes(action.woeid)){
        console.log('City with provided woeid already exists!');
      }else {
        state.push(action.woeid)
        bake_cookie('favCities', state);
      }
      return state;
    case REMOVE_CITY_FROM_FAV:
      const woeid = action.woeid;
      const index = state.indexOf(woeid);
      state.splice(index, 1);
      bake_cookie('favCities', state);
      return state;
    default:
      return state;
  }

}

export default addCityReducer;