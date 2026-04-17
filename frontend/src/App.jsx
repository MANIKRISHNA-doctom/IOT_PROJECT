import { useEffect, useRef, useState } from "react";
import mqtt from "mqtt";
import './App.css';

function App() {

  const [current1, setCurrent1] = useState(0);
  const [current2, setCurrent2] = useState(0);
  const [current3, setCurrent3] = useState(0);

  const [gate1, setGate1] = useState("OFF");
  const [gate2, setGate2] = useState("OFF");
  const [gate3, setGate3] = useState("OFF");

  const clientRef = useRef(null);

  useEffect(() => {
    const client = mqtt.connect(
      "wss://5bbc3f94143f4a58baffa166ba297706.s1.eu.hivemq.cloud:8884/mqtt",
      {
        username: "Mani_krishna",
        password: "Krish@1234",
      }
    );

    clientRef.current = client;

    client.on("connect", () => {
      console.log("Connected");

      // Current topics
      client.subscribe("socket/current1");
      client.subscribe("socket/current2");
      client.subscribe("socket/current3");

      // Status topics
      client.subscribe("socket/status1");
      client.subscribe("socket/status2");
      client.subscribe("socket/status3");
    });

    client.on("message", (topic, message) => {
      const value = message.toString();

      if (topic === "socket/current1") setCurrent1(Number(value));
      else if (topic === "socket/current2") setCurrent2(Number(value));
      else if (topic === "socket/current3") setCurrent3(Number(value));

      else if (topic === "socket/status1") setGate1(value);
      else if (topic === "socket/status2") setGate2(value);
      else if (topic === "socket/status3") setGate3(value);
    });

  }, []);

  const turnOn = (id) => {
    clientRef.current.publish(`socket/control${id}`, "ON");
  };

  const turnOff = (id) => {
    clientRef.current.publish(`socket/control${id}`, "OFF");
  };

  return (
  <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
    
    <h1 className="text-3xl font-bold mb-6 mt-20 text-black-600">
      IoT Smart Socket
    </h1>

    <div className="flex gap-6 flex-wrap justify-center">

      {/* SOCKET 1 */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-64 text-center">
        <h3 className="text-xl font-semibold mb-4">Socket 1</h3>

        <div className="flex justify-center gap-3 mb-4">
          <button 
            onClick={()=>turnOn(1)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            ON
          </button>

          <button 
            onClick={()=>turnOff(1)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            OFF
          </button>
        </div>

        <p className="text-gray-700">Current: {current1}</p>

        <p className={`mt-2 font-bold ${gate1 === "ON" ? "text-green-600" : "text-red-600"}`}>
          Status: {gate1}
        </p>
      </div>

      {/* SOCKET 2 */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-64 text-center">
        <h3 className="text-xl font-semibold mb-4">Socket 2</h3>

        <div className="flex justify-center gap-3 mb-4">
          <button 
            onClick={()=>turnOn(2)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            ON
          </button>

          <button 
            onClick={()=>turnOff(2)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            OFF
          </button>
        </div>

        <p className="text-gray-700">Current: {current2}</p>

        <p className={`mt-2 font-bold ${gate2 === "ON" ? "text-green-600" : "text-red-600"}`}>
          Status: {gate2}
        </p>
      </div>

      {/* SOCKET 3 */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-64 text-center">
        <h3 className="text-xl font-semibold mb-4">Socket 3</h3>

        <div className="flex justify-center gap-3 mb-4">
          <button 
            onClick={()=>turnOn(3)}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            ON
          </button>

          <button 
            onClick={()=>turnOff(3)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            OFF
          </button>
        </div>

        <p className="text-gray-700">Current: {current3}</p>

        <p className={`mt-2 font-bold ${gate3 === "ON" ? "text-green-600" : "text-red-600"}`}>
          Status: {gate3}
        </p>
      </div>

    </div>
  </div>
);
  
}

export default App;