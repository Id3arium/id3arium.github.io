import React, { useState, useEffect, useRef } from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { IconButton } from "@mui/material";
import styled from "styled-components";
import { useNodesStore, useNodesTimelineStore } from "../Store.js";
import { useSpring,animated } from "react-spring";

export default function NodeCard(props) {
    const [backSideVisible, setBackSideVisible] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    let nodeIDsTimeline = useNodesTimelineStore(state => state.nodeIDsTimeline)
    let currTimelineIdx = useNodesTimelineStore(state => state.currTimelineIdx)
    let currNodeID = useNodesTimelineStore(state => state.currNodeID)
    let isAtEndOfTimeline = useNodesStore(state => state.isAtEndOfTimeline)
    let nodes = useNodesStore(state => state.nodes)
    let nodeData = nodes[currNodeID]

    const [timerBarStyles, timerBarAnim] = useSpring(() => ({
        from: { opacity: .25 },
        to: { opacity: 1 },
        config:{duration: Math.max(50, nodes[currNodeID].charCount * props.timePerChar)},
        loop: true,
        onRest: (o)=>{console.log("onRest",nodes[currNodeID].charCount); props.onNext()},
    }))

	function handleClick(e){ 
        if (e.target.id === "node-card"){
            setBackSideVisible(!backSideVisible)
		}
	}

    const deleteNodeCard = () => {
        props.onDelete(nodeData.id);
    };

    useEffect(()=>{
        if (backSideVisible || isHovered){
            timerBarAnim.pause()
        } else {
            timerBarAnim.resume()
        }
    },[backSideVisible,isHovered])
    useEffect(()=>{
        //let timePerChar = props.timePerChar
        //let charCount = nodes[currNodeID].charCount
        //let duration =  Math.max(1000, charCount * timePerChar)
        //console.log("currNodeID",currNodeID, "charCount",charCount, "duration", duration)
        //timerBarAnim.start({ config:{
        //    duration:duration},
        //})
        
    },[currNodeID, nodes, props.timePerChar,timerBarAnim])
    
    return (
    <StyledNodeCard as={animated.div} id="node-card" style={timerBarStyles}
        onClick={handleClick}  
        onMouseEnter={()=>{setIsHovered(true)}} 
        onMouseLeave={()=>{setIsHovered(false)}}
    >
        <div className="card-controls" >
            <IconButton className="nav-btn top left outlined" 
                onClick={() => {props.onPrev()}}
            >
                <KeyboardArrowLeftIcon  />
            </IconButton>
            <IconButton className="nav-btn top right outlined" 
                onClick={() => {props.onNext()}}
            >
                <KeyboardArrowRightIcon disabled={true}/>
            </IconButton>
            {backSideVisible && <div>
                <IconButton className="nav-btn bottom left outlined" 
                    onClick={() => {props.onDecreaseNodeFreq(currNodeID)}}
                >
                    <ArrowDropDownIcon />
                </IconButton>
                <IconButton className="nav-btn bottom right outlined" 
                    onClick={() => {props.onIncreaseNodeFreq(currNodeID)}}
                >
                    <ArrowDropUpIcon />
                </IconButton>
            </div>}
        </div>
        
        <div className="card-content" >
            <StyledCardSide id="front-side" isVisible={!backSideVisible} isHovered={isHovered}>
                {nodeData.title && <h1 >{nodeData.title} </h1>}
                <p>{nodeData.content}</p> 
            </StyledCardSide>
            <StyledCardSide id="back-side" isVisible={backSideVisible} isHovered={isHovered}>
                <h1 > Node #{currNodeID+1} [{currTimelineIdx+1} / {nodeIDsTimeline.length}] </h1>
                <p>Inspiration: {nodeData.inspiration}  </p><br></br>
                <p className="frequency">
                    {(nodeData.frequency * 100).toFixed(1)}% Likely to appear
                </p>
            </StyledCardSide>
        </div>
        
    </StyledNodeCard>
    );
}

let StyledCardSide = styled.div`
  opacity: ${props => props.isVisible ? "1": ".15"};
  filter: ${props => props.isVisible ? "none": (props.isHovered ? "blur(3px)" : "blur(9px)") };
  transform: ${props => props.isVisible ? "scale(1, 1)": "scale(-1, 1)"};;
  padding: 10px 0px;
  grid-area: 1/1;
  pointer-events: none;
`

let StyledNodeCard = styled.div`
  background: #00219708;
  border-radius: 5px;
  box-shadow: 0px 0px 4px #ccc;
  padding: 20px 30px 30px;
  width: 525px;
  margin: 4px;
  position: relative;
  color: #EEE;
  backdrop-filter: blur(5px);
  background-color: #ffffff0C;

  :hover{
    background-color: #ffffff00;
  }

  .card-controls{
    display: none;
  }

  :hover > .card-controls {
    display: block;
    color: red;
  }

  .outlined:hover {
    outline: 1px solid #ffffff40;
  }
  
  .card-content{
    display: grid;
    align-items:center;
    pointer-events: none;
    height: auto;
  }

  .nav-btn {
	color: white;
    position: absolute;
    z-index: 1;
  }

  h1 {
    text-align: center;
    font-size: 1.2em;
    margin: 0px 15px 20px;
  }

  p {
    margin: auto;
    font-size: 1.1em;
  }

  .frequency {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -8px;
    font-size: .8em;
  }
  
  .left { left: 15px; }

  .right { right: 15px; }

  .top { top: 20px; }

  .bottom { bottom: 15px; }

`;
