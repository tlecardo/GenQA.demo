import { Navbar, Nav, Button } from 'react-bootstrap';
import AppContext from '../../context/AppContext';
import React, { useContext, useState, useEffect } from 'react';
import { Motion, spring } from 'react-motion';


function Header() {

  const { api, state } = useContext(AppContext);
  const [displayHeader, changeDisplay] = useState(true)

  useEffect(() => {
    let cur_node = document.getElementById("header")
    if (cur_node) {
      cur_node.addEventListener("mouseover", () => {
        changeDisplay(true);
        setTimeout(() => changeDisplay(false), 2000);
      });
    }
    setTimeout(() => changeDisplay(false), 5000);
  }, [])

  return (
    <Motion defaultStyle={{ x: 4 }} style={{ x: spring(displayHeader ? 4 : 1) }}>
      {value =>
        <Navbar
          id="header"
          className="bg-body-tertiary"
          style={{ backgroundColor: "#38A3A5", borderBottom: "solid 0.2rem #57CC99", height: value.x + "rem" }}>
          <>
            {value.x > 3 ?
              <>
                <Navbar.Brand href="/" style={{ margin: "0rem 1rem", width: "6rem" }}>
                  <img
                    alt=""
                    src="https://cdn-icons-png.flaticon.com/512/2936/2936725.png"
                    width="35"
                    className="d-inline-block align-top"
                    style={{ marginRight: ".5rem", cursor: "pointer", alignSelf: "center" }}
                  />
                  GenQA
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="me-auto">
                    <Nav.Link href="#Home">{state.language.homeText()}</Nav.Link>
                    <Nav.Link href="#Examples">{state.language.exampleText()}</Nav.Link>
                  </Nav>
                </Navbar.Collapse>
                <Navbar.Collapse className="justify-content-end">
                  <Button
                    variant="secondary"
                    style={{ marginRight: "0.2rem" }}
                    onClick={api.switchCluster}
                    disabled={state.dataParser !== null}
                  >{state.multiClusering ? "MultiCluster" : "MonoCluster"}</Button>
                  <Button
                    variant="secondary"
                    style={{ marginRight: "1rem" }}
                    onClick={api.switchLanguage}
                    disabled={state.dataParser !== null}
                  >{state.language.language}</Button>
                </Navbar.Collapse>
              </>
              :
              <div></div>
            }
          </>
        </Navbar>
      }
    </Motion>
  );
}

export default Header;