import {checkConflicts, createScheduleData} from '../components/Scheduler'
import {fullCourseSet, conflictingCourseSet} from './snapshotTests/test.data'
import {
    purple, indigo, green, red, blue, cyan
  } from '@mui/material/colors';

const globalCOlorStack = [purple, indigo, green, blue, cyan]

//Checks if our program can detect and handle time conflicts accordingly
test('detect conflict between two courses', () => {

    const colorStack = [...globalCOlorStack]
    const tempScheduleData = []
    const tempCourseTitles = []

    tempScheduleData.forEach((course)=>{
        tempCourseTitles.push({
            text: course.section_name_and_title,
            id: course.section_name_and_title,
            color: colorStack[0]
          })
          colorStack.splice(0,1)
    })

  createScheduleData(tempScheduleData, tempCourseTitles, conflictingCourseSet)

    checkConflicts(tempScheduleData, tempCourseTitles)

    // items 1 and 3 conflict, check their color 
    expect(tempCourseTitles[1].color).toEqual(red)
    expect(tempCourseTitles[3].color).toEqual(red)
});

test('detect no conflicts for given schedule', () => {

  const colorStack = [...globalCOlorStack]
  const tempScheduleData = []
  const tempCourseTitles = []

  tempScheduleData.forEach((course)=>{
      tempCourseTitles.push({
          text: course.section_name_and_title,
          id: course.section_name_and_title,
          color: colorStack[0]
        })
        colorStack.splice(0,1)
  })

  createScheduleData(tempScheduleData, tempCourseTitles, fullCourseSet)

  checkConflicts(tempScheduleData, tempCourseTitles)
  // items 1 and 3 conflict, check their color 
  tempCourseTitles.forEach((title) => {
    expect(title.color).not.toEqual(red)
  })
});