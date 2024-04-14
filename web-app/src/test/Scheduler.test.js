import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow'
import Scheduler from '../components/Scheduler.js';
import { createAppointment } from '../components/Scheduler.js';
import ScheduleProvider from '../context/ScheduleContext'

//test to check if Scheduler component renders without crashing
it("Scheduler renders without crashing", () => {
    const renderer = new ShallowRenderer();
    renderer.render(
        <ScheduleProvider>
            <Scheduler />
        </ScheduleProvider>

    );
    renderer.getRenderOutput();
});

//test createAppointment function in scheduler.js
//comparing hard coded object to the return of createAppoinment() function
it("Create appointment", () => {
    const meetingBlock = {
        day: 'LEC Mon, Wed',
        time: '08:30AM - 09:20AM'
    };
    let courseName = [];
    courseName[0] = 'CIS*4150*0101 (7266) Software Reliability & Testing'
    Date.parse('2022-11-09 08:30', 'YYYY-MM-DD hh:mm:ss');

    let returnObj = [{
        course: courseName,
        startDate: Date.parse('2022-11-07 08:30', 'YYYY-MM-DD hh:mm:ss'),
        endDate: Date.parse('2022-11-07 09:20', 'YYYY-MM-DD hh:mm:ss'),
        title: "LEC Software Reliability & Testing"
    }, {
        course: courseName,
        startDate: Date.parse('2022-11-09 08:30', 'YYYY-MM-DD hh:mm:ss'),
        endDate: Date.parse('2022-11-09 09:20', 'YYYY-MM-DD hh:mm:ss'),
        title: "LEC Software Reliability & Testing"
    }];
    let expected = createAppointment(meetingBlock, { course_name: 'Software Reliability & Testing', section_name_and_title: 'CIS*4150*0101 (7266) Software Reliability & Testing' })
    delete expected[0].id;
    delete expected[1].id;
    expect(JSON.stringify(returnObj)).toBe(JSON.stringify(expected));
});