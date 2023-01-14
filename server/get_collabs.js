const axios = require('axios')
const fs = require('fs');
const cheerio = require("cheerio");


   const searchString = "johnny depp and robert downey jr movies";
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

            if ($(".i29hTd").length) {
                console.log('It exists!')
              } else {
                console.log('Does not exist')
              }
            //EyBRub => I believe this is the CSS selector for movies with two searched poeple in it
      
            
          });
      }
      
      getOrganicResults();