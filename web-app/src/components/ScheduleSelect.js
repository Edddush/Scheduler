import React, { useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import EditModal from "./EditModal";
import { setActiveSchedule } from "./ScheduleFunctions";
import { ScheduleContext } from '../context/ScheduleContext';


function ScheduleSelect({setSearchInput, searchInput}) {
  const [showModal, setShowModal] = useState(false);
  const [isNewSchedule, setIsNewSchedule] = useState(false);
  const [isUploadedSchedule, setIsUploadedSchedule] = useState(false);
  const {schedules, setSchedules} = useContext(ScheduleContext);


  return (
    <div id = "multiple-schedules-buttons">
      <div id="schedules-button-group">
      {schedules.map((schedule) => (
        <Button
          title={schedule.term}
          style={{borderColor: schedule.borderColour, borderWidth: "5px"}}
          key={schedule.title}
          className="schedule-button"
          variant={schedule.selected ? "primary" : "dark"}
          size="sm"
          onClick={() => {
            setActiveSchedule(setSchedules, schedule.title, schedule.term);
            setSearchInput((prev) => {
              return {
                ...prev,
                ["term"]: schedule.term,
              };
            });
          }}
        >
          {schedule.title}
        </Button>
      ))}
      </div>
      <h6 id ="schedule-select-term">{searchInput.term}</h6>
      <div id="modify-schedule-button-group">
        
        <Button
          title="Upload a Schedule"
          className='modify-schedule-button'
          variant="primary"
          size="lg"
          onClick={() => {
            setIsNewSchedule(true);
            setShowModal(true);
            setIsUploadedSchedule(true);
          }}
        >
          <div id="upload-button">
          ↥
          </div>
        </Button>

        <Button
          title="Edit a Current Schedule"
          className='modify-schedule-button'
          variant="primary"
          size="lg"
          onClick={() => {
            setIsNewSchedule(false);
            setShowModal(true);
            setIsUploadedSchedule(false);
          }}
        >
          <div id="icon-center">
          ✎
          </div>
        </Button>
        <Button
          title="Add a New Schedule"
          className='modify-schedule-button'
          variant="primary"
          size="lg"
          disabled={schedules.length >= 5}
          onClick={() => {
            if(schedules.length < 5){
              setIsNewSchedule(true);
              setShowModal(true);
              setIsUploadedSchedule(false);
            }
          }}
        >
          +
        </Button>
        <EditModal
          showModal={showModal}
          setShowModal={setShowModal}
          isNewSchedule={isNewSchedule}
          setIsNewSchedule={setIsNewSchedule}
          isUploadedSchedule={isUploadedSchedule}
          setIsUploadedSchedule={setIsUploadedSchedule}
          setSearchInput={setSearchInput}
        />
      </div>
    </div>
  );
}

export default ScheduleSelect;
