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
    "Category titles may include: electronics, structures, propulsion, social media, etc.. Feel free to make up your own categories. "
    "Your response must be in valid JSON format with the following structure:\n"
    "{\n"
    "\"agenda\": [\"agenda item 1\", \"agenda item 2\", ...],\n"
    "\"category1\": [\"task 1\", \"task 2\", ...],\n"
    "\"category2\": [\"task 1\", \"task 2\", ...],\n"
    "...\n"
    "}\n\n"
    "Where \"agenda\" contains bullet points for the next meeting agenda, and each category contains its respective todo list items. "
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

print(chat_completion.choices[0].message.content)
# Extract the JSON part from the response
response_content = chat_completion.choices[0].message.content.strip()

# Find the start and end of the JSON object
start_index = response_content.find("{")
end_index = response_content.rfind("}") + 1

# Extract the JSON string
json_string = response_content[start_index:end_index]

# Parse the JSON string to ensure it's valid
parsed_json = json.loads(json_string)

# Write the parsed JSON to the output file with proper formatting
output_path = os.path.join(os.path.dirname(__file__), "output.json")
with open(output_path, "w") as output_file:
    json.dump(parsed_json, output_file, indent=4)


print("Output JSON file created successfully at:", output_path)