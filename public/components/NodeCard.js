'use client';
import React, { useEffect, useMemo, useRef, useState, useCallback} from "react";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { IconButton } from "@mui/material";
import styled from "styled-components";
import { motion, useAnimation } from "framer-motion";
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import * as Atoms from '@/lib/utils/atoms.js';
import { useHotkeys } from "react-hotkeys-hook";
import { HotKeys } from 'react-hotkeys'
import { PositionedComponent } from "./PositionedComponent.js";
import useRandomNode from '@/lib/hooks/useRandomNode.js';
import _ from 'lodash'

const isHoveredAtom = atom(false)
const isFlippedAtom = atom(false)

export default function NodeCard() {
    const wordsPerMinute = 30
    const getRandomNode = useRandomNode();

    const [duration, setDuration] = useState(0);
    const [isHovered, setIsHovered] = useAtom(isHoveredAtom)
    const [isFlipped, setIsFlipped] = useAtom(isFlippedAtom)

    const currentNode = useAtomValue(Atoms.currentNodeAtom)
    const currentTimelineIndex = useAtomValue(Atoms.currentTimelineIndexAtom)
    const nodeIDsTimelineLength = useAtomValue(Atoms.nodeTimelineLengthAtom)

    const onNextNodeCard = useSetAtom(Atoms.onNextNodeAtom)
    const onPrevNodeCard = useSetAtom(Atoms.onPrevNodeAtom)

    const removeNode = useSetAtom(Atoms.removeNodeAtom)
    const resetNodeFrequencies = useSetAtom(Atoms.resetNodeFrequenciesAtom)

    const upDistributeFrequency = useSetAtom(Atoms.upDistributeFrequencyAtom)
    const downDistributeFrequency = useSetAtom(Atoms.downDistributeFrequencyAtom)

    const timerAnimation = useAnimation()
    const initialStyles = {
        opacity: .15,
        width: "525px",
    }    
    const targetStyles = useMemo(() => ({
        opacity: .2,
        width: "0px",
        transition: {
            duration: Math.max(5, duration),
            ease: "linear"
        }
    }), [duration]);

    const getCurrentNodeCardDuration = useCallback((wordsPerMinute = 60) => {
        let minTime = 3
        if (currentNode == null) { return 0 }
        const wordCount = currentNode?.title.split(' ').length + currentNode?.content.split(' ').length
        const nonSpaceCharCount = currentNode?.title.length + currentNode?.content.length - (wordCount - 1)
        const wordCharCount = nonSpaceCharCount / wordCount

        const averageWordCharCount = 5.1
        let readingTimeScaler = wordCharCount / averageWordCharCount
        const readingSpeedInMinutes = readingTimeScaler * wordCount * wordsPerMinute
        const readingSpeedInSeconds = readingSpeedInMinutes / 60
        // console.log("getCurrentNodeCardDuration readingSpeedInSeconds", readingSpeedInSeconds )
        return _.round(Math.max(readingSpeedInSeconds, minTime), 2)
    }, [currentNode]);

    useEffect(() => {
        if (isFlipped || isHovered) {
            timerAnimation.stop()
        } else {
            timerAnimation.start(targetStyles)
        }
    }, [isFlipped, isHovered, timerAnimation, targetStyles])

    useEffect(() => {
        let currCardDuration = getCurrentNodeCardDuration(wordsPerMinute)
        setDuration(currCardDuration);
        console.log("NodeCard nodeID", currentNode?.id, "duration:", currCardDuration, "timleine idx:", currentTimelineIndex)
    }, [currentNode, currentTimelineIndex, getCurrentNodeCardDuration]);
 
    const handleClick = (e) => { if (e.target.id == "node-card") { flipNodeCardOver() } }
    
    const rotationAnimation = useAnimation()
    function flipNodeCardOver() {
        const halfRotationDuration = .125
        rotationAnimation.start({
            rotateY: 90,
            transition: { duration: halfRotationDuration },
            ease: "easeOut"
        }).then(() => {
            setIsFlipped(!isFlipped);
            rotationAnimation.start({
                rotateY: 0,
                transition: { duration: halfRotationDuration },
                ease: "easeIn"
            });
        });
    }

    function restartTimerAnimation() {
        console.log("NodeCard.restartTimerAnimation()")
        timerAnimation.stop()
        timerAnimation.set(initialStyles)
        timerAnimation.start(targetStyles)
    }

    function onNextCardCliked() {
        console.log("NodeCard.onNextCardCliked()")
        if (currentNode == null) { return }
        let randNode;
        do {
            randNode = getRandomNode();
        } while (currentNode && randNode.id === currentNode.id);

        onNextNodeCard(randNode)
        restartTimerAnimation()
    }

    function onPrevCardClicked() {
        console.log("NodeCard.onPrevCardClicked()")
        onPrevNodeCard()
        restartTimerAnimation()
    }

    let CardControls = () =>
        <div className="card-controls" >
            <IconButton className="nav-btn top left outlined"
                onClick={() => { onPrevCardClicked() }}
            >
                <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton className="nav-btn top right outlined"
                onClick={ () => { onNextCardCliked() }}
            >
                <KeyboardArrowRightIcon disabled={true} />
            </IconButton>
            {isFlipped && <div>
                <IconButton className="nav-btn bottom left outlined"
                    onClick={() => {
                        downDistributeFrequency(currentNode.id)
                    }}
                >
                    <ArrowDropDownIcon />
                </IconButton>
                <IconButton className="nav-btn bottom right outlined"
                    onClick={() => {
                        upDistributeFrequency(currentNode.id)
                    }}
                >
                    <ArrowDropUpIcon />
                </IconButton>
            </div>}
        </div>

    let CardContent =() =>
        <div className="card-content" >
            <StyledCardSide id="front-side" $isVisible={!isFlipped} $isHovered={isHovered}>
                {currentNode?.title && <h1 >{currentNode?.title} </h1>}
                <p style={{ whiteSpace: "pre-line" }}>
                    {currentNode?.content}
                </p>

            </StyledCardSide>
            <StyledCardSide id="back-side" $isVisible={isFlipped} $isHovered={isHovered}>
                <h1> Node [{currentTimelineIndex + 1} / {nodeIDsTimelineLength}] </h1>
                <p> - {currentNode?.inspiration}  </p><br></br>
                <p className="frequency">
                    {(currentNode?.frequency * 100).toFixed(2)}% Likely to appear
                </p>
            </StyledCardSide>
        </div>

    const nodeCardKeyMap = {
        flip: 'ctrl+f',
        prev: ['left'],
        next: ['right'],
        reset: 'ctrl+r',
        delete: 'ctrl+d',
    }
    const nodeCardHandlers = {
        'flip': (e) => {e.preventDefault(); flipNodeCardOver()},
        'prev': (e) => {e.preventDefault(); onPrevCardClicked()},
        'next': (e) => {e.preventDefault(); onNextCardCliked()} ,
        'reset': (e) => {e.preventDefault(); resetNodeFrequencies()},
        'delete': async (e) => {e.preventDefault(); await removeNode(currentNode.id)},
    }
    return (
        <HotKeys keyMap={nodeCardKeyMap} handlers={nodeCardHandlers} focused="true">
            <PositionedComponent
                id="positioned-component"
                position="middle-center">
                <StyledMotionNodeCard
                    id="node-card" $isHovered={isHovered} tabIndex='-1'
                    onClick={e => { handleClick(e)} }
                    onMouseEnter={() => { setIsHovered(true) }}
                    onMouseLeave={() => { setIsHovered(false) }}
                    animate={rotationAnimation}
                >
                    <StyledMotionTimerBar className="timer-bar"
                        $isVisible={!isFlipped}
                        $isHovered={isHovered}
                        animate={timerAnimation}
                        initial={initialStyles}
                        onUpdate={ (animationDef) => { 
                            if (animationDef.width == "0px"){
                                console.log("animationDef", animationDef)
                                onNextCardCliked() 
                            }
                        }}
                    />
                    {CardControls}
                    {CardContent}
                </StyledMotionNodeCard>
            </PositionedComponent>
        </HotKeys>
    );
}

