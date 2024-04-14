import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./custom.css";
import Search from "./components/Search";
import Scheduler from "./components/Scheduler";
import { useState } from "react";
import CourseList from "./components/CourseList";
import SearchList from "./components/SearchList";
import ScheduleSelect from "./components/ScheduleSelect";
import ScheduleProvider from "./context/ScheduleContext";
//import { conflictingCourseSet } from "./test/snapshotTests/test.data";


// The wrapper function for all other functions in the package
function App() {
  //ATTENTION: The schedules state has moved to ScheduleProvider


  // structure of elements in the array
  // {
  //   title: 'schedule1',
  //   courses: [c1,c3,c3...]
  // }
  // The current state of selectedCourses is shared in all the functions to keep it updated
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchInput, setSearchInput] = useState({["term"]:"Fall 2022"});
  //const [searchResults, setSearchResults] = useState([...conflictingCourseSet]);

  return (
    <div className="app">
      <div id="header" className="flex-centering">
        <h1 id="header-text">University of Guelph Course Planner</h1>
      </div>
      <div className="content">
        <ScheduleProvider>
          <Search 
            setCurrentPage={setCurrentPage}
            setSearchResults={setSearchResults}
            searchResults={searchResults}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            setLoading={setLoading}
          />
          <SearchList
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
            searchInput={searchInput}
            loading={loading}
          />
          <ScheduleSelect
            setSearchInput={setSearchInput}
            searchInput={searchInput}
          />
          <Scheduler/>
          <CourseList/>
        </ScheduleProvider>

        <div className="footer">
          <p>Group 101 - CIS3760</p>
        </div>
      </div>
    </div>
  );
}

export default App;
