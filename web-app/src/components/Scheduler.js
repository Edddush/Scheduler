import React from "react";
import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { getActiveSchedule, removeCourse } from "./ScheduleFunctions";
import { ScheduleContext } from "../context/ScheduleContext";
import { ViewState } from "@devexpress/dx-react-scheduler";
import uuid from "react-uuid";
import {
  Scheduler,
  WeekView,
  Appointments,
  Resources,
  AppointmentTooltip
} from "@devexpress/dx-react-scheduler-material-ui";
import { red } from "@mui/material/colors";
import { TooltipLayout, TooltipContentProps } from "./Tooltip";

// change the time to 24h-format (e.g. 19h)
export const convertTo24Hour = (time) => {
  /*Collected from https://stackoverflow.com/a/17555888*/
  let hours = parseInt(time.substr(0, 2));
  if (time.indexOf("AM") !== -1 && hours === 12) {
    time = time.replace("12", "0");
  }
  if (time.indexOf("PM") !== -1 && hours < 12) {
    time = time.replace(time.substr(0, 2), hours + 12);
  }
  return time.replace(/(AM|PM)/, "");
};
export default SchedulerComp;

// inefficient for big data. Here data will be small though!
export const checkConflicts = (tempScheduleData, tempCourseTitles) => {
  let courseTitleIndex;
  tempScheduleData.forEach((appt1, i) => {
    tempScheduleData.forEach((appt2, j) => {
      if (i !== j) {
        if (
          Math.max(appt1.startDate, appt2.startDate) <=
          Math.min(appt1.endDate, appt2.endDate)
        ) {
          // if we find a conflict, change the color for those two courses to be red
          if (!appt1.course.includes("CONFLICT")) {
            courseTitleIndex = tempCourseTitles.findIndex(
              (ele) => ele.id === appt1.course[0]
            );
            tempCourseTitles[courseTitleIndex].color = red;
          }
          if (!appt2.course.includes("CONFLICT")) {
            courseTitleIndex = tempCourseTitles.findIndex(
              (ele) => ele.id === appt2.course[0]
            );
            tempCourseTitles[courseTitleIndex].color = red;
          }
        }
      }
    });
  });
};

// create a time block/appointment that will be displayed on the schedule board
export const createAppointment = (meetingBlock, courseObject) => {
  const weekdayToDay = {
    Mon: 7,
    Tues: 8,
    Wed: 9,
    Thur: 10,
    Fri: 11,
  };

  let { section_name_and_title, course_name, ...rest } = courseObject;

  // parse the times
  let sections = meetingBlock.day.split(" ").slice(1);
  let section = meetingBlock.day.split(" ")[0];
  let times = meetingBlock.time.replaceAll(" ", "").split("-");
  let returnObj = [];

  // change the time format for each meeting type to the correct date-time format of the scheduler component
  for (let day of sections) {
    day = day.replaceAll(",", "");
    // console.log(`2022-11-${weekdayToDay[day]} ${convertTo24Hour(times[0])}`)
    returnObj.push({
      course: [section_name_and_title],
      startDate: Date.parse(
        `2022-11-${weekdayToDay[day]} ${convertTo24Hour(times[0])}`,
        "YYYY-MM-DD hh:mm:ss"
      ),
      endDate: Date.parse(
        `2022-11-${weekdayToDay[day]} ${convertTo24Hour(times[1])}`,
        "YYYY-MM-DD hh:mm:ss"
      ),
      title: section + " " + course_name,
      id: uuid(),
      ...rest,
    });
  }
  return returnObj;
};

export const createScheduleData = (
  tempScheduleData,
  tempCourseTitles,
  selectedCourses
) => {

  // adding each course to the schedule board
  for (const course of selectedCourses) {
    let addedSomethingToSchedule = false;
    if (course.meeting_information) {
      const { lecture, lab, seminar } = course.meeting_information;
      for (const timeblock of [lecture, lab, seminar]) {
        if (timeblock.day && !timeblock.day.includes("TBA")) { //check if the lecture, lab, or seminar blocks contain actual times
          addedSomethingToSchedule = true;
          tempScheduleData.push(
            ...createAppointment(
              timeblock,
              course
            )
          );
        }
      }

      // add our title object, this links the courses together via a color
      if (addedSomethingToSchedule) {
        tempCourseTitles.push({
          text: course.section_name_and_title,
          id: course.section_name_and_title,
          color: course.colour,
        });
      }
    }
  }
};

const currentDate = "2022-11-07";

// function to update the board with the current selected courses
function SchedulerComp() {
  const [scheduleData, setScheduleData] = useState([]);
  const [courseTitles, setCourseTitles] = useState([]);
  const [tooltipVisible, setTooltipVisibility] = useState(false);
  const [appointmentMeta, setAppointmentMeta] = useState({
    target: null,
    data: {}
  });
  const calRef = useRef();
  const { schedules, setSchedules } = useContext(ScheduleContext);


  const resources = [
    {
      fieldName: "course",
      title: "Courses",
      instances: courseTitles,
      allowMultiple: true,
    },
  ];




  const Appointment = useCallback(
    ({ onClick, data, ...restProps }) => { // eslint-disable-line no-unused-vars
      return (
        <Appointments.Appointment
          data={data}
          onDoubleClick={() => {
            setTooltipVisibility(false);
            removeCourse(setSchedules, data.uid)
          }}
          {...restProps}
          onMouseEnter={({ target }) => {
            setAppointmentMeta({ target, data });
            setTooltipVisibility(true);
          }}
          onMouseLeave={() => {
            setTooltipVisibility(false);
          }}
        />
      );
    },
    [setTooltipVisibility, setAppointmentMeta]
  );

  let selectedSchedule = getActiveSchedule(schedules).courses;

  useEffect(() => {
    const tempCourseTitles = [];
    const tempScheduleData = [];
    selectedSchedule = getActiveSchedule(schedules).courses;


    createScheduleData(tempScheduleData, tempCourseTitles, selectedSchedule);
    checkConflicts(tempScheduleData, tempCourseTitles);
    setScheduleData(tempScheduleData);
    setCourseTitles(tempCourseTitles);
    calRef.current.focus({
      preventScroll: true
    });
  }, [createAppointment, schedules]);




  // returning the component
  return (
    <div id="Scheduler" className="flex-centering" ref={calRef} tabIndex={0}>
      <div id="Scheduler-inner">
        <Scheduler data={scheduleData}>
          <ViewState currentDate={currentDate} />
          <WeekView
            excludedDays={[0, 6]}
            startDayHour={8.5}
            endDayHour={22}
            cellDuration={60}
          />
          <Appointments appointmentComponent={Appointment} />
          <AppointmentTooltip
            visible={tooltipVisible}
            onVisibilityChange={setTooltipVisibility}
            appointmentMeta={appointmentMeta}
            onAppointmentMetaChange={setAppointmentMeta}
            layoutComponent={TooltipLayout}
            contentComponent={TooltipContentProps}
          />
          <Resources data={resources} mainResourceName={"course"} />
        </Scheduler>
      </div>
    </div>
  );
}
