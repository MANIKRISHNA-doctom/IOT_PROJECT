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
    <div className="container">
      <h1>IoT Smart Socket</h1>

      <div className="button-group">

        {/* SOCKET 1 */}
        <div className="button">
          <h3>SOCKET 1</h3>
          <button onClick={()=>turnOn(1)}>ON</button>
          <button onClick={()=>turnOff(1)}>OFF</button>
          <p>Current: {current1}</p>
          <p>Status: {gate1}</p>
        </div>

        {/* SOCKET 2 */}
        <div className="button">
          <h3>SOCKET 2</h3>
          <button onClick={()=>turnOn(2)}>ON</button>
          <button onClick={()=>turnOff(2)}>OFF</button>
          <p>Current: {current2}</p>
          <p>Status: {gate2}</p>
        </div>

        {/* SOCKET 3 */}
        <div className="button">
          <h3>SOCKET 3</h3>
          <button onClick={()=>turnOn(3)}>ON</button>
          <button onClick={()=>turnOff(3)}>OFF</button>
          <p>Current: {current3}</p>
          <p>Status: {gate3}</p>
        </div>

      </div>
    </div>
  );
}

export default App;