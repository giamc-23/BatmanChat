import { useState } from "react";
import Title from "./Title";
import RecordMessages from "./RecordMessages";
import axios from "axios";

function Controller() {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  const createBlobUrl = (data: any) => {
    const blob = new Blob([data], { type: "audio/mpeg" });
    const url = window.URL.createObjectURL(blob);
    return url;
  };

  const handleStop = async (blobUrl: string) => {
    setIsLoading(true);

    //append recorded message to messages
    const myMessage = { sender: "me", blobUrl };
    const messagesArr = [...messages, myMessage];

    // conver blob url to blob object
    fetch(blobUrl)
      .then((res) => res.blob())
      .then(async (blob) => {
        //construct audio to send file
        const formData = new FormData();
        formData.append("file", blob, "myFile.wav");

        // send form data
        await axios
          .post("http://localhost:8000/post-audio", formData, {
            headers: { "Content-Type": "audio/mpeg" },
            responseType: "arraybuffer",
          })
          .then((res: any) => {
            const blob = res.data;
            const audio = new Audio();
            audio.src = createBlobUrl(blob);

            //append to audio
            const BatmanMessage = { sender: "batman", blobUrl: audio.src };
            messagesArr.push(BatmanMessage);
            setMessages(messagesArr);

            //play audio
            setIsLoading(false);
            audio.play();
          })
          .catch((err) => {
            console.error(err.message);
            setIsLoading(false);
          });
      });
  };

  return (
    <div className="h-screen overflow-y-hidden">
      <Title setMessages={setMessages} />
      <div className="flex flex-col justify-between h-full overflow-y-scroll pb-96">
        {/* Conversation */}
        <div className="mt-5 px-5">
          {messages.map((audio, index) => {
            return (
              <div
                key={index + audio.sender}
                className={
                  "flex flex-col " +
                  (audio.sender == "batman" && "flex items-end")
                }
              >
                {/* sender */}
                <div className="mt-4">
                  <p
                    className={
                      audio.sender == "batman"
                        ? "text-right mr-2 italic text-yellow-300"
                        : "ml-2 italic text-blue-500"
                    }
                  >
                    {audio.sender}
                  </p>

                  {/* Audio Message */}
                  <audio
                    src={audio.blobUrl}
                    className="appearance-none"
                    controls
                  />
                </div>
              </div>
            );
          })}

          {messages.length == 0 && !isLoading &&(
            <div className="text-center font-light italic mt-10">
              Send Batman a message
            </div>
          )}

        {isLoading &&(
            <div className="text-center font-light italic mt-10 animate-pulse">
              give me a few seconds
            </div>
          )}
        </div>

        {/* record */}
        <div className="fixed bottom-0 w-full py-6 border-t test-center bg-gradient-to-r from-sky-500 to-green-500 ">
          <div className="flex justify-center items-center w-full">
            <RecordMessages handleStop={handleStop} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Controller;
