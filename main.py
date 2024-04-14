from flask import Flask, jsonify, escape, request
import json
import redis
from json.decoder import JSONDecodeError

app = Flask(__name__)

# create a redis client
r = redis.Redis(host="127.0.0.1", port=6379, charset="utf-8", decode_responses=True)

tableName = "courses"

# backend search functionality for courses in the hashmap
def searchFunction(
    courseTitle: str = None,
    subject: str = None,
    term: str = None,
    courseCode: str = None,
    **kwargs
):
    if courseTitle:
        courseTitle = courseTitle.upper()
        courseTitle = courseTitle.strip()

    if subject:
        subject = subject.upper()
        subject = subject.strip()

    if term:
        term = term.upper()
        term = term.strip()

    if courseCode:
        courseCode = courseCode.strip()

    array = []

    if not (courseTitle or subject or term or courseCode):
        return []

    # For loop to go through the courses in redis db
    for key in r.hkeys(tableName):
        # skip if coursetitle does not appear in key
        if courseTitle and not courseTitle in key.upper():
            continue

        # load the values of the current key(course)
        courseData = json.loads(r.hget(tableName, key))

        # if the input is not equal to the course values, proceed to the next key
        if (
            (subject and courseData["subject"] != subject)
            or (term and courseData["term"].upper() != term)
            or (courseCode and courseData["course_code"] != courseCode)
        ):
            continue

        array.append(courseData)
    return array


@app.errorhandler(404)
def not_found(e):
    return jsonify(error="Resource could not be found."), 404


# api to handle backend communication-post request for course information
@app.route("/api/courseSearch", methods=["GET"])
def courseSearch():
    args = request.args.to_dict()
    cleanArg = {}

    for key, val in args.items():
        cleanArg.update({escape(key): escape(val)})

    results = searchFunction(**cleanArg)
    if len(results) == 0:
        return jsonify(error="No courses found"), 404
    return jsonify(results)


@app.route("/api")
def api():
    return jsonify(message="API available", status=200)


# main runner on flask
if __name__ == "__main__":
    app.run(host="0.0.0.0")
