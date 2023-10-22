import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
    const canvasRef = useRef<HTMLCanvasElement>(
        null,
    ) as React.MutableRefObject<HTMLCanvasElement>;
    const [isDrawing, setIsDrawing] = useState(false);
    const [predictionResult, setPredictionResult] = useState('');
    const [confidence, setConfidence] = useState('');

    const startDrawing = () => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.beginPath();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.closePath();
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.lineWidth = 25;
        context.lineCap = 'round';
        context.strokeStyle = 'black';

        context.lineTo(
            e.clientX - canvas.getBoundingClientRect().left,
            e.clientY - canvas.getBoundingClientRect().top,
        );
        context.stroke();
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        setPredictionResult('');
        setConfidence('');
    };

    const predictDigit = async () => {
        try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image_data: canvasRef.current.toDataURL(),
                }),
            });
            const data = await response.json();
            console.log('Response from server:', data); // Log the entire response
            const predictedDigit = data.predicted_digit;
            const confidence = data.confidence;
            setPredictionResult(`Predicted Digit: ${predictedDigit}`);
            setConfidence(confidence);
        } catch (error) {
            console.error('Prediction failed:', error);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.addEventListener('mouseup', predictDigit);
        return () => {
            canvas.removeEventListener('mouseup', predictDigit);
        };
    }, []);

    return (
        <div
            className="bg-cover bg-blend-darken bg-center h-screen min-h-screen max-h-screen flex flex-col justify-center items-center pb-36"
            style={{ fontFamily: inter.family }}
        >
            <h1 className="font-bold text-center text-4xl text-black font-cursive py-16 opacity-90 hover:text-blue-800 transition-colors duration-500">
                Neural Network Digit Recognizer
            </h1>
            <div
                className="flex flex-row justify-center items-center"
                id="canvas"
            >
                <canvas
                    ref={canvasRef}
                    width="280"
                    height="280"
                    className="block mx-auto border-2 border-gray-700 bg-white opacity-90 shadow-2xl"
                    onMouseDown={startDrawing}
                    onMouseUp={stopDrawing}
                    onMouseMove={draw}
                    id="canvas"
                ></canvas>
            </div>
            <div
                className={`text-center text-xl font-cursive pt-8 pb-1 px-6 bg-white rounded-lg mx-auto w-1/2 opacity-0 ${
                    predictionResult && 'opacity-100'
                }`}
            >
                {predictionResult}
            </div>
            <div
                className={`text-center text-xl font-cursive pt-1 pb-5 px-6 bg-white rounded-lg mx-auto w-1/2 opacity-0 ${
                    confidence && 'opacity-100'
                }`}
            >
                {`Confidence: ${confidence}`}
            </div>
            <div className="flex flex-row justify-center items-center">
                <button
                    className="bg-red-800 text-white font-bold py-2 px-4 rounded-full shadow-2xl opacity-90 hover:bg-red-900 transition-colors duration-500"
                    onClick={clearCanvas}
                >
                    Reset
                </button>
            </div>
        </div>
    );
}
