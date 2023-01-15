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
import { useRegisterEvents, useSetSettings, useSigma } from "@react-sigma/core";
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

  localStorage.setItem('clickedNode', null)

  const [movieData, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState('');
  const [addedCollab, setAddedCollab] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  let [movieArr, setMovieArr] = useState([]);
  const movieItems = movieArr.map((movie) =>
    <li key={movie.toString()}>
      {movie}
    </li>
  );

  /*
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
  */

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

  const GraphEvents =  () => {
    const sigma = useSigma();
    const registerEvents = useRegisterEvents();
    const loadGraph = useLoadGraph();
    const setSettings = useSetSettings();
    const [hoveredNode, setHoveredNode] = useState(null);
    const [secondHoveredNode, setSecondHoveredNode] = useState(null);
    const [clickedNode, setClickedNode] = useState(null);

    useEffect(() => {
      // Register the events
      registerEvents({
        enterNode: event => {
          if(localStorage.getItem('clickedNode') !== 'null'){
            if(event.node !== localStorage.getItem('clickedNode')){
              setSecondHoveredNode(event.node);
              localStorage.setItem('secondHoveredNode', event.node);
            }
          } 
          else{
              setHoveredNode(event.node)
          }
        },
        leaveNode: event => {
          if(localStorage.getItem('clickedNode') !== 'null'){
              //setHoveredNode(null);
              setHoveredNode(localStorage.getItem('clickedNode'))
              //;

            //localStorage.getItem('clickedNode') === event.node ? setHoveredNode(event.node) : setHoveredNode(null)
          }else{
            setHoveredNode(null);
            localStorage.setItem('secondHoveredNode', null);

            
          } 

          
        },
        clickNode: event => {
          if(localStorage.getItem('clickedNode') === event.node){
            setClickedNode(null);
            setHoveredNode(null);
            localStorage.setItem('clickedNode', null)
            localStorage.setItem('secondHoveredNode', null);
          }
          else{
            console.log(event.node); setClickedNode(event.node); localStorage.setItem('clickedNode', event.node); localStorage.setItem('secondHoveredNode', null);
          }
        },
        clickStage: event => {
            setHoveredNode(null)
            localStorage.setItem('clickedNode', null)
            localStorage.setItem('secondHoveredNode', null);

        }
      });
    }, [registerEvents]);

    useEffect(() => {
        setSettings({
          nodeReducer: (node, data) => {
            const graph = sigma.getGraph();
            const newData = { ...data, highlighted: data.highlighted || false };
    
            if (secondHoveredNode) {
                //console.log(secondHoveredNode)
                if(localStorage.getItem('clickedNode') !== 'null'){

                  if(secondHoveredNode ){
                    
                      if (node === secondHoveredNode || node === localStorage.getItem('clickedNode') || graph.neighbors(hoveredNode).includes(node)) {
                        newData.highlighted = true;
                      } else {
                      }
                  }
                   
                }
              
            }
            return newData;
          },
          
        });
    }, [secondHoveredNode])

    useLayoutEffect(() => {
  }, [clickedNode])
  
    useEffect(() => {
      setSettings({
        nodeReducer: (node, data) => {
          const graph = sigma.getGraph();
          const newData = { ...data, highlighted: data.highlighted || false };
  
          if (hoveredNode) {
            if (node === hoveredNode || graph.neighbors(hoveredNode).includes(node)) {
              newData.highlighted = true;
            } else {
              newData.color = "#E2E2E2";
              newData.highlighted = false;
            }
          }
          return newData;
        },
        edgeReducer: (edge, data) => {
          const graph = sigma.getGraph();
          const newData = { ...data, hidden: false };
  
          if (hoveredNode && !graph.extremities(edge).includes(hoveredNode)) {
            newData.hidden = true;
          }
          return newData;
        },
      });
    }, [hoveredNode]);

    let movieCollabGroups = require('./movieCollabGroups.json');
    //movieCollabGroups = JSON.parse(movieCollabGroups);

    console.log(movieCollabGroups)



    useEffect(() => {
      if(localStorage.getItem('clickedNode') !== 'null' && localStorage.getItem('secondHoveredNode') !== 'null'){
        //console.log("testing collab");
        //console.log(localStorage.getItem('clickedNode'));
        //console.log(localStorage.getItem('secondHoveredNode'));
  
        //let counter = 0;
        for (let key in movieCollabGroups) {
          //console.log(key + ' has ' + movieCollabGroups[key])
          //console.log(localStorage.getItem('clickedNode'));
          //console.log(localStorage.getItem('secondHoveredNode'));
          //console.log(counter);
          //counter++;
      
          //movie that is shared between clicked and second hovered is stored in key
          if(movieCollabGroups[key].includes(localStorage.getItem('clickedNode')) && movieCollabGroups[key].includes(localStorage.getItem('secondHoveredNode'))){
              //console.log("done");
              console.log(key);
              //key is the movie that both the clickedNode actor and secondHoveredNode actor were in
          }
        }
      }
    }, [secondHoveredNode])
  
    return null;
  }
  

  

  return (
    <div>
      <SigmaContainer
        graph={graph}
        style={{ height: "790px" }}
        settings={{
          nodeProgramClasses: { image: getNodeProgramImage() },
          defaultNodeType: "image",
          defaultEdgeType: "line",
          labelDensity: 0.01,
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
