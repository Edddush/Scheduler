import React, { useContext } from "react";
import CourseTable from "./CourseTable";
import { ScheduleContext } from '../context/ScheduleContext';
import { addCourse } from "./ScheduleFunctions";
import Pagination from "./Pagination";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';


function SearchList({
  currentPage,
  setCurrentPage,
  searchResults,
  setSearchResults,
  searchInput,
  loading
}) {
  const columns = [
    { header: "Course Name", accessProperty: "course_name" },
    { header: "Subject", accessProperty: "subject" },
    { header: "Course Code", accessProperty: "course_code" },
    { header: "Section Number", accessProperty: "section_number" },
    { header: "Term", accessProperty: "term" },
    { header: "Meeting Information", accessProperty: "meeting_info_string" },
  ];

  const { setSchedules } = useContext(ScheduleContext);
  const limit = 10;

  const addCourseCallback = (row) => {
    addCourse(setSchedules, row);
    setSearchResults((prev) => prev.filter((value) => value.uid !== row.uid));
  };

  const callbackCol = {
    header: "Add Section",
    text: "Add Section",
    callback: addCourseCallback,
  };


  const lastIndex = currentPage * limit;
  const firstIndex = lastIndex - limit;
  const resultsPerPage = searchResults.slice(firstIndex, lastIndex);


  return (
    <div>
      <h3 id="course_header">Search Results</h3>
      <h6 id="course_header_term">Note: Search Results are for {searchInput.term}. To change terms, please Add a New Schedule below using the + button for that term.</h6>
      {
        loading ? (
          <>
            <h4>Loading...</h4>
            <Box sx={{ display: 'flex' }}>
              <CircularProgress />
            </Box>
          </>
        ) : null
      }
      {
        loading === false ? (
          <>
            <CourseTable
              columns={columns}
              callbackCol={callbackCol}
              data={resultsPerPage}
            />
            <Pagination
              currentPage={currentPage}
              max={searchResults.length}
              limit={limit}
              onPageClick={(page) => setCurrentPage(page)}
            />
          </>

        ) : null
      }
    </div>
  );
}

export default SearchList;
