from html.parser import HTMLParser
from sys import argv
from typing import List, Dict
import json


class CourseHTMLParser(HTMLParser):
    """Class for converting a University of Guelph
    course section HTML file to a dictionary"""

    courseList: List[Dict]
    """The list containing all courses in dictionary form"""

    courseDictionary: Dict
    """The dictionary containing all information about a course"""

    def __init__(self) -> None:
        super().__init__()

        self.courseList = []
        self.courseDictionary = {}

        self.meetingInfo = []
        self.meetingInfoDictionary = {}

        self.courseDictionary["meeting_information"] = {
            "lecture": {},
            "lab": {},
            "seminar": {},
            "exam": {},
        }

        self.isWssCourseSections = False
        self.isListVar1 = False
        self.isSecShortTitle = False
        self.isSecLocation = False
        self.isSecFacultyInfo = False
        self.isListVar5 = False
        self.isSecMinCred = False
        self.isSecCeus = False
        self.isSecAcadLevel = False

        self.meetingDepth = 0
        self.meetingIndex = 0
        self.currentMeetingDict = {}
        self.meetingType = ""

        self.inSectionTable = False
        self.inTableBody = False

    def handle_starttag(self, tag, attrs):
        if not self.inSectionTable:
            # tracking if we are in the table which contains courses.
            for name, value in attrs:
                if name == "summary" and value == "Sections":
                    self.inSectionTable = True
                    return
            return

        if not self.inTableBody and tag == "td":
            # this allows us to check if we are in the course information section, not just header
            self.inTableBody = True

        if self.meetingDepth:
            self.meetingDepth += 1

        for name, value in attrs:
            if tag == "a" and name == "id" and "SEC_SHORT_TITLE" in value:
                self.isSecShortTitle = True
            elif tag == "div" and name == "class" and "meet" in value:
                self.meetingDepth = 1
                self.meetingIndex = 0
                if "LEC" in value:
                    self.meetingType = "lecture"
                elif "SEM" in value:
                    self.meetingType = "seminar"
                elif "LAB" in value:
                    self.meetingType = "lab"
                elif "EXAM" in value:
                    self.meetingType = "exam"
            elif tag == "p" and name == "id":
                if "WSS_COURSE_SECTIONS" in value:
                    self.isWssCourseSections = True
                elif "LIST_VAR1" in value:
                    self.isListVar1 = True
                elif "SEC_LOCATION" in value:
                    self.isSecLocation = True
                elif "SEC_FACULTY_INFO" in value:
                    self.isSecFacultyInfo = True
                elif "LIST_VAR5" in value:
                    self.isListVar5 = True
                elif "SEC_MIN_CRED" in value:
                    self.isSecMinCred = True
                elif "SEC_CEUS" in value:
                    self.isSecCeus = True
                elif "SEC_ACAD_LEVEL" in value:
                    self.isSecAcadLevel = True

    def getCourseList(self):
        """Getter for the courseList"""
        return self.courseList

    def handle_endtag(self, tag):
        """Method for handling the end of an html tag ie. </b>"""
        if self.meetingDepth:
            self.meetingDepth -= 1
            if self.meetingDepth == 0:
                """if we have transitioned out of a meeting block, then we can save the data to the meeting
                information section of the dictionary."""
                self.courseDictionary["meeting_information"][
                    self.meetingType
                ] = self.currentMeetingDict
                self.currentMeetingDict = {}

        if self.inSectionTable:
            if tag == "table":
                self.inSectionTable = False
                self.inTableBody = False
            elif self.inTableBody and tag == "tr":
                completedCourseDictionary = self.courseDictionary.copy()
                self.courseList.append(completedCourseDictionary)
                # print(self.courseList)
                self.courseDictionary.clear()

                self.courseDictionary["meeting_information"] = {
                    "lecture": {},
                    "lab": {},
                    "seminar": {},
                    "exam": {},
                }

    def handle_data(self, data):
        """Handles the data inside of HTML tags"""
        if not self.inSectionTable:
            return
        meetingHeaders = ["day", "time", "place"]

        data = data.strip()
        data = data.replace("\n", "")
        data = " ".join(data.split())

        if len(data) > 0 and self.meetingDepth:
            if self.meetingIndex == 3:
                # This merges the building and room since building is wrapped in an anchor tag
                self.currentMeetingDict["place"] += data
                return
            self.currentMeetingDict[meetingHeaders[self.meetingIndex]] = data
            self.meetingIndex += 1
            return

        if self.isSecCeus:
            self.courseDictionary["ceus"] = data
            self.isSecCeus = False
        if self.isWssCourseSections == True:
            self.courseDictionary["term"] = data
            self.isWssCourseSections = False
        if self.isListVar1 == True:
            self.courseDictionary["status"] = data
            self.isListVar1 = False
        if self.isSecShortTitle == True:
            self.courseDictionary["section_name_and_title"] = data
            self.isSecShortTitle = False
        if self.isSecLocation == True:
            self.courseDictionary["location"] = data
            self.isSecLocation = False
        if self.isSecFacultyInfo == True:
            self.courseDictionary["faculty"] = data
            self.isSecFacultyInfo = False
        if self.isListVar5 == True:
            self.courseDictionary["available_capacity"] = data
            self.isListVar5 = False
        if self.isSecMinCred == True:
            self.courseDictionary["credits"] = data
            self.isSecMinCred = False
        if self.isSecAcadLevel == True:
            self.courseDictionary["academic_level"] = data
            self.isSecAcadLevel = False

    def writeListToFile(self, fileName):
        """Take the list of dictionaries and output to json file"""
        with open(fileName, "w") as file:
            file.write(json.dumps(self.courseList, indent=4))


def parse_html(file):
    """Parse html data into a list of dictionaries. Output list to json file named "courses.json"."""
    my_parser = CourseHTMLParser()
    try:
        my_parser.feed(file)
        my_parser.writeListToFile("courses.json")
    except Exception as e:
        print("Failed to parse the HTML file!")


if __name__ == "__main__":
    if len(argv) < 2:
        print(
            "Please enter the filename you wish to convert as a command line argument:\npython3 html_parser.py <filename>"
        )
    else:
        with open(argv[1], "r") as file:
            parse_html(file.read())
