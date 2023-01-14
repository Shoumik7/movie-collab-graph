const axios = require('axios')

const apiKey = "4dc47b6a53bc5c22c68471515de658c0";
let allMovies = [];
let allActors = [];
let counter = 1;

(async () => {
    let currMovieId;

    function getTopRatedMovieId(url, index) {
      return axios.get(url).then((resp) => {
        return resp.data.results[index].id;
      });
    }

    function getTopActorFromMovie(url){
        return axios.get(url).then((resp) => {
            if(resp.data.cast[0] != undefined)
                console.log(resp.data.cast[0].name);
        });
    }

    for(let i = 1; i <= 50; i++){
        for(let j = 0; j <= 19; j++){
            currMovieId = await getTopRatedMovieId("https://api.themoviedb.org/3/movie/top_rated?api_key=" + apiKey + "&language=en-US&page=" + i, j);
            console.log(currMovieId);

            currTopActor = await getTopActorFromMovie("https://api.themoviedb.org/3/movie/" + currMovieId + "/credits?api_key=" + apiKey + "&language=en-US");

            allActors.push(currTopActor);
        }
    }
})();



/*
async function getTopRatedMovie() {
    const url = "https://api.com";
    let response = await axios.get("https://api.themoviedb.org/3/movie/top_rated?api_key=" + apiKey + "&language=en-US&page=" + counter);
    return response.data.results;
}
*/

    //getTopRatedMovie().then((data) => console.log(data));

/*
    axios.get("https://api.themoviedb.org/3/movie/top_rated?api_key=" + apiKey + "&language=en-US&page=" + 1)
            .then(data => {console.log((data.data.results[2].id)); currMovieId = data.data.results[0].id;}) //console.log(data.data.results[i].title); allMovies.push(data.data.results[i].title);})
            .then(
                //axios.get("https://api.themoviedb.org/3/movie/" + currMovieId + "/credits?api_key=" + apiKey + "&language=en-US")
                //    .then(data => {console.log(data)})
            )
            .catch(err => console.log(err));
            
*/

    //iterate through pages
    /*
    for (let i = 1; i <= 20; i++) {
        //Get top rated movies

        let currMovieId = 0;
        
        axios.get("https://api.themoviedb.org/3/movie/top_rated?api_key=" + apiKey + "&language=en-US&page=" + i.toString())
            .then(data => {console.log((data.data))}) //console.log(data.data.results[i].title); allMovies.push(data.data.results[i].title);})
            .then(
                //axios.get("https://api.themoviedb.org/3/movie/" + currMovieId + "/credits?api_key=" + apiKey + "&language=en-US")
                //    .then(data => {console.log(data)})
            )
            .catch(err => console.log(err));
            

        /*
        axios.get("https://api.themoviedb.org/3/person/popular?api_key=" + apiKey + "&language=en-US&page=1" + i.toString())
            .then(data => {console.log((data.data)); console.log(data.results[i].title); let currMovie = resp.data.results[i].title;})
            .then(allMovies.push(currMovie))
            .catch(err => next(err));
        */   
    //}
    


