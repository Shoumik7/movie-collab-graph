import axios from 'axios';
import logo from './logo.svg';
import React, { useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css';
import MyGraph from './pages/MyGraph'

function App() {
  const [data, setData] = useState({data: []});
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const apiKey = "4dc47b6a53bc5c22c68471515de658c0";
      const {data} = await axios.get('https://reqres.in/api/users');
      console.log('data is: ', JSON.stringify(data, null, 4));

      setData(data);
    } catch (err) {
      setErr(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MyGraph />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
