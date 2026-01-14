class Movie{
  constructor(id, title, year, duration, rating, poster, tagline, description, active){
    this.id = id;
    this.title = title;
    this.year = year
    this.duration = duration
    this.rating = rating
    this.poster = poster
    this.tagline = tagline
    this.description = description
    this.active = active
  }

  toString(type){
    if(type == "carousel"){
      return this.get_movie_carousel();
    }else if(type == "card" || type == "search"){
      return this.get_movie_card();
    }
  }

  get_movie_card() {
    return `<div id="${this.id}" class="card movie-card p-0 user-select-none">
        <img class="w-100 h-auto rounded-top-1"
            src="${this.poster}">
        <div class="card-body text-white">
            <p class="card-title text-truncate h5">${this.title}</p>
            <p class="mb-1">
                <i class="fas fa-star text-warning"></i>
                <span class="small text-warning">${this.rating}</span>
            </p>
            <p class="text-secondary small mb-0 mobile-hidden">${this.year} • ${this.duration} min</p>
        </div>
      </div>`
  }

  get_movie_carousel() {
    return `<div class="carousel-item p-2 ${this.active}">
        <div id="${this.id}" class="card m-auto w-100 movie-card-carousel user-select-none" style="max-width: 586px;">
          <div class="row g-0">
            <div class="col-5">
              <img class="rounded-start w-100"
                src="${this.poster}">
            </div>
            <div class="card-body text-white d-flex flex-column col-5">
              <h3 class="card-title text-capitalize">${this.title}</h3>
              <p class="card-text text-info truncate">
                ${this.tagline}
              </p>
              <p class="movie-description card-text text-secondary truncate tablet-hidden mobile-hidden" style="max-height:70%;">
                ${this.description}
              </p>
              <p class="card-text text-secondary small mb-0">${this.year} • ${this.duration} min</p>
            </div>
          </div>
        </div>
      </div>`
  }
}

class Category{
  constructor(category_name, id){
    this.category_name = category_name;
    this.movies = new Array();
    this.last_idx = 0;
    this.movies_string = "";
    this.id = id;
  }

  add_movie(movie){
    //this.movies[this.last_idx] = movie;
    this.movies.push(movie);
    this.last_idx ++;
  }

  toString(type){
    this.movies_string = this.movies.join("");
    if(type == "carousel"){
      return this.get_movie_carousel_category();
    }else if(type == "card"){
      return this.get_movie_card_category();
    }else if (type == "search"){
      return this.get_movie_search_category();
    }
  }

  get_movie_card_category() {
    return `<section class="me-1 ms-1">
      <h3 class="mb-2">
          <a class="title text-white user-select-none link-underline-none">
              <span class="text-warning font-weight-bold pr-3">|</span>${this.category_name}
          </a>
      </h3>
      <div id="${this.id}" class="d-flex mb-5 mt-4 movie-card-scroller flex-shrink-0">
          ${this.movies_string}
      </div>
    </section>`
  }

  get_movie_search_category(){
    //"d-flex mb-5 mt-4 flex-wrap"
    return `<section class="me-1 ms-1">
      <h3 class="mb-2">
          <a class="title text-white user-select-none link-underline-none">
              <span class="text-warning font-weight-bold pr-3">|</span>${this.category_name}
          </a>
      </h3>
      <div class="m-auto w-100">
        <div id="${this.id}" class="search-results d-flex mb-5 mt-4 flex-wrap m-auto justify-content-start">
            ${this.movies_string}
        </div>
      </div>
    </section>`
  }

  get_movie_carousel_category() {
    return `<section class="me-1 ms-1">
      <h3 class="mb-2">
        <a class="title text-white d-none link-underline-none">
          <span class="text-warning font-weight-bold pr-3">|</span>
          ${this.category_name}
          <i class="fas fa-chevron-right pl-2 fa-xs"></i>
        </a>
      </h3>
      <div class="container row mb-5 mt-4 m-auto">
        <div id="${this.id}" class="carousel slide" data-bs-ride="carousel" data-bs-interval="6000">
          <div class="carousel-inner m-auto px-3 container-sm">
            ${this.movies_string}
          </div>
        </div>
      </div>
    </section>`
  }
}

class MovieDetail{
  constructor(id, name, date, tagline, description, minute, rating, poster){
    this.id = id;
    this.name = name;
    this.date = date;
    this.tagline = tagline;
    this.description = description;
    this.minute = minute;
    this.rating = rating;
    this.poster = poster;
    this.genres = new Array();
    this.actors = new Array();
    this.crew = new Array();
    this.themes = new Array();
    this.studios = new Array();
    this.languages = new Array();
    this.releases = new Array();
    this.reviews = new Array();
    this.countries = new Array();
  }

  add_genre(genre){
    var string_item = `<span class="badge text-bg-secondary" 
      style="margin:1.5px!important;">
      ${genre}</span>`;
    this.genres.push(string_item);
  }

  add_actor(actor, role){
    var string_item = `<p class="text-light small m-1">
          <span class="text-warning">${actor}</span>
          •
          <span class="text-secondary">${role}</span>
      </p>`;
    this.actors.push(string_item);
  }

  add_crew(crew, role){
    var string_item = `<p class="text-light small m-1 user-select-none">
          <span class="text-warning">${crew}</span>
          •
          <span class="text-secondary">${role}</span>
      </p>`;
    this.crew.push(string_item);
  }

  add_theme(theme){
    var string_item = `• ${theme} <br>`;
    this.themes.push(string_item);
  }

