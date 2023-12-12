import { useRef } from "react";
import Planet from "../../types/planet";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

interface Props {
  planet: Planet;
  simulationTime: number;
  speed: number;
}

function getPosition(planet: Planet, simulationTime: number, speed: number): number[] {
  const {semiMajorAxis, eccentricity = 0, inclination, longitudeOfAscendingNode, argumentOfPeriapsis} = planet;
  const time = simulationTime * speed;
  const orbitPeriod = Math.pow(semiMajorAxis, 1.5);
  const meanAnomaly = time / orbitPeriod * Math.PI * 2;

  // 이심이각 계산을 위한 간단한 근사
  let eccentricAnomaly = meanAnomaly;
  for (let j = 0; j < 100; j++) { // 반복 계산을 통한 정확도 향상
    eccentricAnomaly = meanAnomaly + eccentricity * Math.sin(eccentricAnomaly);
  }

  const trueAnomaly = 2 * Math.atan2(
    Math.sqrt(1 + eccentricity) * Math.sin(eccentricAnomaly / 2),
    Math.sqrt(1 - eccentricity) * Math.cos(eccentricAnomaly / 2)
  );
  const distance = semiMajorAxis * (1 - eccentricity * Math.cos(eccentricAnomaly));
  let x = distance * Math.cos(trueAnomaly);
  let y = distance * Math.sin(trueAnomaly) * Math.sin(inclination);
  let z = distance * Math.sin(trueAnomaly) * Math.cos(inclination);
  
  // 승교점 경도에 따른 회전
  const ascendingNodeRotatedX = x * Math.cos(longitudeOfAscendingNode) - z * Math.sin(longitudeOfAscendingNode);
  const ascendingNodeRotatedZ = x * Math.sin(longitudeOfAscendingNode) + z * Math.cos(longitudeOfAscendingNode);

  // 근일점 편각에 따른 추가 회전
  const rotatedX = ascendingNodeRotatedX * Math.cos(argumentOfPeriapsis) - ascendingNodeRotatedZ * Math.sin(argumentOfPeriapsis);
  const rotatedZ = ascendingNodeRotatedX * Math.sin(argumentOfPeriapsis) + ascendingNodeRotatedZ * Math.cos(argumentOfPeriapsis);
  return [rotatedX, y, rotatedZ];
}

const Planet: React.FC<Props> = ({planet, simulationTime, speed}) => {
  const ref = useRef<Mesh>(null);

  useFrame(() => {
    const [rotatedX, y, rotatedZ] = getPosition(planet, simulationTime, speed);

    if(ref.current) {
      ref.current.position.set(rotatedX, y, rotatedZ);
    }
  });

  return (
    <mesh ref={ref} position={[planet.semiMajorAxis * (1 - planet.eccentricity), 0, 0]}>
      <sphereGeometry args={[planet.radius, 32, 32]} />
      <meshStandardMaterial color={planet.color} />
    </mesh>
  )
}

export default Planet;
