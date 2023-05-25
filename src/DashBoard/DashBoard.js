import React, { useState } from "react";
import "./DashBoard.css";
import {
  Container,
  Row,
  Col,
  Breadcrumb
} from "react-bootstrap";
import Navigation from "../Navbar/Navigation";
import PageNavigation from "../Navbar/pageNavigation";
import SideBar from "../Navbar/SideBar";
import { route } from "../redux/actions"
import { useDispatch } from "react-redux";
import { OnScrollEvent } from "../redux/actions";

function DashBoard() {
  const dispatch = useDispatch();

  const onUserScrollView = () => {
    dispatch(OnScrollEvent());
  }

  if (localStorage.getItem("userToken")) {
    return (
      <div className="dashboard">
        <Container fluid="true" onScroll={() => onUserScrollView()} >
          <Navigation />
          <Row style={{ marginLeft: "0", marginRight: "0" }}>
            <SideBar />
            <Col lg={10} style={{ paddingLeft: "0", paddingRight: "0", height: "200%" }}>
              <PageNavigation />
            </Col>
          </Row>
        </Container>
      </div >
    );
  }
  else {
    dispatch(route('login'));
  }
}

export default DashBoard;
