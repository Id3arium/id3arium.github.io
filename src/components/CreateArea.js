import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import _ from "lodash";
import styled from "@emotion/styled";

function CreateArea(props) {
  const [note, setNote] = useState({ title: "", content: "" });
  const [isExpanded, setIsExpanded] = useState(false);
  function handleChange(e) {
    const { name, value } = e.target;
    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value
      };
    });
  }
  function submitNote(e) {
    e.preventDefault();
    let emptyNote = { title: "", content: "" };
    if (!_.isEqual(note, emptyNote)) {
      props.onAdd(note);
      setNote(emptyNote);
    }
  }
  function expandArea() {
    setIsExpanded(true);
  }
  return (
    <StyledCreateArea id='create-area'>
      <form className="create-note">
        {isExpanded && (
          <input
            name="title"
            placeholder="Title"
            value={note.title}
            onChange={handleChange}
          />
        )}

        <textarea
          name="content"
          placeholder="Take a note..."
          rows={isExpanded ? "4" : "1"}
          value={note.content}
          onChange={handleChange}
          onFocus={expandArea}
        />
        <Zoom in={isExpanded}>
          <Fab onClick={submitNote}>
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </StyledCreateArea>
  );
}

let StyledCreateArea = styled.div`
  float: left;
  
  form.create-note {
    width: 300px;
    margin: 30px 0 20px 0;
    background: #fcfcfc;
    padding: 15px;
    border-radius: 7px;
    box-shadow: 0 1px 5px rgb(138, 137, 137);
  }
  form.create-note input,
  form.create-note textarea {
    background-color: #fcfcfc;
    width: 100%;
    border: none;
    padding: 4px;
    outline: none;
    font-size: 1.2em;
    font-family: inherit;
    resize: none;
  }
  form.create-note button {
    position: absolute;
    right: 12px;
    bottom: -18px;
    background: #1313f588;
    backdrop-filter: blur(5px);
    color: #fff;
    border: 1px solid black;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    outline: none;
  }

`

export default CreateArea;