  add_studio(studio){
    var string_item = `<span class="badge bg-secondary m-1">${studio}</span>`;
    this.studios.push(string_item);
  }

  add_languages(language, type){
    var string_item = `<span class="badge bg-body-tertiary m-1">${language} • ${type}</span>`;
    this.languages.push(string_item);
  }

  add_release(country, date, rating, type){
    var string_item = `<p class="text-light small"> • ${country} 
        • <span class="text-info">${date}</span> 
        • <span class="text-secondary">${type}</span>
        • <span class="badge bg-warning-subtle">${rating}</span>
      </p>`;
    this.releases.push(string_item);
  }

  add_country(country){
    var string_item = country;
    this.countries.push(string_item);
  }

  add_review(name, publisher, score, content, date){
    var string_item = `<div class="container row border-2 border-info rounded 1">
          <p class="m-0">
              <span> ${name} </span>
              •
              <span class="text-secondary"> ${publisher} </span>
          </p>
          <p class="m-0 small text-secondary">
              <span class="text-warning fw-bold">${score}</span>
              •
              <span>${date}</span>
          </p>
          <p class="">
              ${content}
          </p>
      </div>`;
    this.reviews.push(string_item);
  }

  toString(){
    return `<section id="${this.id}" class="me-1 ms-1">
        <h3 class="col-11 col-md-12 title text-capitalize text-light-emphasis fw-bold p-2 m-auto">
            ${this.name}
        </h3>
        <div class="row p-1">
            <div class="col-md-5 col-11 m-auto m-md-0 mt-md-2">
                <div class="row g-0">
                    <img class="w-75 rounded-1 m-auto" style="max-width:210px!important;"
                        src="${this.poster}">
                </div>
                <div class="row mt-1 ms-2 g-0">
                    <div class="container w-75 margin-auto d-flex flex-wrap m-auto justify-content-center">
                        ${this.genres.join('')}
                    </div>
                </div>
                <div class="container p-2 m-2 rounded-1">
                    <p class="text-light-emphasis text-center fw-bold mb-0"> 
                        ${this.countries.join()} • 
                        ${this.date} • 
                        ${this.minute} min
                    </p>
                </div>
                <div class="container p-2 m-2 rounded-1 d-flex flex-column">
                    <p class="text-center">Rating:</p>
                    <h1 class="text-center text-warning">${this.rating}</h1>
                </div>
                <div class="container p-2 m-2 bg-secondary-subtle rounded-1">
                    <h5>Studios</h5>
                    <p class="text-light small">
                        ${this.studios.join('')}
                    </p>
                </div>
                <div class="container p-2 m-2 bg-secondary-subtle rounded-1">
                    <h5>Languages</h5>
                    <p class="text-light small">
                        ${this.languages.join('')}
                    </p>
                </div>
                <div class="container p-2 m-2 bg-secondary-subtle rounded-1">
                    <h4>Releases</h4>
                    <div id="releases" class="scrollable-detail">
                      <p class="text-light small">
                        ${this.releases.join('')}
                      </p>
                    </div>
                </div>
            </div>
            <div class="col-md-7 col-11 m-auto m-md-0 mb-md-auto">
                <div class="container p-2 m-2 bg-secondary-subtle rounded-1">
                    <h5 class="text-info">
                        ${this.tagline}
                    </h5>
                    <p class="movie-details-description text-secondary" style="max-height:70%;">
                        ${this.description}
                    </p>
                </div>
                <div class="container p-2 m-2 bg-secondary-subtle rounded-1">
                    <h4 class="">Cast</h4>
                    <div id="actors" class="scrollable-detail-longer">
                      <div class="container">
                          ${this.actors.join('')}
                      </div>
                    </div>
                </div>
                <div class="container p-2 m-2 bg-secondary-subtle rounded-1">
                    <h4>Crew</h4>
                    <div id="crew" class="scrollable-detail-longer">
                      <div class="container">
                        ${this.crew.join('')}
                      </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="row p-1">
            <div class="col-11 col-md-12 m-auto m-md-0 mt-md-2">
                <div class="container p-2 m-2 bg-secondary-subtle rounded-1">
                    <h5>Reviews</h5>
                    <p id="loader-reviews" class="text-secondary p-3 text-center">Loading reviews <span class="spinner-border spinner-border-sm"></span></p>
                    <p id="empty-reviews" class="text-secondary p-3 text-center d-none">No reviews yet</p>
                    <div id="reviews-container" class="scrollable-detail-longer">
                      ${this.reviews.join('')}
                    </div>
                    <div id="pagination" class="pagination justify-content-center m-2 d-none">
                      <li class="page-item"><a href="#" class="page-link">Previous</a></li>
                      <li class="page-item"><a class="page-link" href="#">1</a></li>
                      <li class="page-item active">
                        <a class="page-link" href="#" aria-current="page">2</a>
                      </li>
                      <li class="page-item"><a class="page-link" href="#">3</a></li>
                      <li class="page-item"><a class="page-link" href="#">Next</a></li>
                    </div>
                </div>
            </div>
        </div>
        <div class="row p-1">
          <div class="col-11 col-md-12 m-auto m-md-0 mt-md-2">
            <div class="container p-2 m-2 rounded-1 align-items-center">
              <a href="../chat/#/topic/${encodeURI(this.name)}" 
                  class="btn btn-outline-warning d-flex m-auto w-50 justify-content-center">
                OPEN LIVE CHAT
              </a>
            </div>
          </div>
        </div>
    </section>`;
  }
}