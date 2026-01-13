var _movie_details_call = {
    movie_id: 0,
    review: {
        endpoint: "api/reviews/movie/",
        params: {
            page: 0,
            order: "date"
        }
    },
    movie_detail: {
        endpoint: "api/movies/get_movie_details/",
    }
};

$(window).on("load", () => {
    load_details();
});

window.addEventListener('hashchange', () => {
    $('section').remove();
    $('#loader').removeClass('d-none');
    load_details();
});

function load_details(){
    var movie_id = get_movie_id_from_url();
    if(movie_id.length == 0){
        console.log("Error: cannot fetch movie with empty id")
    }
    _movie_details_call.movie_id = movie_id;
    fetch_details();
}

function fetch_details(){
    axios.get( _api_base_address + 
            _movie_details_call.movie_detail.endpoint +
            _movie_details_call.movie_id)
        .then( response => {
            var movie = response.data;
            //id, name, date, tagline, description, minute, rating, poster
            var movie_detail = new MovieDetail(movie.id,
                                                fixnull(new String(movie.name)),
                                                fixnull(new String(movie.date)),
                                                fixnull(new String(movie.tagline)),
                                                fixnull(new String(movie.description)),
                                                fixnull(new String(movie.minute)),
                                                fixrating(new String(movie.rating)),
                                                fixnull(new String(movie.poster)),
                                                );
            movie.genres.forEach(genre => {
                movie_detail.add_genre(genre);
            });
            movie.actors.forEach( actor => {
                movie_detail.add_actor(actor.name, actor.role);
            });
            movie.crew.forEach(crew => {
                movie_detail.add_crew(crew.name, crew.role);
            });
            movie.themes.forEach(theme => {
                movie_detail.add_theme(theme);
            });
            movie.studios.forEach(studio => {
                movie_detail.add_studio(studio);
            });
            movie.languages.forEach(language => {
                movie_detail.add_languages(language.language);
            });
            movie.countries.forEach(country => {
                movie_detail.add_country(country);
            });
            movie.releases.forEach(release => {
                var date = fixdate(release.date);
                var date_string = date.getDay() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
                movie_detail.add_release(fixnull(release.country), 
                                        date_string, 
                                        fixrating(new String(release.rating)),
                                        fixnull(release.type));
            });
            print_details(movie_detail);
        })
        .catch( error => {
            console.log(error);
        });
}

function print_details(movie_detail){
    $('#loader').addClass('d-none');
    $('section').remove();
    $('#page-content').append(movie_detail.toString());
    load_reviews(movie_detail.id);
}

function load_reviews(id){
    console.log("must load reviews")
}

function get_movie_id_from_url() {
    const hash = decodeURI(window.location.hash);
    if(hash.startsWith('#/detail/')) {
        return hash.replace('#/detail/', '');
    }
}