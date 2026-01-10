var presets = [
    {
        "type" : "search",
        "id" : "movie-search",
        "search_type" : "movie",
        "category_name" : "Search results for ",
        "endpoint" : "api/movies/get_movies",
        params : {
            max_rating : 5,
            sort_by : "rating",
            sort_direction : "desc",
            page_num: 0,
            page_sz: 20
        }
    },
    {
        "type" : "search",
        "id" : "movies-with-actor-search",
        "search_type" : "actor",
        "category_name" : "Search results for ",
        "endpoint" : "api/movies/get_movies_with_actor",
        params : {
            actor_id : "",
            page_num: 0,
            page_sz: 20
        }
    },
    {
        "type" : "search",
        "id" : "movies-with-genre-search",
        "search_type" : "genre",
        "category_name" : "Search results for ",
        "endpoint" : "api/movies/get_movies",
        params : {
            genres : [],
            page_num: 0,
            page_sz: 20
        }
    }
];

$(window).on("load", () => {
    console.log(window.location.hash);
});

function getSearchTermFromURL() {
    const hash = window.location.hash; // Gets "#/search/Cowboy"
    if (hash.startsWith('#/search/')) {
        return hash.replace('#/search/', ''); // Returns "Cowboy"
    }
    return "";
}