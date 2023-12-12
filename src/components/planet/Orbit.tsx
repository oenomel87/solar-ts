import { Vector3 } from "three";
import Planet from "../../types/planet";
import { useMemo } from "react";
import { Line } from "@react-three/drei";

interface Props {
  planet: Planet;
  children: React.ReactNode;
}

function getPoints (planet: Planet): Vector3[] {
  const pts = [];
  const divisions = 1000;
  const {semiMajorAxis, eccentricity = 0, inclination, longitudeOfAscendingNode, argumentOfPeriapsis} = planet;

  for (let i = 0; i <= divisions; i++) {
    const meanAnomaly = (i / divisions) * Math.PI * 2;
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

    pts.push(new Vector3(rotatedX, y, rotatedZ));
  }
  return pts;
}

const Orbit: React.FC<Props> = ({planet, children}) => {
  const points = useMemo(() => getPoints(planet), [planet]);

  return (
    <>
      <Line points={points} color="white" lineWidth={1} />
      {children}
    </>
  );
};

export default Orbit;
