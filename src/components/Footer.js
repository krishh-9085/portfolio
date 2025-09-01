import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  AiFillGithub,
  AiFillInstagram,
  AiOutlineMail,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <Container fluid className="footer" role="contentinfo" aria-label="Site footer">
      <Row>
        <Col md="4" className="footer-copywright">
          <h3 title="Credits">Designed and developed by Krishna Rohilla</h3>
        </Col>
        <Col md="4" className="footer-copywright">
          <h3 aria-label={`Copyright ${year}`}>© {year} KR</h3>
        </Col>
        <Col md="4" className="footer-body">
          <ul className="footer-icons" aria-label="Social links">
            <li className="social-icons">
              <a
                href="https://github.com/krishh-9085"
                aria-label="GitHub profile"
                style={{ color: "white" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AiFillGithub />
              </a>
            </li>
            <li className="social-icons">
              <a
                href="mailto:rohillakrish2@gmail.com"
                aria-label="Send an email"
                style={{ color: "white" }}
                rel="noopener noreferrer"
              >
                <AiOutlineMail size={20} />
              </a>
            </li>
            <li className="social-icons">
              <a
                href="https://www.linkedin.com/in/krishna-rohilla/"
                aria-label="LinkedIn profile"
                style={{ color: "white" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
            </li>
            <li className="social-icons">
              <a
                href="https://www.instagram.com/krishxpvtt"
                aria-label="Instagram profile"
                style={{ color: "white" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <AiFillInstagram />
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
