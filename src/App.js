import Header from "./components/elements/Header";
import Init from "./pages/Init";
import History from "./pages/History";
import HomeForm from "./pages/HomeForm";
import FilterQRs from "./pages/FilterQRs";

import { ToastContainer } from "react-toastify";

import { Routes, Route } from "react-router-dom";
import Provider from "./provider/Provider";

function App() {
  const routes = [
    { path: "/", element: <Init /> },
    { path: "/Home", element: <HomeForm /> },
    { path: "/Examples", element: <History /> },
    { path: "/FilterQRs", element: <FilterQRs /> }
  ];

  // remove right click
  document.oncontextmenu = () => false

  // remove scroll default action
  window.onkeydown = function(e) {
    return !( (e.key == ' ' | e.key == 'ArrowUp' | e.key == 'ArrowDown' ) && e.target == document.body);
  };

  return (
    <Provider>
      <div className="App-header">
        <Header />
        <Routes>
          {routes.map((route, index) => (
            <Route key={index} path={route.path} element={route.element} />
          ))}
        </Routes>
      </div>
      <ToastContainer />
    </Provider>
  );
}


export default App;