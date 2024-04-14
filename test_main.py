import json
import pytest

from main import app as mainApp
from main import searchFunction


@pytest.fixture()
def app():
    """Make Application for tests"""
    app = mainApp

    app.config.update(
        {
            "TESTING": True,
        }
    )

    # Give Test control
    yield app


@pytest.fixture()
def client(app):
    """Start test client"""
    return app.test_client()


# open the test json
with open("backend_test/testclass.json", "r") as fp:
    testclass = json.load(fp)


def test_all_courses_full_input():
    with open("backend_setup/courses.json", "r") as fp:
        courses = json.load(fp)
    for course in courses:
        assert (
            searchFunction(
                courseTitle=course["course_name"],
                subject=course["subject"],
                term=course["term"],
                courseCode=course["course_code"],
            )[0]["course_name"]
            == course["course_name"]
        )


def test_full_input():
    """Check output with all data"""
    assert (
        searchFunction(
            courseTitle="Software Engineering",
            subject="CIS",
            term="Fall 2022",
            courseCode="3760",
        )[0]["course_name"]
        == testclass["course_name"]
    )


def test_winter_course():
    assert searchFunction(term="Winter 2023")[0]["term"] == "Winter 2023"


def test_empty_title():
    """Check output with missing title"""
    assert (
        searchFunction(subject="CIS", term="Fall 2022", courseCode="3760")[0][
            "course_name"
        ]
        == testclass["course_name"]
    )


def test_empty_subject():
    """Check output with missing subject"""
    assert (
        searchFunction(
            courseTitle="Software Engineering", term="Fall 2022", courseCode="3760"
        )[0]["course_name"]
        == testclass["course_name"]
    )


def test_empty_term():
    """Check output with missing term"""
    assert (
        searchFunction(
            courseTitle="Software Engineering", subject="CIS", courseCode="3760"
        )[0]["course_name"]
        == testclass["course_name"]
    )


def test_empty_code():
    """Check output with missing course code"""
    assert (
        searchFunction(
            courseTitle="Software Engineering", subject="CIS", term="Fall 2022"
        )[0]["course_name"]
        == testclass["course_name"]
    )


def test_all_empty():
    """Check output with all data missing"""
    assert len(searchFunction()) == 0


def test_bad_request(client):
    """Check status with bad request to flask"""

    response = client.get("/api/courseSearch/aasdfa")
    assert response.status_code == 404


def test_bad_input(client):
    """Check output with invalid course details"""

    response = client.get(
        "/api/courseSearch?courseTitle=bad+&subject=input&courseCode=here"
    )
    assert response.status_code == 404
    assert b'{"error":"No courses found"}\n' in response.data


def test_good_request(client):
    """Check status with good request to flask"""

    response = client.get("/api/courseSearch?courseTitle=&subject=CIS&courseCode=2520")
    assert response.status_code == 200


def test_good_input(client):
    """Check output with good course details"""

    response = client.get("/api/courseSearch?courseTitle=&subject=CONS&courseCode=6300")
    assert response.status_code == 200
    assert b"TBA" in response.data
