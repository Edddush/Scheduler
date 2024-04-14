import { defaultColourStack } from "../context/ScheduleContext";


export const addCourse = (setSchedules, course) => {
    setSchedules(prevSchedules => {
        return prevSchedules.map((schedule) => {
            if (schedule.selected) {
                if(schedule.term !==course.term){
                    alert("Course not offered in appropriate term");
                }else if (schedule.courses && schedule.courses.length < 5) {
                    course.colour = schedule.colours.pop();
                    schedule.courses.push(course);
                } else {
                    alert("Maximum Courses Selected");
                }
            }
            return schedule;
        })
    })
}

export const removeCourse = (setSchedules, uid) => {
    setSchedules(prevSchedule => prevSchedule.map((schedule) => {
        if (schedule.selected) {
            schedule.courses = schedule.courses.filter((course) => {
                if(course.uid === uid) {
                    schedule.colours.push(course.colour);
                }
                return course.uid !== uid;
            })
        }
        return schedule;
    }));
}

export const setActiveSchedule = (setSchedules, title) => {
    setSchedules(prevSchedule => prevSchedule.map((schedule) => {
        schedule.selected = schedule.title === title ? true : false;
        return schedule;
    }));
}

export const getActiveSchedule = (schedules) => {
    return schedules.find(schedule => schedule.selected);
}

export const clearActiveSchedule = (setSchedules) => {
    setSchedules(prevSchedule => prevSchedule.map((schedule) => {
        if (schedule.selected) {
            schedule.colours = [...defaultColourStack];
            schedule.courses = [];
        }
        return schedule;
    }));
}

export const addSchedule = (setSchedules, newTitle, term, copySchedule = {colours: [...defaultColourStack], courses: []}) => {
    const {colours, courses} = copySchedule;
    setSchedules(prevSchedules => [
        ...prevSchedules,
        {
            title: newTitle,
            colours: colours.map(a => ({...a})), //deep copy the colours array, very important
            // here we can edit what the inital schedule contains (if they want a clear one)
            courses: courses.map(a => ({...a})),
            term: term,
        },
    ]);

    setActiveSchedule(setSchedules, newTitle);
}

export const deleteActiveSchedule = (setSchedules) => {
    setSchedules((schedules) => {
        if (schedules.length === 1) {
            alert("Cannot delete the only remaining schedule!");
            return schedules;
        }
        schedules = schedules.filter((value) => !value.selected);
        schedules[0].selected = true;
        return schedules;
    });
}

export const changeActiveScheduleName = (setSchedules, newName, successCallback, failCallback) => {
    setSchedules((oldSchedules) => {
        return oldSchedules.map((schedule) => {
            if (schedule.selected && schedule.title !== newName) { //check if name has been changed for selected schedule
                if (oldSchedules.every((schedule) => (schedule.title !== newName) && //use array.every method to run a boolean statement on every schedule to check for unique name
                    newName !== "" && //make sure new name is not empty
                    newName.length <= 64)) { //check to make sure newName is less than 64 chars
                    schedule.title = newName; //set new title
                    successCallback(); //call successful callback function
                }
                else {
                    failCallback(); //call failure callback function
                }
            }
            return schedule;
        });
    });
}

export const changeScheduleColor = (setSchedules, newColor, successCallback) => {
    setSchedules((oldSchedules) => {
        return oldSchedules.map((schedule) => {
            if (schedule.selected){            
                schedule.borderColour = newColor; 
                successCallback();            
            }
            return schedule;
        });
    });
}

export const changeActiveScheduleTerm = (setSchedules, newTerm) => {
    setSchedules((oldSchedules) => {
        return oldSchedules.map((schedule) => {
            if (schedule.selected){
                schedule.term = newTerm;
            } 
            return schedule; 
        });
    });
}
