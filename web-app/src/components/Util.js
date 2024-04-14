import React from "react"; 
import uuid from "react-uuid";


export const prettifyMeetingInformation = (mi) => {
    //mi represents meeting information
    //mapping each meeting type to the values and displaying results nicely
    if (!mi) {
      return "Error occured";
    }
    const sections = ["lecture", "lab", "seminar", "exam"];
    let output = (
      <>
        {sections.map((value) => {
          return mi[value] && mi[value].time ? (
            <p key={uuid()}>
              {mi[value].day} {mi[value].time} {mi[value].place}
            </p>
          ) : null;
        })}
      </>
    );

    return output;
  };