var bean = "https://banana-bean-ef021024f078.herokuapp.com/api/movies/";
var api_base_address = "https://split-banana-88c30c01daf5.herokuapp.com/";

//Category loader
var presets = [
    {
        "type" : "carousel",
        "id" : "top-picks",
        "category_name" : "Top Picks",
        "endpoint" : "api/movies/get_movies",
        params : {
            max_rating : 5,
            sort_by : "rating",
            sort_direction : "desc",
            page_num: 0,
            page_sz: 5
        }
    },
    {
        "type" : "card",
        "id" : "twentieth-century",
        "category_name" : "Best of 20th century Sci-Fi",
        "endpoint" : "api/movies/get_movies",
        params : {
            max_rating : 5,
            max_year : 1999,
            sort_by : "rating",
            genres : "Science Fiction",
            sort_direction : "desc",
            page_num : 0,
            page_sz : 15
        }
    },
    {
        "type" : "card",
        "id" : "comedy-horror",
        "category_name" : "Best of Comedy Horror",
        "endpoint" : "api/movies/get_movies",
        params : {
            max_rating : 5,
            sort_by : "rating",
            sort_direction : "desc",
            min_year : 2005,
            genres : ["Comedy", "Horror"],
            page_num : 0,
            page_sz : 15
        }
    },
    {
        "type" : "card",
        "id" : "star-wars",
        "category_name" : "Star Wars",
        "endpoint" : "api/movies/get_movies",
        params : {
            movie_name : "Star Wars:",
            genres : "Science Fiction",
            page_num : 0,
            page_sz : 15
        }
    },
    {
        "type" : "card",
        "id" : "best-malkovich",
        "category_name" : "Best of John Malkovich",
        "endpoint" : "api/movies/get_movies_with_actor",
        params : {
            actor_id : 20664,
            max_rating : 5,
            sort_by : "rating",
            sort_direction : "desc",
            page_num : 0,
            page_sz : 15
        }
    },
    {
        "type" : "card",
        "id" : "best-gyllenhaal",
        "category_name" : "Best of Jake Gyllenhaal",
        "endpoint" : "api/movies/get_movies_with_actor",
        params : {
            actor_id : 4449,
            max_rating : 5,
            sort_by : "rating",
            sort_direction : "desc",
            page_num : 0,
            page_sz : 15
        }
    }
];

let sections = new Array(presets.length);
let sections_left = presets.length;

$(window).on("load", () => {
    presets.forEach(function(preset, index){
        //console.log(preset.type + "," + preset.category_name + "," + preset.call);
        let category = new Category(preset.category_name, preset.id);
        axios.get(api_base_address + preset.endpoint, {params : preset.params})
        .then( response => {
            //console.log(response.data.content);
            let active_index = 1;
            let active = "";
            response.data.content.forEach( function(movie, index){
                if(active_index == 1){
                    active = "active";
                    active_index --;
                }else{
                    active = "";
                }
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
            sections[index] = category.toString(preset.type)
            sections_left --;
            print_sections();
        })
        .catch( error => {
            console.log(error);
        });
    });
})

function print_sections(){
    if(sections_left == 0){
        $("#page-content").append(sections.join(``));
        document.querySelectorAll('.carousel').forEach(carousel_element => {
            new bootstrap.Carousel(carousel_element);
        });
    }
}

function fixnull(unfixed_string){
    if(unfixed_string == "null"){
        return "-";
    }else{
        return unfixed_string;
    }
}

function fixrating(rating){
    if(rating == "null"){
        return "-";
    }else if(rating.length == 1){
        return rating + ".0"
    }else if(rating.length > 3){
        return rating.substring(0,3);
    }else{
        return rating;
    }
}

//Search redirection
$(document).keypress(function(e) {
    if(e.which != 13) return
    if($('#main-search-bar').is(':focus') && $('#main-search-bar').val().length > 0){
        var search_term = $('#main-search-bar').val();
        redirect_search(search_term);
    }
});

function redirect_search(search_term) {
    var sanitized_term = sanitizeString(search_term);
    redirect_url("search/#" + sanitized_term);
}

function redirect_url(new_page){
    var protocol = window.location.protocol;
    var hostname = window.location.hostname;
    var port = window.location.port;
    var pathname = window.location.pathname;
    console.log(protocol + "//" + hostname + (port ? ":" + port : "") + pathname + new_page);
    window.location.href = protocol + "//" + 
                            hostname + 
                            (port ? ":" + port : "") + 
                            pathname + 
                            new_page;
}

function sanitizeString(str){
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    return str.trim();
}