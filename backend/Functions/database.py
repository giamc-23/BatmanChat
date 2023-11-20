import json
import random

#Get Recent Messages 
def get_recent_messages():
    
    #Define the file name and learn instructions
    file_name = "stored_data.json"
    learned_instruction = {
        "role": "system",
        "content": "You are batman being a therapist for the User is called Min. Keep your answers under 30 words and don't speak spanish" 
    }

    #Initialize messages
    messages = []

    #Add a random element  
    x = random.uniform(0,1)
    if x < 0.5:
        learned_instruction["content"] = learned_instruction["content"] + " Your Response will be some type of advice batman would give."
    else:
        learned_instruction["content"] = learned_instruction["content"] + " Your Response will include a tough love response but caring at the same time."
    
    #append instruction to message
    messages.append(learned_instruction)

    #Get last messages
    try:
        with open(file_name) as user_file:
            data = json.load(user_file)

            #append last 5 items of data 
            if data:
                if len(data) < 5:
                    for item in data:
                        messages.append(item)
                else:
                    for item in data[-5:]:
                        messages.append(item)
    except Exception as e:
        print(e)
        pass

    #return messages
    return messages 

def store_messages(request_message, response_message):
    
    #define file name 
    file_name = "stored_data.json"

    #get recent message
    messages = get_recent_messages()[1:]

    #add messages to data 
    user_message = {"role": "user", "content":request_message}
    assistant_message = {"role": "assistant", "content":response_message}
    messages.append(user_message)
    messages.append(assistant_message)

    #save the updated file 
    with open(file_name, "w") as f:
        json.dump(messages,f)


#reset messages
def reset_messages():

    #overrites file with nothing
    open("stored_data.json", "w")