import axios from 'axios';
import logo from './logo.svg';
import './App.css';
import {useState} from 'react';

function App() {
  const [movieData, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const apiKey = "4dc47b6a53bc5c22c68471515de658c0";
      let allMovies = "";
      for (let i = 1; i <= 50; i++) {
        let resp = await axios.get("https://api.themoviedb.org/3/movie/top_rated?api_key=" + apiKey + "&language=en-US&page=" + i.toString());
        for (let i = 0; i < 20; i++) {
          let currMovie = resp.data.results[i].title + "\n";
          allMovies += currMovie;
          console.log(currMovie);
        }
      }
      setData(allMovies);
    } catch (err) {
      setErr(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  return (
    <div>
      <div>
        {err && <h2>{err}</h2>}
        <button onClick={handleClick}>Fetch data</button>
        {isLoading && <h2>Loading...</h2>}
      </div>
      <div>
        <p>{movieData}</p>
      </div>
    </div>
  );
}

export default App;
