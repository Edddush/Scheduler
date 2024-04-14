import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "react-bootstrap/Button";
import uuid from "react-uuid";

//-----------------------------------------------------------------------------------------------------------------------------
// Utility table to display x rows with y columns of data where the last column is a callback relating to the data

// props structure:

// data is an array of objects, where each object contains the properties defined in the columns object
// columns is an array of objects, each object has a property called header which will be the display text,
// each object also has a property called accessProperty which is the name of the property on the objects in data that
// corresponds to the header for that column
// callbackCol represents the last column and is an object with three properties -> header, callback, and text
//-----------------------------------------------------------------------------------------------------------------------------

function CourseTable({ data: rows, columns, callbackCol }) {
  return (
    <TableContainer
      component={Paper}
      style={{
        height: "400px",
        overflowY: "scroll",
      }}
    >
      <Table
        stickyHeader
        sx={{ minWidth: 650 }}
        style={{
          overflow: "scroll",
        }}
        aria-label="simple table"
      >
        <TableHead>
          <TableRow>
            {columns.map(({header}) => (
              <TableCell key={uuid()} align="center">
                {header}
              </TableCell>
            ))}
            <TableCell align="center">{callbackCol.header}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row,i) => (
            <TableRow
              key={`${row.name}${i}`}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {
                // map through cols and get data for that row
                columns.map((col) => (
                  <TableCell key={uuid()} align="center">
                    {row[col.accessProperty]}
                  </TableCell>
                ))
              }
              <TableCell align="center">
                <Button
                  id="temp-button"
                  variant="dark"
                  size="lg"
                  onClick={() => callbackCol.callback(row)}
                >
                  {callbackCol.text}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default CourseTable;
