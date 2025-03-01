import os
os.environ["GROQ_API_KEY"] = "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"
from groq import Groq
import json

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

prompt = (
    "You are to act as an AI project manager helper. You are assisting an engineering projects team. "
    "Your primary task is to extract a list of deliverables by the next meeting, categorized into 2 to 4 reasonable categories. "
    "Category titles may include: electronics, structures, propulsion, social media, admin, etc.. Feel free to make up your own categories. "
    "For each task, if there is a due date, please include it at the end of the task in the format (mm/dd/yyyy). If there's no year, just use 2025, and don't write tasks as ... by March ##. Just write the date as (mm/dd/yyyy) at the end of the array element."
    "Your response must be in valid JSON format with the following structure where category and tasks are keys:\n"
    "[\n"
    "    {\n"
    "        \"category\": \"Category Name\",\n"
    "        \"tasks\": [\"task 1\", \"task 2\", ...]\n"
    "    },\n"
    "    {\n"
    "        \"category\": \"Category Name\",\n"
    "        \"tasks\": [\"task 1\", \"task 2\", ...]\n"
    "    }\n"
    "]\n\n"
    "Each object in the array contains a category and its respective todo list items. "
    "Ensure the JSON is properly formatted and can be directly copied and pasted. Here is the transcription:"
)
# print(prompt)
file_path = os.path.join(os.path.dirname(__file__), "transcription.txt")
with open(file_path, "r") as file:
    transcription = file.read()

chat_completion = client.chat.completions.create(
    messages=[
        {
            "role": "user",
            "content": prompt + "\n\n" + transcription
        }
    ],
    model="llama-3.3-70b-versatile",
)

# Print the response
print(chat_completion.choices[0].message.content)

# Save the response as a .json file
output_path = os.path.join(os.path.dirname(__file__), "output.json")
with open(output_path, "w") as json_file:
    json.dump(json.loads(chat_completion.choices[0].message.content), json_file, indent=4)