const StyledMotionTimerBar = styled(motion.div)`
    width: 100%;
    opacity: .15;
    position: absolute;
    border-radius: 2px;
    filter: ${props => props.$isVisible ? "none" : (props.$isHovered ? "blur(3px)" : "blur(9px)")};
    pointer-events: none;
    height: 3px;
    margin: 0 auto;
    background-color: white;

    top: 100%; 
    left: 50%; 
    transform: translate(-50%, -3px); 
    transform-origin: center center;
`

const StyledCardSide = styled.div`
    opacity: ${props => props.$isVisible ? "1" : ".15"};
    filter: ${props => props.$isVisible ? "none" : (props.$isHovered ? "blur(3px)" : "blur(9px)")};
    transform: ${props => props.$isVisible ? "scale(1, 1)" : "scale(-1, 1)"};
    padding: 10px 0px;
    grid-area: 1/1;
    pointer-events: none;
`

const StyledMotionNodeCard = styled(motion.div)`
    background: #00219708;
    border-radius: 5px;
    box-shadow: 0px 0px 4px #CCC;
    padding: 20px 30px 30px;
    width: 525px;
    margin: 4px;
    position: relative;
    color: #EEE;
    backdrop-filter: ${props => props.$isHovered ? "blur(4px)" : "blur(15px)"};
    background-color: #22222260;
    overflow: visible;

    :hover{
        background-color: #22222230;
    }

    .card-controls{
        display: none;
    }

    :hover > .card-controls {
        display: block;
    }

    .outlined:hover {
        outline: 1px solid #ffffff80;
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
        font-size: 1.15em;
    }

    .frequency {
        position: absolute;
        left: 0;
        right: 0;
        bottom: -8px;
        font-size: .8em;
    }
    
    .left { left: 10px; }

    .right { right: 10px; }

    .top { top: 10px; }

    .bottom { bottom: 10px; }
`;


