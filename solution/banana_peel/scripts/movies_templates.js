class Movie{
  constructor(title, year, duration, rating, poster, tagline, description, active){
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
    }else if(type == "card"){
      return this.get_movie_card();
    }
  }

  get_movie_card() {
    return `<div class="card movie-card p-0">
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
        <div class="card m-auto w-100" style="max-width: 586px;">
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
              <p class="card-text row mt-auto d-none">
                <span class="col tablet-hidden"><i class="bi bi-star"></i> ${this.rating}</span>
                <span class="col"><i class="bi bi-clock"></i> ${this.duration}</span>
                <span class="col"><i class="bi bi-calendar"></i> ${this.year}</span>
              </p>
            </div>
          </div>
        </div>
      </div>`
  }
}

class Category{
  constructor(category_name, id){
    this.category_name = category_name;
    this.movies = [];
    this.last_idx = 0;
    this.movies_string = "";
    this.id = id;
  }

  add_movie(movie){
    this.movies[this.last_idx] = movie;
    this.last_idx ++;
  }

  toString(type){
    this.movies_string = this.movies.join("");
    if(type == "carousel"){
      return this.get_movie_carousel_category();
    }else if(type == "card"){
      return this.get_movie_card_category();
    }
  }

  get_movie_card_category() {
    return `<section class="me-1 ms-1">
      <h3 class="mb-2">
          <a href="#!" class="title text-white">
              <span class="text-warning font-weight-bold pr-3">|</span>${this.category_name}
          </a>
      </h3>
      <div id="${this.id}" class="d-flex mb-5 mt-4 movie-card-scroller flex-shrink-0" style="border: 0px solid green">
          ${this.movies_string}
      </div>
    </section>`
  }

  get_movie_carousel_category() {
    return `<section class="me-1 ms-1">
      <h3 class="mb-2">
        <a href="#!" class="title text-white">
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
//style="max-height: fit-content!important;"