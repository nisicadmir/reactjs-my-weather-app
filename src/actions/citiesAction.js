import { ADD_CITY_TO_FAV, REMOVE_CITY_FROM_FAV } from '../constants';


export function addCityToFavAction(woeid){
  const action = {
    type: ADD_CITY_TO_FAV,
    woeid: woeid,
  }
  return action;
}

export function removeCityFromFavAction(woeid){
  const action = {
    type: REMOVE_CITY_FROM_FAV,
    woeid: woeid,
  }
  return action;
}