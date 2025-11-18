import "../components/ChatSection.js"
import ChatSection from "../components/ChatSection.js"
import "../components/EditorSection.js"
import EditorSection from "../components/EditorSection.js"
import "../components/VideoSection.js"
import VideoSection from "../components/VideoSection.js"


function InterviewRoom(){


    return <>
        <div className="flex h-screen w-screen">

      {/* LEFT SIDE - Editor */}
      <div className="w-3/5 h-full">
        <EditorSection />
      </div>

      {/* RIGHT SIDE - Video + Chat */}
      <div className="w-2/5 h-full flex flex-col">

        <div className="h-1/2">
          <VideoSection />
        </div>

        <div className="h-1/2">
          <ChatSection />
        </div>

      </div>

    </div>
    </>
}
export default InterviewRoom;