import { useState } from 'react'
import './App.css'
import Planet from './types/planet';
import { Canvas } from '@react-three/fiber';
import Simulator from './components/Simulator';

function App() {
  const [speed, setSpeed] = useState<number>(100);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const addPlanet = (planet: Planet) => {
    setPlanets([ ... planets, planet ]);
  }

  return (
    <div>
      <div className="canvas-container">
        <Canvas camera={{ position: [120, 120, 30], fov: 60 }} style={{ backgroundColor: 'black' }}>
          <Simulator planets={planets} speed={speed} />
        </Canvas>
      </div>
    </div>
  );
}

export default App
