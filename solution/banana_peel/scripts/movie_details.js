var _movie_details_call = {
    movie_id: 0,
    review: {
        endpoint: "api/reviews/movie/",
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
                movie_detail.add_languages(language.language, language.type.replace(' language', ''));
            });
            movie.countries.forEach(country => {
                movie_detail.add_country(country);
            });
            movie.releases.sort(function(a, b){return new Date(a.date) - new Date(b.date)}).reverse().forEach(release => {
                var date = fixdate(release.date);
                var date_o = {
                    day: new String(date.getDate()),
                    month: new String(date.getMonth() + 1),
                    year: new String(date.getFullYear())
                }
                var date_string = (date_o.day.length > 1 ? date_o.day : "0" + date_o.day) 
                    + "/" + 
                    (date_o.month.length > 1 ? date_o.month : "0" + date_o.month ) 
                    + "/" + date_o.year;
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
    load_reviews(movie_detail.id, movie_detail);
}

function load_reviews(id, movie_detail){
    axios.get(_api_base_address + 
            _movie_details_call.review.endpoint + id, {
                params:{
                    limit: 6,
                    date: "date",
                    order: "desc"
                }
            })
    .then(response => {
        var reviews = response.data.data.reviews;
        var pagination = response.data.data.pagination;
        $('#loader-reviews').addClass('d-none');
        if(pagination.total_count == 0){
            $('#empty-reviews').removeClass('d-none');
            return;
        }else{
            reviews.forEach(review => {
                var date = fixdate(review.review_date);
                var date_o = {
                    day: new String(date.getDate()),
                    month: new String(date.getMonth() + 1),
                    year: new String(date.getFullYear())
                }
                var date_string = (date_o.day.length > 1 ? date_o.day : "0" + date_o.day) 
                    + "/" + 
                    (date_o.month.length > 1 ? date_o.month : "0" + date_o.month ) 
                    + "/" + date_o.year;
                //add_review(name, publisher, score, content, date, time)
                movie_detail.add_review(review.critic_name,
                                            review.publisher_name,
                                            fixrating(new String(review.review_score)),
                                            review.review_content,
                                            date_string);
            });
            $('#reviews-container').append(movie_detail.reviews.join(''));
            $('#pagination').removeClass('d-none');
        }
    })
    .catch(error => {
        console.log(error);
    });
}

function empty_reviews(){
    $('#reviews-container').empty();
}

function get_movie_id_from_url() {
    const hash = decodeURI(window.location.hash);
    if(hash.startsWith('#/detail/')) {
        return hash.replace('#/detail/', '');
    }
}