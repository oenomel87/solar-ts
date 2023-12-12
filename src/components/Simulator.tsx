import { useState } from "react";
import Planet from "../types/planet";
import { useFrame } from "@react-three/fiber";
import PlanetContainer from "./planet/PlanetContainer";
import { OrbitControls } from "@react-three/drei";
import Star from "./Star";

interface Props {
  planets: Planet[];
  speed: number;
}

const Simulator: React.FC<Props> = ({planets, speed}) => {
  const [simulationTime, setSimulationTime] = useState<number>(0);
  const planetContainers = planets.map(p => <PlanetContainer key={p.planet} planet={p} simulationTime={simulationTime} speed={speed} />);

  useFrame(({ clock }) => {
    // 시뮬레이션의 전체 시간을 업데이트합니다.
    setSimulationTime(clock.getElapsedTime());
  });

  return (
    <>
      <ambientLight intensity={1.0} />
      <pointLight position={[10, 10, 10]} />
      <Star radius={10} width={32} height={32} />
      {planetContainers}
      <OrbitControls />
    </>
  );
}

export default Simulator;
