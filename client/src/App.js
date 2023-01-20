import axios from 'axios';
import logo from './logo.svg';
import React, { useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css';
import { Button, StyleSheet, View } from 'react-native'
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
import AddCollabButton from "./components/AddCollabButton"
import XButton from "./components/XButton"
import { FC } from "react";
import { Drawer, Box, Stack } from '@mui/material';
import { set } from 'lodash';


function App() {
  const [addedCollab, setAddedCollab] = useState(false);
  const onAddCollabPress = () => setAddedCollab(true)
  const onXPress = () => {
    setAddedCollab(false);
    localStorage.setItem('secondClickedNode', null);
    setSecondClickedNode(null);
  }

  const [movieArr, setMovieArr] = useState([]);
  let movieItems = movieArr.map((movie) =>
    <li key={movie.toString()}>
      {movie}
    </li>
  );

  const graph = Graph.from(testJson);

  const SearchBarOne = () => {
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
    localStorage.setItem("clickedNode", selected);
    setClickedNode(selected);

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
    <div style={{ width: "85%", display: "flex", flexDirection: "row", alignItems: "center", marginLeft: "-65px" }}>
      <label htmlFor={inputId} style={{ display: "none" }}>
          Search a node
        </label>
        <input
          id={inputId}
          type="text"
          placeholder={localStorage.getItem('clickedNode') !== 'null' ? localStorage.getItem('clickedNode') : "Search for an actor or director"}
          list={`${inputId}-datalist`}
          value={search}
          onChange={onInputChange}
          style={{width: "100%",
            height: "2.4rem",
            background: "#f5f5f5",
            outline: "none",
            border: "none",
            borderRadius: "30px",
            padding: "0 3.5rem 0 1.5rem",
            fontSize: "1rem"}}
        />
        <button style={{ width: "3.5rem", height: "2.8rem", marginLeft: "-3.5rem", background: "none", border: "none", outline: "none"}} >
          <svg style={{width: "24px", height: "24px" }}viewBox="0 0 24 24"><path fill="#666666" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
          </svg>
        </button>
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

  const SearchBarTwo = () => {
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
    localStorage.setItem("secondClickedNode", selected);
    setSecondClickedNode(selected);

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
    <div style={{ width: "85%", display: "flex", flexDirection: "row", alignItems: "center", marginLeft: "-65px" }}>
      <label htmlFor={inputId} style={{ display: "none" }}>
          Search a node
        </label>
        <input
          id={inputId}
          type="text"
          placeholder={localStorage.getItem('secondClickedNode') !== 'null' ? localStorage.getItem('secondClickedNode') : "Search for a collaborator"}
          list={`${inputId}-datalist`}
          value={search}
          onChange={onInputChange}
          style={{width: "100%",
            height: "2.4rem",
            background: "#f5f5f5",
            outline: "none",
            border: "none",
            borderRadius: "30px",
            padding: "0 3.5rem 0 1.5rem",
            fontSize: "1rem"}}
        />
        <button style={{ width: "3.5rem", height: "2.8rem", marginLeft: "-3.5rem", background: "none", border: "none", outline: "none"}} >
          <svg style={{width: "24px", height: "24px" }}viewBox="0 0 24 24"><path fill="#666666" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
          </svg>
        </button>
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

  const [hoveredNode, setHoveredNode] = useState(null);
  const [secondHoveredNode, setSecondHoveredNode] = useState(null);
  const [clickedNode, setClickedNode] = useState(null);
  const [secondClickedNode, setSecondClickedNode] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showBioOne, setShowBioOne] = useState(false);
  const [showBioTwo, setShowBioTwo] = useState(false);

  const GraphEvents =  () => {
    const sigma = useSigma();
    const registerEvents = useRegisterEvents();
    const loadGraph = useLoadGraph();
    const setSettings = useSetSettings();

    useEffect(() => {
      // Register the events
      registerEvents({
        enterNode: event => {
          if (localStorage.getItem('secondClickedNode') === 'null') {
            if(localStorage.getItem('clickedNode') !== 'null'){
              if(event.node !== localStorage.getItem('clickedNode')){
                localStorage.setItem('secondHoveredNode', event.node);
                setSecondHoveredNode(event.node);
              }
            } 
            else{
              localStorage.setItem('hoveredNode', event.node);
              setHoveredNode(event.node);
            }
          }
          console.log("Enter");
          console.log("cN: " + localStorage.getItem('clickedNode') + " sCN: " + localStorage.getItem('secondClickedNode') + 
          " hN: " + localStorage.getItem('hoveredNode') + " sHN: " + localStorage.getItem('secondHoveredNode'));
        },
        
        leaveNode: event => {
          localStorage.setItem('hoveredNode', null);
          localStorage.setItem('secondHoveredNode', null);
          setHoveredNode(null);
          setSecondHoveredNode(null);
          console.log("Leave");
          console.log("cN: " + localStorage.getItem('clickedNode') + " sCN: " + localStorage.getItem('secondClickedNode') + 
          " hN: " + localStorage.getItem('hoveredNode') + " sHN: " + localStorage.getItem('secondHoveredNode'));
        },
        clickNode: event => {
          if(localStorage.getItem('clickedNode') === 'null') { 
            localStorage.setItem('clickedNode', event.node);
            setClickedNode(event.node);
            localStorage.setItem('hoveredNode', null);
            setHoveredNode(null);
          }
          else {
            if (localStorage.getItem('secondClickedNode') === event.node) {
              localStorage.setItem('secondClickedNode', null);
              setSecondClickedNode(null);
            }
            else if (localStorage.getItem('clickedNode') !== event.node) {
              localStorage.setItem('secondClickedNode', event.node);
              localStorage.setItem('secondHoveredNode', null);
              setSecondClickedNode(event.node);
              setSecondHoveredNode(null);
              setAddedCollab(true);
            }
          }
          console.log("Click");
          console.log("cN: " + localStorage.getItem('clickedNode') + " sCN: " + localStorage.getItem('secondClickedNode') + 
          " hN: " + localStorage.getItem('hoveredNode') + " sHN: " + localStorage.getItem('secondHoveredNode'));
        },
        clickStage: event => {
          localStorage.setItem('clickedNode', null);
          localStorage.setItem('hoveredNode', null);
          localStorage.setItem('secondClickedNode', null);
          localStorage.setItem('secondHoveredNode', null);
          setClickedNode(null);
          setHoveredNode(null);
          setSecondClickedNode(null);
          setSecondHoveredNode(null);
          setAddedCollab(false);
          console.log("Stage");
          console.log("cN: " + localStorage.getItem('clickedNode') + " sCN: " + localStorage.getItem('secondClickedNode') + 
          " hN: " + localStorage.getItem('hoveredNode') + " sHN: " + localStorage.getItem('secondHoveredNode'));
        }
      });
    }, [registerEvents]);

    useEffect(() => {
        setSettings({
          nodeReducer: (node, data) => {
            const graph = sigma.getGraph();
            const newData = { ...data, highlighted: data.highlighted || false };
            if (hoveredNode) {
              setShowWelcome(false);
              if (node === hoveredNode) {
                newData.highlighted = true;
              }
            }
            if (clickedNode) {
              if (node === clickedNode) {
                newData.highlighted = true;
              }
              if (node !== clickedNode && !graph.neighbors(node).includes(clickedNode)) {
                newData.color = "#E2E2E2";
              }
            }
            if (secondHoveredNode) {
              if (node === secondHoveredNode) {
                newData.highlighted = true;
              }
            }
            if (secondClickedNode) {
              if (node === secondClickedNode) {
                newData.highlighted = true;
              }
              /*if (node !== clickedNode && node !== secondClickedNode) {
                newData.color = "#E2E2E2";
              }*/
            }
            return newData;
          },
          edgeReducer: (edge, data) => {
            const graph = sigma.getGraph();
            const newData = { ...data, hidden: false };
    
            if (hoveredNode && !graph.extremities(edge).includes(hoveredNode)) {
              newData.hidden = true;
            }
            if (clickedNode && !graph.extremities(edge).includes(clickedNode)) {
              newData.hidden = true;
            }
            if (secondHoveredNode) {
              if (graph.extremities(edge).includes(clickedNode) && graph.extremities(edge).includes(secondHoveredNode)) {
                newData.color = "#000000";
                newData.size = 2.5;
              }
            }
            if (secondClickedNode) {
              if (graph.extremities(edge).includes(clickedNode) && graph.extremities(edge).includes(secondClickedNode)) {
                newData.color = "#000000";
                newData.size = 2.5;
              }
              else {
                newData.hidden = true;
              }
            }
            return newData;
          },
        });
        /*if (clickedNode !== 'null' && secondClickedNode !== 'null') {
          let tempMovieArr = [];
          for (let key in movieCollabGroups) {
            //console.log(key + ' has ' + movieCollabGroups[key])      
            //movie that is shared between clicked and second hovered is stored in key
            if(movieCollabGroups[key].includes(localStorage.getItem('clickedNode')) && movieCollabGroups[key].includes(localStorage.getItem('secondClickedNode'))){
              tempMovieArr.push(key);
              setMovieArr(tempMovieArr);
              //key is the movie that both the clickedNode actor and secondHoveredNode actor were in
              movieItems = movieArr;
              movieArr.map((movie) =>
                <li key={movie.toString()}>
                  {movie}
                </li>
              );
            }
          }
        }*/
    }, [hoveredNode, secondHoveredNode, clickedNode, secondClickedNode]);
  
    let movieCollabGroups = require('./movieCollabGroups.json');

    /*useEffect(() => {
     
    }, [secondHoveredNode]);*/

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
        <ControlsContainer style={{ backgroundColor: "#fff0", width: "350px", border: "0", marginLeft: "70px", marginTop: "6px"}} position={"top-left"}>
          <Stack spacing={1}>
            <SearchBarOne />
            {addedCollab && <Stack direction="row">
            <SearchBarTwo />
            <XButton onPress={onXPress} />
          </Stack>}
          {!addedCollab && <AddCollabButton onPress={onAddCollabPress} />}
          <div style={{ marginLeft: "", borderRadius: "20px", width: "50%", height: "280px", backgroundColor: "#969696"}}>
            <img style={{ borderRadius: "15px", marginLeft: "35px", marginTop: "19px", height: "125px", width: "100px" }} src="https://cdn.britannica.com/32/201632-050-66971649/actress-Margot-Robbie-Australian-2018.jpg"></img>
            <h3><center>Margot Robbiniapolis</center></h3>
            <p><center>Influence Rank: 23/10</center></p>
          </div>
          {addedCollab && <div style={{ marginLeft: "", borderRadius: "20px", width: "50%", height: "280px", backgroundColor: "#969696"}}>
            <img style={{ borderRadius: "15px", marginLeft: "35px", marginTop: "10px", height: "125px", width: "100px" }} src="https://cdn.britannica.com/32/201632-050-66971649/actress-Margot-Robbie-Australian-2018.jpg"></img>
            <h3><center>Margot Robbiniapolis</center></h3>
            <p><center>Influence Rank: 23/10</center></p>
            </div>}
          </Stack>
        </ControlsContainer>
      </SigmaContainer>
        <Drawer variant="permanent" hideBackdrop anchor = 'right' open>
          <Box
            sx={{ width: 300 }}
            role="presentation"   
          >
            <ul>
              {showWelcome && <h1 margin="10px">Welcome to Movie Collabs!</h1> }
              {movieItems}
            </ul>
          </Box>
        </Drawer>    
      </div>);
}

export default App;
