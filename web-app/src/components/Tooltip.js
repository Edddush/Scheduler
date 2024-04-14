import React from "react";
import {
    AppointmentTooltip
} from "@devexpress/dx-react-scheduler-material-ui";
export const TooltipLayout = props => {
    return (
        <AppointmentTooltip.Layout
            {...props}
            style={{ pointerEvents: "none" }}
        />
    );
};

export const TooltipContentProps = ({ /* children, */ appointmentData, ...restProps }) => {
    const {
        academic_level,
        available_capacity,
        credits,
        faculty,
        location,
        status
    } = appointmentData;
    return (
    
        <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
            <br />
            <div id="tooltipbody">
                <h6>Academic Level</h6>
                <p>{academic_level}</p>
                <h6>Credits</h6>
                <p>{credits}</p>
                <h6>Available Capacity</h6>
                <p>{available_capacity}</p>
                <h6>Faculty</h6>
                <p>{faculty}</p>
                <h6>Location</h6>
                <p>{location}</p>
                <h6>Status</h6>
                <p>{status}</p>
            </div>
        </AppointmentTooltip.Content>
    )
}