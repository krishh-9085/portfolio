import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import mediscript from "../../Assets/Projects/mediscript.png";
import skillsight from "../../Assets/Projects/skillsight.png";
import infobuddy from "../../Assets/Projects/infobuddy.png";
import sudoku from "../../Assets/Projects/sudoku.png";
import pocket from "../../Assets/Projects/pocket.png";
import board from "../../Assets/Projects/board.png";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={skillsight}  // replace with your project thumbnail/import
              isBlog={false}
              title="SkillSight - AI Resume Analyzer"
              description="SkillSight is an AI-powered Resume Analyzer that helps users evaluate and enhance their resumes. Built with Next.js and Puter for seamless backend integration, it features a modern surface glass design for a clean and interactive UI. The app provides instant analysis, skill insights, and improvement suggestions to make resumes more impactful."
              ghLink="https://github.com/krishh-9085/SkillSight-Resume-Analyzer"
              demoLink="https://ai-resume-analyzer-livid.vercel.app/"
              tech={["Next.js","Puter","Tailwind","OpenAI"]}
            />
          </Col>


          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={sudoku}  // replace with your project thumbnail/import
                isBlog={false}
                title="Sudoku Solver"
                description="An interactive Sudoku Solver built with a backtracking algorithm to efficiently solve puzzles. The app features three difficulty modes (Easy, Medium, Hard) that fetch puzzles dynamically from an API. Users can play, reset, and instantly solve Sudoku puzzles with a simple, user-friendly interface."
                ghLink="https://github.com/krishh-9085/Sudoku-Solver"
                demoLink="https://game-sudoku-solver.vercel.app/"
                tech={["React","Backtracking","API","CSS"]}
            />
          </Col>


          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={infobuddy}  // replace with your project thumbnail/import
                isBlog={false}
                title="InfoBuddy - College Chatbot"
                description="InfoBuddy is an AI-powered chatbot designed to answer student queries related to Guru Gobind Singh Indraprastha University (GGSIPU). Built using Streamlit, ChromaDB, LangChain, and Groq, it provides quick and reliable responses about admissions, fee structures, academics, and other university-related information through an easy-to-use interface."
                ghLink="https://github.com/krishh-9085/InfoBuddy"
                demoLink=""  // add live link if deployed
                tech={["Streamlit","ChromaDB","LangChain","Groq"]}
            />
          </Col>


          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={pocket}  // replace with your project thumbnail/import
                isBlog={false}
                title="Pocket-Budget Tracker"
                description="Pocket-Budget Tracker is a Flutter-based mobile app to manage and track daily expenses. It allows users to record transactions with categories and colors, visualize spending patterns using pie charts, and securely store data with local SQLite storage. The app provides a simple yet effective way for students and individuals to manage their personal finances."
                ghLink="https://github.com/krishh-9085/Pocket-Budget_Tracker"
                demoLink="" // add live link if you publish it on Play Store / web
                tech={["Flutter","Dart","SQLite","Charts"]}
            />
          </Col>


          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={board}  // replace with your project thumbnail/import
                isBlog={false}
                title="Virtual Writing Board"
                description="A gesture-controlled Virtual Writing Board that lets users draw and erase using hand movements captured by the webcam. Built with OpenCV, MediaPipe, and NumPy, it enables color selection through pinching gestures, drawing with the index finger, and erasing by opening the hand. Features include multiple color options, clear board functionality, and support for multiple cameras."
                ghLink="https://github.com/krishh-9085/Virtual_board"
                demoLink="" // not deployed since it's a Python app
                tech={["OpenCV","MediaPipe","NumPy","Python"]}
            />
          </Col>


          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={mediscript}  // replace with your project thumbnail/import
                isBlog={false}
                title="MediScript - AI Clinical Documentation"
                description="MediScript is an AI-powered medical assistant that transcribes doctor-patient consultations and generates structured SOAP notes within seconds. Built with Flask, Whisper ASR, and HuggingFace Transformers, it supports audio input, accurate speech-to-text transcription, and clinical text generation. The platform features a modern glassmorphic UI for seamless user experience."
                ghLink="https://github.com/krishh-9085/MediScript"
                demoLink="" // add live link if deployed
                tech={["Flask","Whisper","Transformers","Python"]}
            />
          </Col>

        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
