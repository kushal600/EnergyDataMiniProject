import "./App.css";
import WorldMap from "./components/WorldMap";
import TotalEnergy from "./components/TotalEnergy";
import RenewableEnergy from "./components/RenewableEnergy";
import NonRenewable from "./components/NonRenewable";
import Bar from "./components/Bar";
// import PieChartComponent from "./components/PieChartComponent";
function App() {
  return (
    <div className="App">
      <h1>Global Renewable Energy Visualization</h1>

      <WorldMap />
      {/* <PieChartComponent /> */}
      {/* <TotalEnergy/>
      <RenewableEnergy/>
      <NonRenewable /> */}
      <Bar/>
    </div>
  );
}

export default App;
