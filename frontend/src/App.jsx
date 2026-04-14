import { useEffect, useRef, useState } from "react";
import mqtt from "mqtt";
import './App.css';
import GaugeComponent from "react-gauge-component";

function App() {
  const [current1, setCurrent1] = useState(0);
  const [current2, setCurrent2] = useState(0);
  const [current3, setCurrent3] = useState(0);
  const [current4, setCurrent4] = useState(0);
  const clientRef = useRef(null);
  const [error,setError] = useState(false);

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
      console.log("✅ Connected to MQTT");
      client.subscribe("socket/current1");
      client.subscribe('socket/current2');
      client.subscribe('socket/current3');
      client.subscribe('socket/current4');
    });

    client.on("message", (topic, message) => {
      if (topic === "socket/current1") {
        setCurrent1(message.toString());
      }
      else if(topic === "socket/current2"){
        setCurrent2(message.toString());
      }
      else if(topic === "socket/current3"){
        setCurrent3(message.toString());
      }
      else if(topic === "socket/current4"){
        setCurrent4(message.toString());
      }
      else{
        setError(true);
      }
    });

    client.on("error", (err) => {
      console.error("❌ Error:", err);
    });

  }, []);

  // ✅ Now accessible everywhere
  const turnOn = (id) => {
    clientRef.current.publish(`socket/control${id}`, "ON");
  };

  const turnOff = (id) => {
    clientRef.current.publish(`socket/control${id}`, "OFF");
  };

 return (
  <div className="container">
    <h1 className="title">IoT Smart Socket</h1>

    <div className="button-group">
      <div className="button">
          <h3>SOCKET 1 CONTROLS</h3>
          <button className="on_button" onClick={()=>turnOn(1)}>ON</button>
          <button className="off_button" onClick={()=>turnOff(1)}>OFF</button>
          <h2 className="current">Current: {current1} A</h2>
      </div>
      <div className="button">
          <h3>SOCKET 2 CONTROLS</h3>
          <button className="on_button" onClick={()=>turnOn(2)}>ON</button>
          <button className="off_button" onClick={()=>turnOff(2)}>OFF</button>
          <h2 className="current">Current: {current2} A</h2>
      </div>
      <div className="button">
          <h3>SOCKET 3 CONTROLS</h3>
          <button className="on_button" onClick={()=>turnOn(3)}>ON</button>
          <button className="off_button" onClick={()=>turnOff(3)}>OFF</button>
          <h2 className="current">Current: {current3} A</h2>
      </div>
      <div className="button">
          <h3>SOCKET 4 CONTROLS</h3>
          <button className="on_button" onClick={()=>turnOn(4)}>ON</button>
          <button className="off_button" onClick={()=>turnOff(4)}>OFF</button>
          <h2 className="current">Current: {current4} A</h2>
      </div>
      {error && <p>error,please click again</p>}
    </div>
  </div>
);
}

export default App;