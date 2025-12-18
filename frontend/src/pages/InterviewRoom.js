// import "../components/ChatSection.js"
// import ChatSection from "../components/ChatSection.js"
// import "../components/CodeEditor.js"
// import CodeEditor from "../components/CodeEditor.js"
// import EditorSection from "../components/CodeEditor.js"
// import "../components/VideoSection.js"
// import VideoSection from "../components/VideoSection.js"
import ChatSection from "../components/ChatSection.js";
import CodeEditor from "../components/CodeEditor.js";
import VideoSection from "../components/VideoSection.js";

function InterviewRoom() {
  return (
    <>
      <div className="flex h-screen w-screen">
        {/* LEFT SIDE - Editor */}
        <div className="w-3/5 h-full border border-black-300 rounded-lg p-1/2 shadow-sm">
          <CodeEditor />
        </div>
        {/* RIGHT SIDE - Video + Chat */}
        <div className="w-2/5 h-full flex flex-col ">
          <div className="h-1/2 border border-black-300 rounded-lg p-1/2 shadow-sm">
            <VideoSection />
          </div>

          <div className="h-1/2 border border-black-300 rounded-lg p-1/2 shadow-sm">
            <ChatSection />
          </div>
        </div>
      </div>
    </>
  );
}
export default InterviewRoom;
