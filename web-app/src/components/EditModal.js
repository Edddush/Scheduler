import React, { useEffect, useState, useContext } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { CirclePicker } from 'react-color';
import {
  getActiveSchedule,
  clearActiveSchedule,
  addSchedule,
  deleteActiveSchedule,
  changeActiveScheduleName,
  changeScheduleColor
} from "./ScheduleFunctions";
import { ScheduleContext } from "../context/ScheduleContext";
import { prettifyMeetingInformation } from "./Util";

function EditModal({
  showModal,
  setShowModal,
  isNewSchedule,
  setIsNewSchedule,
  isUploadedSchedule,
  setIsUploadedSchedule,
  setSearchInput
}) {
  const { schedules, setSchedules } = useContext(ScheduleContext);
  let selectedSchedule = getActiveSchedule(schedules);
  let scheduleColor = "";
  useEffect(() => {
    selectedSchedule = getActiveSchedule(schedules);
  }, [schedules]);

  const [termSelection, setTermSelection] = useState(
    isNewSchedule ? "Fall 2022" : selectedSchedule.term
  );

  const setInitialStates = () => {
    setScheduleName(isNewSchedule ? "" : selectedSchedule.title);
    setTermSelection(isNewSchedule ? "Fall 2022" : selectedSchedule.term);
    setError("");
    setIsChecked(false);
  };

  const isScheduleNameUnique = (scheduleArrayToCheck) => {
    return scheduleArrayToCheck.every(
      (schedule) => schedule.title !== scheduleName
    );
  };


  const onSave = () => {
    changeActiveScheduleName(setSchedules,
      scheduleName,
      () => { setShowModal(false) }, //function to cal on success
      () => { setError("Schedule name must be unique and non empty with at most 64 characters.") }) //function to call on failure
    //setActiveSchedule(setSchedules, scheduleName); //disabled, we don't need to set active schedule since we are changing name only
    changeScheduleColor(setSchedules,
      scheduleColor,
      () => { setShowModal(false) })
  };

  const onCreateSchedule = () => {
    // need a unique schedule title
    if (
      !isScheduleNameUnique([...schedules]) ||
      scheduleName == "" ||
      scheduleName.length > 64
    ) {
      setError(
        "Schedule name must be unique and non empty with at most 64 characters."
      );
      return;
    } else {
      if (!isChecked && termSelection === selectedSchedule.term) {
        addSchedule(setSchedules, scheduleName, termSelection, selectedSchedule);
      } else {
        addSchedule(setSchedules, scheduleName, termSelection);
      }
      setSearchInput((prev) => {
        return {
          ...prev,
          ["term"]: termSelection,
        };
      });
      setIsNewSchedule(false);
      setIsUploadedSchedule(false);
      setShowModal(false);
      console.log(isUploadedSchedule);
    }
  };

  const onClearSchedule = () => {
    clearActiveSchedule(setSchedules);
    setShowModal(false);
  };

  const onDeleteSchedule = () => {
    deleteActiveSchedule(setSchedules);
    setShowModal(false);
  };

  const onDownloadSchedule = () => {
    const downloadSchedule = JSON.parse(JSON.stringify(selectedSchedule));
    downloadSchedule.courses = downloadSchedule.courses.map(a => {
      delete a.meeting_info_string;
      return a;
    })
    //downloadSchedule.colours = downloadSchedule.colours.map(a => ({a}));
    const coursesSelected = JSON.stringify(downloadSchedule);
    const blob = new Blob([coursesSelected], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    let fileName = scheduleName.trim() + ".json";
    fileName = fileName.replace(/ +/g, "");
    link.download = fileName;
    link.href = url;
    link.click();
  };

  const [selectedFile, setSelectedFile] = useState();
  const [isFileChosen, setIsFileChosen] = useState(false);

  const fileSelector = (event) => {
    console.log(isFileChosen);
    const uploaded = event.target.files[0];
    console.log(uploaded.type);
    if (uploaded.type === "application/json") {
      console.log("valid file");
      setSelectedFile(event.target.files[0]);
      setIsFileChosen(true);
    } else {
      console.log("invalid file");
      alert("Invalid File Format. Please upload a JSON file");
      setIsFileChosen(false);
      setShowModal(false);
    }
  };

  const [files, setFiles] = useState("");

  const onUploadSchedule = () => {
    if (
      !isScheduleNameUnique([...schedules]) ||
      scheduleName == "" ||
      scheduleName.length > 64
    ) {
      setError(
        "Schedule name must be unique and non empty with at most 64 characters."
      );
      return;
    }

    if(isFileChosen === false){
      setError("Please select a valid file to upload.");
    }

    console.log(files);
    const fileReader = new FileReader();
    fileReader.readAsText(selectedFile, "UTF-8");
    fileReader.onload = (e) => {
      setFiles(e.target.result);
      const obj = JSON.parse(e.target.result);
      obj.courses = obj.courses.map(c => {
        c.meeting_info_string = prettifyMeetingInformation(c.meeting_information)
        return c;
      })
      addSchedule(setSchedules, scheduleName, obj.term, selectedSchedule = {colours: [...obj.colours], courses: obj.courses});
    };
    setShowModal(false);
    setIsUploadedSchedule(true);
  };

  const [scheduleName, setScheduleName] = useState(
    isNewSchedule ? "" : selectedSchedule.title
  );

  const [error, setError] = useState("");

  useEffect(() => {
    setInitialStates();
  }, [showModal]);

  const [isChecked, setIsChecked] = useState(false);

  const handleEmptyToggle = (/* event */) => {
    setIsChecked((current) => !current);
  };


  const handleChangeComplete = (color) => {
    scheduleColor = color.hex
  }

  return (
    <Modal show={showModal}>
      {isNewSchedule === true && isUploadedSchedule === false ? (
        <Modal.Header id="modal-header">
          <Modal.Title>Add a New Schedule</Modal.Title>
        </Modal.Header>
      ) : isNewSchedule === true && isUploadedSchedule === true ? (
        <Modal.Header id="modal-header">
          <Modal.Title>Upload a Schedule</Modal.Title>
        </Modal.Header>
      ) : (
        <Modal.Header id="modal-header">
          <Modal.Title>Edit Current Schedule</Modal.Title>
        </Modal.Header>
      )}

      <Modal.Body>
        <InputGroup className="mb-3">
          <div className="form-group">
            {isNewSchedule ? (
              <Form.Label className="modal-subsection-headers">
                Schedule Name
              </Form.Label>
            ) : (
              <Form.Label className="modal-subsection-headers">
                Rename Schedule Name
              </Form.Label>
            )}

            <Form.Control
              value={scheduleName}
              onChange={(e) => setScheduleName(e.target.value)}
              type="text"
              placeholder="Please Input a Unique Schedule Name"
              className="schedule-name-input"
            />
          </div>
        </InputGroup>

        {isNewSchedule === true && isUploadedSchedule === false && (
          <div className="form-group">
            <Form>
              <Form.Label
                className="modal-subsection-headers"
                htmlFor="cleared-schedule-switch"
              >
                Create an Empty Schedule
              </Form.Label>
              <Form.Check
                type="switch"
                value={isChecked}
                onChange={handleEmptyToggle}
                className="cleared-schedule-switch"
              />
            </Form>
          </div>
        )}

        {isNewSchedule === true && isUploadedSchedule === true && (
          <div className="form-group">
            <Form.Label
              className="modal-subsection-headers"
              htmlFor="cleared-schedule-switch"
            >
              Upload a Schedule
            </Form.Label>
            <p>Upload a valid JSON file to create a schedule!</p>
            <div>
              <input
                type="file"
                name="file"
                onChange={fileSelector}
                accept=".json"
              />
            </div>
          </div>
        )}

        {error != "" && <p>{`ERROR: ${error}`}</p>}

        {isNewSchedule && !isUploadedSchedule? (
          <FormControl>
            <Form.Label id="demo-row-radio-buttons-group-label" className="modal-subsection-headers">Semester</Form.Label>
            <RadioGroup
              row
              aria-labelledby="demo-row-radio-buttons-group-label"
              name="row-radio-buttons-group"
              value={termSelection}
              onChange={(e) => setTermSelection(e.target.value)}
            >
              <FormControlLabel value = "Fall 2022" control={<Radio />} label = "Fall 2022" />
              <FormControlLabel value = "Winter 2023" control={<Radio />} label = "Winter 2023" />
            </RadioGroup>
          </FormControl>
        ) : (
            !isUploadedSchedule && (<Form.Label className="modal-subsection-headers">Semester: {selectedSchedule.term}</Form.Label>)
        )}


        {isNewSchedule ? (null) :
          <div>
            <Form.Label className="modal-subsection-headers">
              Choose Schedule Color
            </Form.Label>
            <CirclePicker onChangeComplete={handleChangeComplete} />
          </div>
        }


      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setInitialStates();
            setShowModal(false);
            setIsNewSchedule(false);
            setIsFileChosen(false);
          }}
        >
          Close
        </Button>

        {isNewSchedule === true && isUploadedSchedule === false ? (
          <Button variant="primary" onClick={onCreateSchedule}>
            Create
          </Button>
        ) : isNewSchedule === true && isUploadedSchedule === true ? (
          <Button variant="primary" onClick={onUploadSchedule}>
            Upload
          </Button>
        ) : (
          [
            <Button key={0} variant="warning" onClick={onClearSchedule}>
              Clear
            </Button>,
            <Button key={1} variant="danger" onClick={onDeleteSchedule}>
              Delete
            </Button>,
            <Button key={2} variant="primary" onClick={onSave}>
              Save
            </Button>,
            <Button key={3} variant="info" onClick={onDownloadSchedule}>
              Download as JSON
            </Button>,
          ]
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default EditModal;
