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
import { ControlsContainer, ZoomControl, FullScreenControl, SearchControl } from "@react-sigma/core";
import { LayoutForceAtlas2Control } from "@react-sigma/layout-forceatlas2";
import testJson from "./test.json";
import testJsonGraphFromGexf from "./testoutput.json";
import newTestJson from "./newTestJson.json";
import { parse } from "graphology-gexf/browser";
import { useRegisterEvents, useSetSettings, useSigma } from "@react-sigma/core";
import { FC } from "react";
import Button, { ButtonProps } from '@mui/material/Button';
import { Drawer, Box } from '@mui/material';


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
  const [searchResTitle, setSearchResTitle] = useState("")

  const [movieArr, setMovieArr] = useState([]);
  let movieItems = movieArr.map((movie) =>
    <li key={movie.toString()}>
      {movie}
    </li>
  );


  const graph = Graph.from(testJson);

  const [hoveredNode, setHoveredNode] = useState("");
  const [selectedNode, setSelectedNode] = useState("");
  const [hoveredNeighbors, setHoveredNeighbors] = useState([]);

  const SearchBar = () => {
    // Search value
    const [search, setSearch] = useState("");
    // Datalist values
    const [values, setValues] = useState([ {} ]);
    // Selected
    const [selected, setSelected] = useState(null);
    // random id for the input
    const [inputId, setInputId] = useState("");


  /**
   * When the search input changes, recompute the autocomplete values.
   */
  useEffect(() => {
    const newValues = [];
    if (!selected && search.length > 1) {
      graph.forEachNode((key, attributes) => {
        if (attributes.label && attributes.label.toLowerCase().includes(search.toLowerCase()))
          newValues.push({ id: key, label: attributes.label });
      });
    }
    setValues(newValues);
  }, [search]);


  /**
   * When the selected item changes, highlighted the node and center the camera on it.
   */
  useEffect(() => {
    if (!selected) {
      return;
    }

    graph.setNodeAttribute(selected, "highlighted", true);
    //gotoNode(selected);
    localStorage.setItem("clickedNode", selected)

    return () => {
      graph.setNodeAttribute(selected, "highlighted", false);
    };
  }, [selected]);

  /**
   * On change event handler for the search input, to set the state.
   */
  const onInputChange = (e) => {
    const searchString = e.target.value;
    const valueItem = values.find((value) => value.label === searchString);
    if (valueItem) {
      setSearch(valueItem.label);
      setValues([]);
      setSelected(valueItem.id);
    } else {
      setSelected(null);
      setSearch(searchString);
    }
  };

  // Common html props for the div

  return (
    <div style={{ width: "200px"}}>
      <label htmlFor={inputId} style={{ display: "none" }}>
          Search a node
        </label>
        <input
          id={inputId}
          type="text"
          placeholder="Search for actors and directors..."
          list={`${inputId}-datalist`}
          value={search}
          onChange={onInputChange}
          style={{width: "190px"}}
        />
        <datalist id={`${inputId}-datalist`}>
          {values.map((value) => (
            <option key={value.id} value={value.label}>
              {value.label}
            </option>
          ))}
        </datalist>
      </div>
    );
  };

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
                        setShowWelcome(false);
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
    //console.log(movieCollabGroups)

    

    useEffect(() => {
      if(localStorage.getItem('clickedNode') !== 'null' && localStorage.getItem('secondHoveredNode') !== 'null'){
        //console.log("testing collab");
        //console.log(localStorage.getItem('clickedNode'));
        //console.log(localStorage.getItem('secondHoveredNode'));
        //let counter = 0;
        let tempMovieArr = [];
        
        for (let key in movieCollabGroups) {
          //console.log(key + ' has ' + movieCollabGroups[key])      
          //movie that is shared between clicked and second hovered is stored in key

          if(movieCollabGroups[key].includes(localStorage.getItem('clickedNode')) && movieCollabGroups[key].includes(localStorage.getItem('secondHoveredNode'))){
              //console.log("done");
              console.log(key);
              tempMovieArr.push(key);
              setMovieArr(tempMovieArr)
              setSearchResTitle("Collaborations between " + localStorage.getItem('clickedNode') + " and " + localStorage.getItem('secondHoveredNode') + ":")
              //key is the movie that both the clickedNode actor and secondHoveredNode actor were in

                movieItems = movieArr;
                movieArr.map((movie) =>
                  <li key={movie.toString()}>
                    {movie}
                  </li>
                );
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
        
        <ControlsContainer style={{ marginLeft: "10px", marginTop: "10px"}} position={"top-left"}>
          <SearchControl />
        </ControlsContainer>
        <ControlsContainer style={{ border: "0px", marginLeft: "130px", marginTop: "95px"}} position={"top-left"}>

        </ControlsContainer>
      </SigmaContainer>

      <Drawer variant="permanent" hideBackdrop anchor = 'right' open>
        <Box
          sx={{ width: 350, margin: "20px" }}
          role="presentation"   
        >
          {showWelcome && <img height="200px" width="200px" id="logo" src={require("./images/moviecollabsfirstlogo.png")}/>}
          <ul>
            {showWelcome && <div><h1 margin="10px">Welcome to Movie Collabs!</h1>
              <p>Observe and enjoy the collaborations of your favorite actors in the peak of their film-making. Or just enjoy the pretty colors.</p>
              <p>Click on one node and hover over another to see the movies that they have starred in together.</p>
              </div> }
              {!showWelcome && <h1>{searchResTitle}</h1>}
              {movieItems}
          </ul>
        </Box>
      </Drawer>
        
    </div>
  );
}

export default App;
