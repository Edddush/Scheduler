/*eslint no-useless-escape: 0*/
import React, { useState, useEffect } from "react";
import { prettifyMeetingInformation } from "./Util";

//Search functionality
function Search({ setCurrentPage,
  setSearchResults,
  searchResults,
  searchInput,
  setSearchInput,
  setLoading
}) {
  //Initializing states
  const [errorMessage, setErrorMessage] = useState("");

  // detect if given string is empty, undefined of blank
  function blank(input) {
    if (typeof input === 'undefined') {
      return true;
    }

    return /^\s*$/.test(input);
  }

  useEffect(() => {
    setLoading(true);

    //Making a post request to flask
    (async () => {
      let valid_title = searchInput["courseTitle"];
      let course = searchInput["courseCode"];
      let dept = searchInput["subject"];

      if (blank(course) && blank(valid_title) && blank(dept)) {
        setLoading(false);
        setSearchResults([]);
        setErrorMessage("");
        return;
      }

      //fetching the search results from flask
      let result = await fetch(
        "api/courseSearch?" + new URLSearchParams(searchInput),
        {
          headers: {
            accepts: "application/json",
          },
        }
      );

      //catch the error if it occurred in flask
      if (result.status === 404) {
        setSearchResults([]);
        setErrorMessage("");
        setLoading(false);
        return;
      }

      //Format the return from flask
      result = await result.json();

      //Creating a row to display for each course/section in results
      let rows = [];
      if (result) {
        for (const course of result) {
          rows.push({
            ...course,
            meeting_info_string: prettifyMeetingInformation(
              course.meeting_information
            ),
          });
        }

        setSearchResults(rows);
        setErrorMessage("");
      } else {
        setErrorMessage("Error Occured During Search!");
      }
      setLoading(false);
    })();

    return;
  }, [searchInput]);
  /*   
    define behavior when input is changed
    update searchResults and reset pagination 
  */
  const handleChange = (e) => {
    const result = searchResults.filter(section => {
      (section.toString().toLowerCase().indexOf(e.target.value.toLowerCase())) > -1
    });

    setSearchInput((prev) => {
      return {
        ...prev,
        [e.target.id]: e.target.value,
      };
    });

    setCurrentPage(1);
    setSearchResults(result);
  };

  // delay callback by a given amount of time to allow full input 
  function debounce(callBack, delay = 500) {
    let timer = 0;

    return (...args) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        callBack(...args)
      },
        delay
      )
    }
  }

  //Called when input changes
  const debounceChange = debounce(handleChange);

  const inputIds = [
    { id: "courseTitle", placeholder: "Enter a Course" },
    { id: "subject", placeholder: "Enter a Subject Code" },
    { id: "courseCode", placeholder: "Enter a Course Code" }];

  //Returning the component
  return (
    <div className="card-body" id="search">
      <div id="search-input-group">
        {inputIds.map(({ id, placeholder }) => (
          <input
            key={id}
            id={id}
            type="text"
            className="search-box"
            placeholder={placeholder}
            onChange={debounceChange}
          />
        ))}
        { }
      </div>
      <h4>{errorMessage}</h4>
    </div>
  );
}

export default Search;
