import "./ExploreContainer.css";

interface ContainerProps {
  children: any;
}

const ExploreContainer: React.FC<ContainerProps> = ({ children }) => {
  return <div className="container">{children}</div>;
};

export default ExploreContainer;
