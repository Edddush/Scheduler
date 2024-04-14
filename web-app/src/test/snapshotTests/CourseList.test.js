import React from 'react';
import CourseList from '../../components/CourseList';
import renderer from 'react-test-renderer';
import { fullCourseSet, partialCourseSet, conflictingCourseSet } from './test.data'
import ScheduleProvider from '../../context/ScheduleContext'

it('renders with full courses', () => {
  const tree = renderer
    .create(
      <ScheduleProvider value={fullCourseSet}>
        <CourseList/>
      </ScheduleProvider>

    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders with partial courses', () => {
  const tree = renderer
    .create(
      <ScheduleProvider value={partialCourseSet}>
        <CourseList/>
      </ScheduleProvider>

    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders with full conflicting courses', () => {
  const tree = renderer
    .create(
      <ScheduleProvider value={conflictingCourseSet} >
        <CourseList/>
      </ScheduleProvider>

    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});