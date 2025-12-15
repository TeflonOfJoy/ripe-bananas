var banana_bean = 'https://banana-bean-ef021024f078.herokuapp.com/banana_bean_api/';
var banana_bread = 'https://banana-bread-36752c90e972.herokuapp.com/'

$('#request').on('click', () => {
    axios.get(banana_bean + 'get_movies', {
        params: {
            movie_name : 'Interstellar',
            year : 2014
        }
    })
    .then( response => {
        console.log(response.data);
    })
    .catch( error => {
        console.log(error);
    });
});