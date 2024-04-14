import React, { createContext, useMemo, useState } from "react";
import { purple, teal, green, blue, brown } from "@mui/material/colors";

export const ScheduleContext = createContext()

export const defaultColourStack = [purple, teal, green, blue, brown];

const ScheduleProvider = ({children, value = []}) => {
    const [schedules, setSchedules] = useState([{ title: 'default schedule', courses: value, selected: true, colours: [...defaultColourStack] , borderColour: "#000000",  term: "Fall 2022"}]);
    const providerValue = useMemo(() => ({schedules, setSchedules}), [schedules, setSchedules]);
    return (
        <ScheduleContext.Provider value={providerValue}>
            {children}
        </ScheduleContext.Provider>
    )
};

export default ScheduleProvider;