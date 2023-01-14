const axios = require('axios')
const fs = require('fs');
const cheerio = require("cheerio");


const apiKey = "4dc47b6a53bc5c22c68471515de658c0";
let allMovies = [];
let allActors = [];
let topMovieIds = [];


(async () => {
    let currMovieId;

    function getTopRatedMovieId(url, index) {
      return axios.get(url).then((resp) => {
      if(resp.data.results[index].id != undefined)
        topMovieIds.push(resp.data.results[index].id);
        return resp.data.results[index].id;
      });
    }

    function getTopActorFromMovie(url){
        return axios.get(url).then((resp) => {
            if(resp.data.cast[0] != undefined && resp.data.cast[0].name != null)
                return resp.data.cast[0].name;
        });
    }

    function getCastFromMovie(url){
        return axios.get(url).then((resp) => {
            if(resp.data.cast != undefined && resp.data.cast != null)
                //console.log("cast:") 
                //console.log(JSON.stringify(resp.data.cast))
                return JSON.stringify(resp.data.cast);
        });
    }

    function getMovieTitle(url){
        return axios.get(url).then((resp) => {
            //console.log(resp.data)
            if(resp.data.title != undefined && resp.data.title != null)
                //console.log("cast:") 
                //console.log(JSON.stringify(resp.data.cast))
                return resp.data.title;
        });
    }

    //Get the lead actors of the top 1000 movies
    for(let i = 1; i <= 50; i++){
        for(let j = 0; j <= 19; j++){
            currMovieId = await getTopRatedMovieId("https://api.themoviedb.org/3/movie/top_rated?api_key=" + apiKey + "&language=en-US&page=" + i, j);
            //console.log(currMovieId);
            
            if(currMovieId != null && currMovieId != undefined){
                currTopActor = await getTopActorFromMovie("https://api.themoviedb.org/3/movie/" + currMovieId + "/credits?api_key=" + apiKey + "&language=en-US");
                allActors.push(currTopActor);
            }
        }
    }

    function getUniqueActors(){
        let uniqueActors = [];

        allActors.forEach(actor => {
            if (!uniqueActors.includes(actor) && actor != null) {
                uniqueActors.push(actor);
                //console.log(actor)
            }
        });

        return uniqueActors;
    }

    let uniqueActors = getUniqueActors();
    
    console.log("allActors.length: " + allActors.length)
    console.log("uniqueActors.length" + uniqueActors.length)

    const jsonContent = JSON.stringify(uniqueActors);

    fs.writeFile("./uniqueActors.json", jsonContent, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    }); 

    
    //Determine if two of the actors have collaborated on a top movie => if they have then add an array containing the two actors' names to a larger existing array
    let movieCollabGroups = {};
    let currCastFromMovie;
    let currTopActorsInMovie = [];
    //let currmovieCollabGroup = [];


    //Find who collaborated from chosen actors in these top movies
    
    for(let i = 0; i < topMovieIds.length; i++){
        currCastFromMovie = await getCastFromMovie("https://api.themoviedb.org/3/movie/" + topMovieIds[i] + "/credits?api_key=" + apiKey + "&language=en-US");
        currTopActorsInMovie = [];

        for(let j = 0; j <= uniqueActors.length; j++){
            if (currCastFromMovie.includes(uniqueActors[j])){
                currTopActorsInMovie.push(uniqueActors[j]);
                //console.log("includes: " + uniqueActors[j]);

            }
        }

        if (currTopActorsInMovie.length > 1){
            let currMovieTitle = await getMovieTitle("https://api.themoviedb.org/3/movie/" + topMovieIds[i] + "?api_key=" + apiKey + "&language=en-US");

            https://api.themoviedb.org/3/movie/{movie_id}?api_key=<<api_key>>&language=en-US
            movieCollabGroups[currMovieTitle] = currTopActorsInMovie;
        }

        console.log(i + " movie collab analyzation complete");

    }

    console.log(JSON.stringify(movieCollabGroups));

    const movieCollabGroupsJsonContent = JSON.stringify(movieCollabGroups);

    fs.writeFile("./movieCollabGroups.json", movieCollabGroupsJsonContent, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    }); 

    //for(let i = 0; i < movieCollabGroups.length; i++){
    //    console.log(JSON.stringify(movieCollabGroups[i]))
    //}

    /*
    for(let i = 0; i < uniqueActors.length; i++){
        for(let j = i + 1; j < uniqueActors.length; j++){
            
            const searchString = uniqueActors[i] + " and " + uniqueActors[j] + " movies";
            const encodedString = encodeURI(searchString);

            let arrActorCollaborationPairs = [];

            const AXIOS_OPTIONS = {
                headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
                },
            };
            
            function getOrganicResults() {
                return axios
                .get(
                    `https://www.google.com/search?q=${encodedString}&hl=en&gl=us`,
                    AXIOS_OPTIONS
                )
                .then(function ({ data }) {
                    let $ = cheerio.load(data);

                    //i29hTd => I believe this is the CSS selector for movies with two searched poeple in it

                    if ($(".i29hTd").length) {
                        console.log('It exists!');
                        movieCollabPairs.push([uniqueActors[i], uniqueActors[j]])
                        
                    } else {
                        console.log('Does not exist');
                    }            
                })
                .catch((err) => {
                    return;

                })
            }
            
            getOrganicResults();
            
        }     
    }
    */

    /*
    movieCollabPairs.forEach(pair => {
        console.log(pair[0] + ' ' + pair[1]);
    });
    */


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
    


