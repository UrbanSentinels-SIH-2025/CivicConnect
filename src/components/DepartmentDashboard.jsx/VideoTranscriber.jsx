import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaMicrophoneSlash, FaDownload, FaCopy, FaSync } from 'react-icons/fa';

// Mock transcription service (replace with actual API)
const mockTranscribeAudio = async (audioBlob) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock transcription response - in real implementation, this would call an actual API
  const mockTranscriptions = [
    "This is a sample transcription of the video audio. It appears to be reporting an issue with street conditions.",
    "The reporter is describing a pothole on Main Street near the intersection with Oak Avenue.",
    "There seems to be water leakage from a broken pipe causing inconvenience to pedestrians.",
    "The issue requires immediate attention from the municipal authorities.",
    "Residents are concerned about safety hazards in the area."
  ];
  
  return mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
};

// Audio recorder component for manual recording
const AudioRecorder = ({ onTranscriptionComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        setAudioBlob(blob);
        
        // Auto-transcribe after recording
        const transcription = await mockTranscribeAudio(blob);
        onTranscriptionComplete(transcription);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Microphone access denied. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`p-4 rounded-full text-white font-semibold transition-all duration-300 transform hover:scale-105 ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isRecording ? (
          <FaMicrophoneSlash size={24} />
        ) : (
          <FaMicrophone size={24} />
        )}
      </button>
      <span className="text-sm text-gray-600">
        {isRecording ? 'Recording... Click to stop' : 'Click to record audio'}
      </span>
      {audioBlob && (
        <audio controls src={URL.createObjectURL(audioBlob)} className="w-full max-w-md" />
      )}
    </div>
  );
};

// Video transcriber component
const VideoTranscriber = ({ videoUrl }) => {
  const [transcription, setTranscription] = useState('');
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState('');
  const [transcriptionHistory, setTranscriptionHistory] = useState([]);
  const videoRef = useRef();

  // Extract audio from video and transcribe
  const transcribeVideo = async () => {
    if (!videoUrl) {
      setError('No video URL provided');
      return;
    }

    setIsTranscribing(true);
    setError('');

    try {
      // In a real implementation, you would:
      // 1. Extract audio from the video
      // 2. Send audio to a transcription service (Google Speech-to-Text, AWS Transcribe, etc.)
      // 3. Return the transcription
      
      // Mock implementation
      const mockTranscription = await mockTranscribeVideo(videoUrl);
      setTranscription(mockTranscription);
      
      // Add to history
      setTranscriptionHistory(prev => [{
        id: Date.now(),
        text: mockTranscription,
        timestamp: new Date().toLocaleString(),
        videoUrl: videoUrl
      }, ...prev.slice(0, 4)]); // Keep last 5 transcriptions
      
    } catch (err) {
      setError('Transcription failed. Please try again.');
      console.error('Transcription error:', err);
    } finally {
      setIsTranscribing(false);
    }
  };

  const mockTranscribeVideo = async (url) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockTranscriptions = [
      "Emergency report: There's a major water pipeline burst on Elm Street. Water is flooding the roadway and nearby properties. Immediate attention required from the water department. The flow is strong and causing traffic disruption.",
      
      "Public safety issue: Large pothole developing at the intersection of Main Street and 5th Avenue. Approximately 2 feet wide and 6 inches deep. Several vehicles have already sustained damage. Needs urgent repair.",
      
      "Sanitation complaint: Garbage accumulation near the community park. Bins are overflowing and attracting pests. Residents are concerned about health hazards. Regular collection service appears to be delayed.",
      
      "Electrical hazard: Fallen power lines observed near Oakwood Avenue. Wires are sparking and posing serious safety risk. Area should be cordoned off immediately. Utility company notification required.",
      
      "Road infrastructure: Streetlights malfunctioning along Riverside Drive. Entire section is dark, creating safety concerns for pedestrians and drivers. Repair needed before nightfall."
    ];
    
    return mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(transcription);
      alert('Transcription copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const downloadTranscription = () => {
    const element = document.createElement('a');
    const file = new Blob([transcription], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `transcription-${new Date().getTime()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const loadHistoryItem = (item) => {
    setTranscription(item.text);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-3">
        <h3 className="font-bold text-white flex items-center gap-2 text-sm">
          🎤 Video Transcription
        </h3>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Video Preview */}
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            className="w-full h-full object-cover"
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Transcription Controls */}
        <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
          <button
            onClick={transcribeVideo}
            disabled={isTranscribing}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTranscribing ? (
              <>
                <FaSync className="animate-spin" />
                Transcribing...
              </>
            ) : (
              <>
                <FaMicrophone />
                Transcribe Video
              </>
            )}
          </button>
          
          <div className="flex gap-2">
            {transcription && (
              <>
                <button
                  onClick={copyToClipboard}
                  className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  <FaCopy />
                </button>
                <button
                  onClick={downloadTranscription}
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                  title="Download transcription"
                >
                  <FaDownload />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Transcription Result */}
        {transcription && (
          <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
            <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
              📝 Transcription Result
            </h4>
            <div className="text-gray-700 leading-relaxed bg-white p-3 rounded border">
              {transcription}
            </div>
            <div className="flex justify-between items-center mt-2 text-sm text-green-600">
              <span>Transcribed on: {new Date().toLocaleString()}</span>
              <span>{transcription.split(' ').length} words</span>
            </div>
          </div>
        )}

        {/* Manual Audio Recording Section */}
        <div className="border-t pt-4 mt-4">
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            🎙️ Manual Audio Recording
          </h4>
          <p className="text-sm text-gray-600 mb-3">
            Record audio separately if video audio quality is poor
          </p>
          <AudioRecorder onTranscriptionComplete={setTranscription} />
        </div>

        {/* Transcription History */}
        {transcriptionHistory.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              📚 Recent Transcriptions
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {transcriptionHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => loadHistoryItem(item)}
                  className="p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm text-gray-600 truncate">
                    {item.text.substring(0, 80)}...
                  </div>
                  <div className="text-xs text-gray-400">{item.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transcription Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h5 className="font-semibold text-blue-800 mb-1">💡 Tips for Better Transcription</h5>
          <ul className="text-sm text-blue-700 list-disc list-inside space-y-1">
            <li>Ensure good audio quality in the video</li>
            <li>Speak clearly and at a moderate pace</li>
            <li>Minimize background noise when recording</li>
            <li>Use manual recording for better accuracy if needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Enhanced IssueDetail component with integrated transcriber
const IssueDetail = () => {
  // ... (previous IssueDetail component code)
  
  // Add the VideoTranscriber component to the main content
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-6">
      {/* Mobile Layout */}
      <div className="lg:hidden space-y-4 px-4">
        {/* Header and other components... */}
        
        {/* 1. Video Section - Now with integrated transcriber */}
        <VideoTranscriber videoUrl={videoUrl} />
        
        {/* Rest of the components... */}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Video Section with Transcriber */}
              <VideoTranscriber videoUrl={videoUrl} />
              
              {/* Map Section and other components... */}
            </div>
            
            {/* Sidebar */}
            <div className="space-y-8">
              {/* Sidebar components... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Utility function for actual API integration (example)
const transcribeWithGoogleSpeech = async (audioBlob) => {
  // This is a placeholder for actual Google Speech-to-Text API integration
  /*
  const response = await fetch('https://speech.googleapis.com/v1/speech:recognize', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      config: {
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: 'en-US',
      },
      audio: {
        content: await blobToBase64(audioBlob),
      },
    }),
  });
  
  const data = await response.json();
  return data.results.map(result => result.alternatives[0].transcript).join('\n');
  */
};

const blobToBase64 = (blob) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.readAsDataURL(blob);
  });
};

export default VideoTranscriber;
export { IssueDetail };