import { Outlet } from "react-router-dom";
import '../index.css'; // Import the global CSS

const Root = (props) => {
  return (
    <div>
      <Outlet /> {/* This renders child routes */}
    </div>
  );
}

export default Root;