var api_base_address = "https://banana-bean-ef021024f078.herokuapp.com/api/movies/";

//Category loader
var presets = [
    {
        "type" : "carousel",
        "category_name" : "Top Picks",
        "call" : "get_movies?max_rating=5&sort_by=rating&sort_direction=desc&page_num=0&page_sz=5"
    },
    {
        "type" : "card",
        "category_name" : "Best 20th century movies",
        "call" : "get_movies?max_rating=5&max_year=1999&sort_by=rating&sort_direction=desc&page_num=0&page_sz=15"
    },
    {
        "type" : "card",
        "category_name" : "Top Rated",
        "call" : "get_movies?max_rating=5&sort_by=rating&sort_direction=desc&page_num=0&page_sz=15"
    },
    {
        "type" : "card",
        "category_name" : "Best of 2024",
        "call" : "get_movies?min_year=2024&max_year=2024&max_rating=5&sort_by=rating&sort_direction=desc&page_num=0&page_sz=15"
    },
    {
        "type" : "card",
        "category_name" : "Best of John Malkovich",
        "call" : "get_movies_with_actor?actor_id=20664&sort_by=rating&sort_direction=desc&page_num=0&page_sz=15"
    },
    {
        "type" : "card",
        "category_name" : "Best of Jake Gyllenhaal",
        "call" : "get_movies_with_actor?actor_id=4449&sort_by=rating&sort_direction=desc&page_num=0&page_sz=15"
    }
];

let sections = new Array(presets.length);
let sections_left = presets.length;

$(window).on("load", () => {
    presets.forEach(function(preset, index){
        //console.log(preset.type + "," + preset.category_name + "," + preset.call);
        let category = new Category(preset.category_name);
        axios.get(api_base_address + preset.call)
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
                let movie_card = new Movie(movie.name, 
                                            movie.date,
                                            movie.minute,
                                            movie.rating,
                                            movie.poster,
                                            movie.tagline,
                                            fixdescription(new String(movie.description)),
                                            active);
                let movie_string = movie_card.toString(preset.type);
                category.add_movie(movie_string);
            });
            sections[index] = category.toString(preset.type)
            sections_left --;
            print_sections();
            //$(".main-panel").append(category.toString(preset.type));
            //console.log(category.toString(preset.type));
        })
        .catch( error => {
            console.log(error);
        });
    });
})

function print_sections(){
    if(sections_left == 0){
        $(".main-panel").append(sections.join(``));
    }
}

function fixdescription(description){
    if(description.length > 381){
        return description.substring(0, 380) + " ...";
    }else{
        return description;
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