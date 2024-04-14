import {convertTo24Hour} from '../components/Scheduler'
//Tests if convertTo24Hour() function is working in Scheduler.js
test('convert time before noon', () => {
    expect(convertTo24Hour('08:30AM')).toBe('08:30')
});

test('convert time after noon', () => {
    expect(convertTo24Hour('07:20PM')).toBe('19:20')
});

test('convert time at noon', () => {
    expect(convertTo24Hour('12:00PM')).toBe('12:00')
});

test('convert time at midnight', () => {
    expect(convertTo24Hour('12:00AM')).toBe('0:00')
});