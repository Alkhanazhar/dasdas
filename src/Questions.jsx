import axios from "axios";
import { Loader, LucideWebcam } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Textarea } from "./components/ui/textarea";
import Webcam from "react-webcam";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "regenerator-runtime/runtime";

const Questions = () => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [submit, setSubmit] = useState(false);
  const [text, setText] = useState("");
  const [answers, setAnswers] = useState([]);
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const [recording, setRecording] = useState("");
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  useEffect(() => {
    setRecording(transcript);
    console.log(recording);
  }, [transcript]);

  const startListening = async () =>
    await SpeechRecognition.startListening({ continuous: true });
  const stopListening = async () => await SpeechRecognition.stopListening();

  const fetchQuestion = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/questions");
      console.log(data.questions);
      setQuestions(data.questions);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleNext = () => {
    // Prevent going beyond question number 10
    if (questionNumber === 9) {
      console.log("submitted");
      setAnswers((prev) => [
        ...prev,
        {
          question: questions[questionNumber],
          answer: text,
        },
      ]);
      setQuestionNumber((prev) => prev + 1);
      setSubmit(true);
      return;
    }

    // Increment question number if it's 0 or greater
    if (questionNumber >= 0 && questionNumber < 9) {
      console.log(questionNumber);
      setAnswers((prev) => [
        ...prev,
        {
          question: questions[questionNumber],
          answer: text,
        },
      ]);
      setQuestionNumber((prev) => prev + 1);
    }
    setText("");
  };

  const handlePrev = () => {
    setQuestionNumber((prev) => {
      // Decrement question number if it's greater than 0
      if (prev > 0) {
        return prev - 1;
      }
      return prev; // Return the current value if no change is needed
    });
  };

  useEffect(() => {
    fetchQuestion();
  }, []);
  if (submit) {
    console.log(answers);
    return <div></div>;
  }
  return (
    <div className="min-h-screen w-full flex justify-center items-center">
      {loading ? (
        <div className="animate-spin">
          <Loader />
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          {questionNumber + 1}

          <div className="flex flex-col md:flex-row justify-center my-7 p-4 w-fit mx-auto">
            {webCamEnabled ? (
              <Webcam
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
                width={300}
                height={300}
                mirrored={true}
                className="rounded-sm mx-auto"
              />
            ) : (
              <div className="flex flex-col ">
                <LucideWebcam className="bg-secondary border rounded-md p-10 h-72 w-72 mb-4 text-black gap-7" />
                <Button
                  variant={"ghost"}
                  className="w-72 border"
                  onClick={() => setWebCamEnabled(true)}
                >
                  get enable your web cam
                </Button>
              </div>
            )}
          </div>
          {/* <>
            <Button onClick={startListening} disabled={listening}>
              Start
            </Button>
            <Button variant="" onClick={stopListening} disabled={!listening}>
              Stop
            </Button>
          </> */}

          <h3 className="text-xl">{questions[questionNumber]}</h3>
          <Textarea
            value={text}
            className="mt-3"
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-center my-4 gap-2 ">
            <Button disabled={questionNumber === 0} onClick={handlePrev}>
              Prev
            </Button>
            {questionNumber < 9 && (
              <Button disabled={text.length <= 5} onClick={handleNext}>
                Next
              </Button>
            )}
            {questionNumber === 9 && (
              <Button onClick={handleNext}>Submit</Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Questions;
