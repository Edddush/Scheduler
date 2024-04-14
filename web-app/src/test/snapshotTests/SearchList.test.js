import React from 'react';
import SearchList from '../../components/SearchList';
import renderer from 'react-test-renderer';
import { fullCourseSet, partialCourseSet, conflictingCourseSet } from './test.data'
import ScheduleProvider from '../../context/ScheduleContext'

it('renders with full courses', () => {
  var obj = {term:"Fall 2022"}
  const tree = renderer
    .create(
      <ScheduleProvider>
        <SearchList searchResults={fullCourseSet} searchInput={obj} />
      </ScheduleProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders with partial courses', () => {
  var obj = {term:"Fall 2022"}
  const tree = renderer
    .create(
      <ScheduleProvider>
        <SearchList searchResults={partialCourseSet} searchInput={obj}/>
      </ScheduleProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders with full conflicting courses', () => {
  var obj = {term:"Fall 2022"}
  const tree = renderer
    .create(
      <ScheduleProvider>
        <SearchList searchResults={conflictingCourseSet} searchInput={obj}/>
      </ScheduleProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});