import PlanetType from "../../types/planet"
import Orbit from "./Orbit";
import Planet from "./Planet";

interface Props {
  planet: PlanetType;
  simulationTime: number;
  speed: number;
}

const PlanetContainer: React.FC<Props> = ({planet, simulationTime, speed}) => {
  return (
    <Orbit planet={planet}>
      <Planet planet={planet} simulationTime={simulationTime} speed={speed} />
    </Orbit>
  );
}

export default PlanetContainer;
