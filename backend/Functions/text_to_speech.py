import requests
from decouple import config

ELEVEN_LABS_API_KEY = config("ELEVEN_LABS_API_KEY")

#elevenlab
#convert text to speech
def convert_text_to_speech(message):

    #define dat(body)
    body = {
        "text": message,
        "voice_settings":{
            "stability":0,
            "similarity_boost": 0
        }
    }

    #define voice
    voice_batman = "MKcR6Eulvz4qKUsKiJnF"

    #Constructing Headers and endpoints
    headers = {"xi-api-key": ELEVEN_LABS_API_KEY, "Content-Type": "application/json", "accept": "audio/mpeg"}
    endpoint = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_batman}"

    #send request
    try:
        response = requests.post(endpoint, json=body, headers=headers)
    except Exception as e:
        return 
    
    #handle response
    if response.status_code == 200:
        return response.content
    else:
        return 