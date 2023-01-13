import axios from 'axios';
import logo from './logo.svg';
import React, { useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css';
import { useEffect } from "react";
import Graph from "graphology";
import { SigmaContainer, useLoadGraph } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";
import {ControlsContainer, ZoomControl, FullScreenControl, SearchControl } from "@react-sigma/core";
import { LayoutForceAtlas2Control } from "@react-sigma/layout-forceatlas2";
import jsonGraph from "./test.json";

export const LoadGraph = () => {
  const loadGraph = useLoadGraph();

  useEffect(() => {
    const graph = new Graph();
    graph.addNode("first", { x: 0, y: 0, size: 15, label: "Leonardo DiCaprio", color: "#FA4F40" });
    loadGraph(graph);
  }, [loadGraph]);

  return null;
};

function App() {
  const [movieData, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const apiKey = "4dc47b6a53bc5c22c68471515de658c0";
      let allMovies = [];
      for (let i = 1; i <= 50; i++) {
        let resp = await axios.get("https://api.themoviedb.org/3/movie/top_rated?api_key=" + apiKey + "&language=en-US&page=" + i.toString());
        for (let i = 0; i < 20; i++) {
          let currMovie = resp.data.results[i].title;
          allMovies.push(currMovie);
          let actorResp = await axios.get("https://api.themoviedb.org/3/movie/" + resp.data.results[i].id + "?api_key=" + apiKey + "&language=en-US");
          
        }
      }
      
      setData(allMovies);
    } catch (err) {
      setErr(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const graph = Graph.from(jsonGraph);

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

      <SigmaContainer
        graph={graph}
        style={{ height: "600px" }}
        settings={{
          nodeProgramClasses: { image: getNodeProgramImage() },
          defaultNodeType: "image",
          defaultEdgeType: "line",
          labelDensity: 0.07,
          labelGridCellSize: 60,
          labelRenderedSizeThreshold: 15,
          labelFont: "Lato, sans-serif",
          zIndex: true,
          
        }}
      >
        <ControlsContainer position={"bottom-right"}>
          <ZoomControl />
          <FullScreenControl />
          <LayoutForceAtlas2Control />
        </ControlsContainer>
        <ControlsContainer position={"top-right"}>
          <SearchControl style={{ width: "200px" }} />
        </ControlsContainer>
      </SigmaContainer>

        
    </div>
  );
}

export default App;
