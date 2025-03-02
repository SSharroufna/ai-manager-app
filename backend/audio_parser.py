import assemblyai as aai
import os
import sys

# Set your AssemblyAI API key
aai.settings.api_key = "50f9f22e00ad407883cf9c814b87570a"

# Initialize the transcriber
transcriber = aai.Transcriber()

# Get the input audio path from the command line arguments
input_audio_path = sys.argv[1]

# Transcribe the uploaded file
transcript = transcriber.transcribe(input_audio_path)

# Define the path to the transcriptions folder
transcriptions_folder = "../backend"

# Create the transcriptions folder if it doesn't exist
os.makedirs(transcriptions_folder, exist_ok=True)

# Define the full path for the output file
output_file_path = os.path.join(transcriptions_folder, "transcription.txt")

# Save the transcribed text to the file
with open(output_file_path, "w", encoding="utf-8") as file:
    file.write(transcript.text)

# Print the transcribed text (optional)
print("\nTranscription:\n", transcript.text)
print(f"Transcription saved to: {output_file_path}")