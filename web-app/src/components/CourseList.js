import React, {useContext, useEffect} from "react";
import CourseTable from "./CourseTable";
import { ScheduleContext } from "../context/ScheduleContext";
import { removeCourse, getActiveSchedule } from "./ScheduleFunctions";

// function to keep track of the selected courses/sections and allows to remove these
function CourseList() {
  const columns = [
    { header: "Course Name", accessProperty: "course_name" },
    { header: "Subject", accessProperty: "subject" },
    { header: "Course Code", accessProperty: "course_code" },
    { header: "Section Number", accessProperty: "section_number" },
    { header: "Term", accessProperty: "term" },
    { header: "Meeting Information", accessProperty: "meeting_info_string" },
  ];

  const {schedules, setSchedules} = useContext(ScheduleContext);

  let selectedSchedule = getActiveSchedule(schedules);

  useEffect(() => {
    selectedSchedule = getActiveSchedule(schedules);
  }, [schedules]);

  const callbackCol = {
    header: "Remove Section",
    text: "Unschedule",
    callback: (row) => {
      removeCourse(setSchedules, row.uid);
    },
  };

  return (
    <div>
      <h3 id="course_header">Courses Selected</h3>
      <div className="courses-selected-table">
        <CourseTable
          columns={columns}
          callbackCol={callbackCol}
          data={selectedSchedule.courses}
        />
      </div>      
    </div>
  );
}

export default CourseList;
