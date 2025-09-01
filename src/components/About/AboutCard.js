import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi Everyone, I am <span className="purple">Krishna Rohilla </span>
            from <span className="purple"> Delhi, India.</span>
            <br />
            I am currently pursuing{" "}
            <span className="purple">B.Tech in AI & ML</span> (4th Year) at
            Vivekananda Institute of Professional Studies – Technical Campus.
            <br />
            <br />
            Apart from programming and tech, here are a few activities that I love:
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> Playing Guitar & Singing
            </li>
            <li className="about-activity">
              <ImPointRight /> Sketching
            </li>
            <li className="about-activity">
              <ImPointRight /> Going to the Gym
            </li>
          </ul>

          <p className="purple">
            "Keep building, keep learning, and keep growing!"{" "}
          </p>
          <footer className="blockquote-footer">Krishna</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
