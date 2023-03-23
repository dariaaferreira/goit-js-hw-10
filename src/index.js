import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputSearch = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputSearch.addEventListener('input', debounce(onInputSearch, DEBOUNCE_DELAY));

function onInputSearch () {
    countryList.innerHTML = ""; 
    countryInfo.innerHTML = "";

    const textInputValue = inputSearch.value.trim();

    if (textInputValue  === "") {
        return;
    } else {

    fetchCountries(textInputValue)
      .then(countries => {

        const chosenCountry = countries.filter(country => country.name.official.toLowerCase().includes(textInputValue));      

        if (chosenCountry.length > 10) {
            Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        }

        if (chosenCountry.length > 1 && chosenCountry.length <= 10) {
            renderListCounries(chosenCountry);   
        } 

        if (chosenCountry.length === 1) {
            renderInfoCountries(chosenCountry);
        }

        if (chosenCountry.length === 0) {
            Notiflix.Notify.failure('Oops, there is no country with that name')
        }

        })
      .catch(onCatchError);
    }
}

function renderListCounries (countries) {
    const countryListEl = countries.map(({ name, flags }) => {
        return `<li class="country-card">
        <img class="country-flag"
        src="${flags.svg}" 
        alt="${name.official}" 
        width="30" 
        height="20">
        <p class="country-name">${name.official}</p>
        </li>`
      }).join(" ");
      
      countryList.insertAdjacentHTML('beforeend', countryListEl);
}

function renderInfoCountries(countries) {
    const countryInfoEl = countries.map(({ name, capital,population, flags, languages }) => {
        return `<div class="country-card">
        <img class="country-flag" 
        src="${flags.svg}" 
        alt="${name.official}" 
        width = 60 
        height = 40>
        <h1 class="country-name">${name.official}</h1>
        </div>

        <div class="country-info">
        <p><b>Capital:</b>  ${capital}</p>
        <p><b>Population:</b>  ${population}</p>
        <p><b>Languages:</b>  ${Object.values(languages)}</p>
        </div>`
    })
    countryInfo.insertAdjacentHTML('beforeend', countryInfoEl);
}

function onCatchError (error) {
    // console.log('это CATCH!!!')
    Notiflix.Notify.failure('Oops, there is no country with that name');
}