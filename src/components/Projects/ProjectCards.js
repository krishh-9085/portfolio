import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { CgWebsite } from "react-icons/cg";
import { BsGithub } from "react-icons/bs";

function ProjectCards(props) {
  const { imgPath, title, description, ghLink, demoLink, isBlog, tech } = props;

  return (
    <Card className="project-card-view">
      <div className="project-card-header">
        <Card.Img variant="top" src={imgPath} alt={`${title} thumbnail`} />
      </div>
      <Card.Body>
        <Card.Title as="h3" className="project-card-title">
          {title}
        </Card.Title>

        {Array.isArray(tech) && tech.length > 0 && (
          <div className="project-tech-list" aria-label="Technologies used">
            {tech.map((t, idx) => (
              <span className="project-tech-badge" key={`${title}-tech-${idx}`}>{t}</span>
            ))}
          </div>
        )}

        <Card.Text className="project-card-text">
          {description}
        </Card.Text>

        <div className="project-card-actions">
          <Button
            variant="primary"
            className="project-btn"
            href={ghLink}
            target="_blank"
            rel="noreferrer"
            aria-label={`${title} ${isBlog ? "Blog" : "GitHub"} link`}
          >
            <BsGithub aria-hidden="true" /> &nbsp;{isBlog ? "Blog" : "GitHub"}
          </Button>

          {!isBlog && demoLink && (
            <Button
              variant="primary"
              className="project-btn"
              href={demoLink}
              target="_blank"
              rel="noreferrer"
              aria-label={`${title} Demo link`}
            >
              <CgWebsite aria-hidden="true" /> &nbsp;Demo
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}
export default ProjectCards;
