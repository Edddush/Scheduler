import redis, json

""" 
Simple file to store courses in a redis database.
"""

hashname = "courses"

# Create a redis client
r = redis.Redis(host="127.0.0.1", port=6379, charset="utf-8", decode_responses=True)

# open and read the courses.json
with open("courses.json", "r") as f:
    data = json.load(f)

# The below is for formatting the JSON that comes from html_parser.py

"""     for course in data:
        splitData =  course["section_name_and_title"].split('*')
        course["subject"] = splitData[0]
        course["course_code"] = splitData[1]
        course["section_number"] = splitData[2].split(' ')[0]
        course["uid"] = splitData[2].split('(')[1].split(')')[0]
        course["course_name"] = course["section_name_and_title"].split(')')[1].strip() """

""" with open("courses.json", "w") as f:
    json.dump(data, f) """


# adding the key-value pairs to a hashmap
for courseObj in data:
    r.hset(hashname, courseObj["section_name_and_title"], json.dumps(courseObj))
