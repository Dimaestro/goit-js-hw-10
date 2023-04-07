import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const elements = {
  searchBox : document.querySelector('#search-box'),
  countryList : document.querySelector('.country-list'),
  countryInfo : document.querySelector('.country-info'),
}

elements.searchBox.addEventListener('input', debounce(onSerchCountries, DEBOUNCE_DELAY));

function onSerchCountries(event) {
  let serchName = event.target.value.trim();

  if (serchName === '') {
    clearCountries();
    return;
  };

  fetchCountries(serchName)
  .then(countries => {
    clearCountries();

    if (countries.length === 1) {
      elements.countryList.innerHTML = renderCountriesList(countries);
      elements.countryInfo.innerHTML = renderCountryInfo(countries);
      console.log(countries);

    } else if (countries.length >= 2 && countries.length <= 10) {
      elements.countryList.innerHTML = renderCountriesList(countries);

    } else {
      Notify.info('Too many matches found. Please enter a more specific name.');
    }
  })
  .catch(error => {
    Notify.failure(error.message);
    clearCountries();
  })
}

function renderCountriesList(data) {
  return data.map(item => {
    return `
    <li class="country-item">
      <img src="${item.flags.svg}" alt="" class="country-flag" width="50" height="50">
     <h2 class="country-name">${item.name.official}</h2>
  </li>`
  }).join('');
}

function renderCountryInfo(data) {
  return data.map(item => {
    return `
    <p><b>Capital :</b>${item.capital}</p>
    <p><b>Population :</b>${item.population}</p>
    <p><b>Languages :</b>${Object.values(item.languages)}</p>`
  }).join('');
}

function clearCountries() {
  elements.countryList.innerHTML = '';
  elements.countryInfo.innerHTML = '';
}