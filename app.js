'use strict';

/* PARA EVITAR CORS
var proxyUrl = 'https://cors-anywhere.herokuapp.com/',
    targetUrl = 'https://dev-js-explained-api.pantheonsite.io/wp-json/wp/v2/posts?per_page=5'
fetch(proxyUrl + targetUrl)
.then(function(response){
	response.json()
    .then(function(data) {
		console.log(data);
    })
})

*/

function main() {

  function getDog(){
    return fetch('https://dog.ceo/api/breeds/image/random')
    .then(function(response){
      return response.json()
      .then(function(data){
        var randomImage =  ` <img src="${data.message}" alt="Random Photo of a Dog" />
        `;
        return randomImage;
      })
      .catch(function(error){
        console.error(error);
      })
    })
    .catch(function(error){
      console.error(error);
    }) 
  }

  async function initDogApi(){
    var dogPic = await getDog();
  }
  initDogApi();

  function getRates(base){
    return fetch(`https://api.exchangeratesapi.io/latest?base=${base}`)
    .then(function(response){
      return response.json()
      .then(function(data){
        var markup = `<select id="rates">`
        for(var rate in data.rates){
          markup += `<option value="${data.rates[rate]}">${rate}</option> `
        } 
        markup += `</select>`
        var mainElement = document.querySelector('main');
        mainElement.innerHTML = markup; 
        var currentConversor = document.createElement('h2');
        mainElement.appendChild(currentConversor);
        //console.log(markup);
        return markup;
      })
      .catch(function(error){
        console.error(error);
      })
    })
    .catch(function(error){
      console.error(error);
    })
  }

  async function initRates(){
    var base = 'EUR';
    var exchange = await getRates(base);
    var selectElement = document.querySelector('#rates');
    selectElement.addEventListener('change', function(event){
      console.log(event.target.value);
      var currentConversor = document.querySelector('h2');
      currentConversor.innerHTML = '';
      var selectElement = document.querySelector('select');
      currentConversor.innerHTML = `<h2>1 ${base} -> ${selectElement.options[selectElement.selectedIndex].value} ${selectElement.options[selectElement.selectedIndex].innerText}</h2>`
      var mainElement = document.querySelector('main');
      mainElement.appendChild(currentConversor);
    })
  }
  
  initRates();

  function getPosts(numPosts){
    return fetch(`https://dev-js-explained-api.pantheonsite.io/wp-json/wp/v2/posts?per_page=${numPosts}`)
    .then(function(response){
      return response.json()
      .then(function(data){
        var postList = `<ul>`
        data.forEach(function(post){
          postList += `<li><a data-id="${post.id}" href="${post.link}">${post.title.rendered}</a></li>`;
        });   
        postList += `</ul>`;  
        return postList;   
      })
      .catch(function(error){
        console.error(error);
      })
    })
    .catch(function(error){
      console.error(error);
    })
  }

  async function initPosts(){
    var posts = await getPosts(5);
    var sectionList = document.createElement('section');
    sectionList.innerHTML = posts;
    console.log(sectionList);
    var mainElement = document.querySelector('main');
    mainElement.appendChild(sectionList);
    var arrayLi = document.querySelectorAll('li');
    var sectionInfo = document.createElement('section');
    arrayLi.forEach(function(el) {
      el.addEventListener('click', function(event) {
        event.preventDefault();
        var id = event.target.dataset.id;
        getElementInfo(id, sectionInfo);
      });
    })
    mainElement.appendChild(sectionInfo);
  }
  initPosts();

  async function getElementInfo(id, sectionInfo) {
    var element = await fetch(`https://dev-js-explained-api.pantheonsite.io/wp-json/wp/v2/posts/${id}`);
    var response = await element.json();
    console.log(response);
    sectionInfo.innerHTML = 
    `
    <h1>Title: ${response.title.rendered}</h1>
    <article> ${response.content.rendered}</article>
    `;
  }

};




window.addEventListener('load', main);

