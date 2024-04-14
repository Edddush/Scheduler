import React from 'react';
import CourseTable from '../../components/CourseTable';
import renderer from 'react-test-renderer';


const columns = [
    { header: "name", accessProperty: "user_name" },
    { header: "DOB", accessProperty: "user_DOB" }
];

const callbackCol = {
    header: "Send birthday email",
    text: "Send",
    callback: () => { }
}

const data = [
    {
        user_name: "John",
        user_DOB: "xx-yy-2022"
    },
    {
        user_name: "Maya",
        user_DOB: "xx-yy-2021"
    },
    {
        user_name: "Sam",
        user_DOB: "xx-yy-2020"
    },
    {
        user_name: "Fred",
        user_DOB: "xx-yy-2027"
    },
    {
        user_name: "Jacob",
        user_DOB: "xx-yy-2029"
    }
]

it('renders with array of data', () => {
    const tree = renderer
        .create(
                <CourseTable columns={columns}
                    callbackCol={callbackCol}
                    data={data} />
        )
        .toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders with array of no data', () => {
    const tree = renderer
        .create(<CourseTable columns={columns}
            callbackCol={callbackCol}
            data={[]} />)
        .toJSON();
    expect(tree).toMatchSnapshot();
});