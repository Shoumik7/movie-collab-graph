import axios from 'axios';
import logo from './logo.svg';
import React, { useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css';
import { useEffect, useLayoutEffect } from "react";
import Graph from "graphology";
import { SigmaContainer, useLoadGraph } from "@react-sigma/core";
import "@react-sigma/core/lib/react-sigma.min.css";
import getNodeProgramImage from "sigma/rendering/webgl/programs/node.image";
import {ControlsContainer, ZoomControl, FullScreenControl, SearchControl } from "@react-sigma/core";
import { LayoutForceAtlas2Control } from "@react-sigma/layout-forceatlas2";
import testJson from "./test.json";
import testJsonGraphFromGexf from "./testoutput.json";
import newTestJson from "./newTestJson.json";
import { parse } from "graphology-gexf/browser";
import { useRegisterEvents, useSetSettings } from "@react-sigma/core";
import { FC } from "react";

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

  /*
  const [graph, setGraph] = useState(0);

  useLayoutEffect(() => {
    fetch("./test.gexf")
      .then((res) => res.text())
      .then((gexf) => {
        setGraph(parse(Graph, gexf))
        console.log(graph)
      })

  }, []);
  */

  //const graph = Graph.from(jsonGraphExample);
  //const graph = {"nodes":[{"id":"0","label":"0"},{"id":"1","label":"1"},{"id":"2","label":"2"},{"id":"3","label":"3"}],"edges":[{"id":"0","type":"undirected","label":"","source":"0","target":"1","weight":1},{"id":"1","type":"undirected","label":"","source":"1","target":"2","weight":1},{"id":"2","type":"undirected","label":"","source":"2","target":"3","weight":1}]}
  //const graph = GraphFormatConverter.fromJson(jsonGraph);

  //fixNG = json_graph.node_link_data(NG)

  const graph = Graph.from(testJson);

  const [hoveredNode, setHoveredNode] = useState("");
  const [selectedNode, setSelectedNode] = useState("");
  const [hoveredNeighbors, setHoveredNeighbors] = useState([]);

  const GraphEvents = () => {
    const registerEvents = useRegisterEvents();
    const setSettings = useSetSettings();

    const state = {
      hoveredNode: "",
      selectedNode: "",
      hoveredNeighbors: []
    }

    useEffect(() => {
      // Register the events
      registerEvents({
        // node events
        //clickNode: (event) => console.log("clickNode", event.event, event.node, event.preventSigmaDefault),
        //enterNode: (event) => {console.log("enterNode", event.node); setHoveredNode(event.node)},
        enterNode: (event) => {console.log("enterNode", event.node);},
        leaveNode: (event) => {console.log("leaveNode", event.node);},
      });
    }, [registerEvents]);

    return null;
  }


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
        style={{ height: "750px" }}
        settings={{
          nodeProgramClasses: { image: getNodeProgramImage() },
          defaultNodeType: "image",
          defaultEdgeType: "line",
          labelDensity: 0.07,
          labelGridCellSize: 60,
          labelRenderedSizeThreshold: 20,
          labelFont: "Lato, sans-serif",
          zIndex: true,          
        }}
        
      >
        <GraphEvents />
        
        <ControlsContainer position={"bottom-right"}>
          <ZoomControl />
          <FullScreenControl />
          <LayoutForceAtlas2Control />
        </ControlsContainer>
        <ControlsContainer position={"top-left"}>
          <SearchControl style={{ width: "350px" }} />
        </ControlsContainer>

      </SigmaContainer>

        
    </div>
  );
}

export default App;
