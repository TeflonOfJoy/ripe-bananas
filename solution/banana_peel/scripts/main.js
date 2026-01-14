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
        axios.get(_api_base_address + preset.endpoint, {params : preset.params})
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
    $('.movie-card,.movie-card-carousel').on('click', (element) => {
        var id = element.currentTarget.attributes.id.value;
        //console.log("movie_details/#/detail/" + id);
        redirect_url("movie_details/#/detail/" + id);
    });
}