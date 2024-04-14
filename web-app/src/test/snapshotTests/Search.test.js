import React from 'react';
import renderer from 'react-test-renderer';
import Search from '../../components/Search';
import ScheduleProvider from '../../context/ScheduleContext'

it('renders with no props', () => {
  const tree = renderer
    .create(
      <ScheduleProvider>
        <Search />
      </ScheduleProvider>
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

