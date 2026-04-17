import { useEffect, useRef, useState } from "react";
import mqtt from "mqtt";
import "./App.css";

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

      client.subscribe("socket/current1");
      client.subscribe("socket/current2");
      client.subscribe("socket/current3");

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

  const calculateCurrent = (adc) => {
      const Vref = 5.0;
      const Vout = (adc * Vref) / 4095;
      const Voffset = Vout / 2;
      const current = (Vout - Voffset) / 0.185;

      return current.toFixed(2); // 2 decimal places
};
  const Card = ({ id, current, gate }) => (
    <div className="card">
      <h3>Socket {id}</h3>

      <div className="btn-group">
        <button onClick={() => turnOn(id)} className="btn btn-on">ON</button>
        <button onClick={() => turnOff(id)} className="btn btn-off">OFF</button>
      </div>

      <p className="current">⚡ Current: {calculateCurrent(current)} A</p>

      <p className={`status ${gate === "ON" ? "status-on" : "status-off"}`}>
        {gate}
      </p>
    </div>
  );

  return (
    <div className="container">

      <h1 className="title">⚡ Smart IoT Socket Dashboard</h1>

      <div className="grid">
        <Card id={1} current={current1} gate={gate1} />
        <Card id={2} current={current2} gate={gate2} />
        <Card id={3} current={current3} gate={gate3} />
      </div>

    </div>
  );
}

export default App;