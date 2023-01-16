import './App.css';
import {useState,useEffect,useRef} from 'react'
import * as faceapi from 'face-api.js'
import Video from './Video';

function App() {
const videoHeight = 240;
const videoWidth = 480;
const [initializing, setInitializing] = useState(false);
const videoRef = useRef();
const canvasRef = useRef();

useEffect (() => {
const loadModels = async () => {
const mod = process.env.PUBLIC_URL + '/mod';
setInitializing(true);

Promise.all([
faceapi.nets.tinyFaceDetector.loadFromUri(mod), 
faceapi.nets.faceLandmark68Net.loadFromUri(mod),
faceapi.nets.faceRecognitionNet.loadFromUri(mod),
faceapi.nets.faceExpressionNet.loadFromUri(mod),

]).then(startVideo);

} 

loadModels();
},[])

const startVideo = () => {
  const gUM = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  gUM({
  video: {}
  })
  .then(stream => videoRef.current.srcObject = stream)
  .catch(err => console.log(err))
}

const handleVideoOnPlay = () => {
  setInterval(async () => {
    if (initializing) {
      setInitializing(false)
    }
    canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
    const displaySize = { 
      width: videoWidth,
      height: videoHeight
      
      }

    faceapi.matchDimensions(canvasRef.current, displaySize); 
    const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections,displaySize)

    canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight)
    faceapi.draw.drawDetections(canvasRef.current, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvasRef.current, resizedDetections) 
    console.log(detections)

  }, 100)
}

  return (
    <div className="App">
      <div className="video">
      <Video embedId="A2g4IwtAX_I" />
      </div>

      <div className="face-video">
        <span className='text'>{initializing ? 'Initializing' : 'Ready'}</span> 
        <div className="face">
          <video ref={videoRef} autoPlay muted height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} /> 
          <canvas ref={canvasRef} className='canva' />
        </div>
      </div>
    </div>
  );
}

export default App;
