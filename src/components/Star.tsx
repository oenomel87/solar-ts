interface Props {
  radius: number;
  width: number;
  height: number;
}

const Star: React.FC<Props> = ({ radius, width, height }) => {
  return (
    <mesh>
      <sphereGeometry args={[radius, width, height]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  );
}

export default Star;