var _presets = {
    movie : {
        type : "search",
        id : "movie-search",
        search_type : "movie",
        category_name : "Search results for ",
        endpoint : "api/movies/get_movies",
        params : {
            max_rating : 5,
            sort_by : "rating",
            sort_direction : "desc",
            page_num: 0,
            page_sz: 20
        }
    },
    actor : {
        type : "search",
        id : "movies-with-actor-search",
        search_type : "actor",
        category_name : "Movies starring ",
        endpoint : "api/movies/get_movies_with_actor_name",
        params : {
            actor_name : "",
            page_num: 0,
            page_sz: 20
        }
    },
    genre : {
        type : "search",
        id : "movies-with-genre-search",
        search_type : "genre",
        category_name : "Movies with genre ",
        endpoint : "api/movies/get_movies",
        params : {
            genres : "",
            page_num: 0,
            page_sz: 20
        }
    }
};

$(window).on("load", () => {
    search_router();
});

window.addEventListener('hashchange', () => {
    $('section').remove();
    $('#loader').removeClass('d-none');
    $('.navbar-toggler').not('.collapsed').trigger('click');
    search_router();
});

function search_router(){
    var search = get_search_from_url();
    if(search.term.length == 0){
        console.log("Error: search with empty string");
    }
    switch (search.type){
        case 'movie':
            search_movie(search.term);
            break;
        case 'genre':
            search_genre(search.term);
            break;
        case 'actor':
            search_actor(search.term);
            break;
    }
}

$('#main-search-button').on('click', () => {
    //If #main-search-bar is focused and user presses ENTER, it triggers like a click
    if($('#main-search-bar').val().length > 0){
        var search = get_search_values();
        var search_hash = "/" + search.type + "/" + search.term;
        redirect_search(search_hash);
    }
    return;
});

function get_search_values(){
    var term = $('#main-search-bar').val();
    $('#main-search-bar').val('');
    return {
        term : term,
        type : $('#search-type').val()
    };
}

function redirect_search(search_term) {
    redirect_url("search/#" + search_term);
}

function search_movie(search_term){
    var preset = _presets.movie;
    preset.params.movie_name = search_term;
    perform_search(preset, search_term);
}

function search_genre(search_term){
    var preset = _presets.genre;
    preset.params.genres = search_term;
    perform_search(preset, search_term);
}

function search_actor(search_term){
    var preset = _presets.actor;
    preset.params.actor_name = search_term;
    perform_search(preset, search_term);
}

function print_search(preset, category){
    $('#loader').addClass("d-none");
    $('#page-content').append(category.toString(preset.type));
}

function perform_search(preset, search_term){
    var category = new Category(preset.category_name + "\"" + search_term + "\"", preset.id);
    axios.get(_api_base_address + preset.endpoint, {params : preset.params})
        .then( response => {
            let active = "";
            response.data.content.forEach( function(movie, index){
                let movie_card = new Movie(movie.id,
                                            movie.name, 
                                            movie.date,
                                            fixnull( new String(movie.minute)),
                                            fixrating( new String(movie.rating)),
                                            fixnull( new String(movie.poster)),
                                            fixnull( new String(movie.tagline)),
                                            fixnull( new String(movie.description)),
                                            active);
                let movie_string = movie_card.toString(preset.type);
                category.add_movie(movie_string);
            });
            print_search(preset, category);
        })
        .catch( error => {
            console.log(error);
        });
}

function get_search_from_url() {
    const hash = decodeURI(window.location.hash);
    // Gets "#/genre/Horror OR #/movie/Snatch OR #/actor/Henry Cavill"

    if (hash.startsWith('#/movie/')) {
        return {
            term : hash.replace('#/movie/', ''),
            type : 'movie'
        }
    }else if(hash.startsWith('#/genre/')){
        return {
            term : hash.replace('#/genre/', ''),
            type : 'genre'
        }
    }else if(hash.startsWith('#/actor/')){
        return {
            term : hash.replace('#/actor/', ''),
            type : 'actor'
        }
    }else{
        return null;
    }
}