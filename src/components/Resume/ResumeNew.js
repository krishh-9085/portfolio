import React, { useState, useEffect, useRef, useMemo } from "react";
import { Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Particle from "../Particle";
import pdf from "../../Assets/krishna_resume.pdf";
import { AiOutlineDownload } from "react-icons/ai";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ResumeNew() {
  const containerRef = useRef(null);
  const [viewportWidth, setViewportWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [numPages, setNumPages] = useState(null);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    function handleResize() {
      setViewportWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    // initial
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scale = useMemo(() => {
    // Base the scale on container width if available, else viewport width
    const baseWidth = containerRef.current?.offsetWidth || viewportWidth || 1200;
    // Assume PDF page is ~595pt wide (A4 @ 72dpi), react-pdf uses pixel scaling. Tweak for visual fit.
    const desired = Math.min(1.8, Math.max(0.5, baseWidth / 700));
    return desired;
  }, [viewportWidth]);

  function onDocumentLoadSuccess({ numPages: pages }) {
    setNumPages(pages);
    setLoadError(null);
  }

  function onDocumentLoadError(err) {
    setLoadError(err?.message || "Failed to load PDF.");
  }

  return (
    <Container fluid className="resume-section" ref={containerRef}>
      <Particle />

      <Row className="resume" aria-label="Resume preview">
        <Document
          file={pdf}
          className="d-flex justify-content-center"
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<div style={{color:'#fff', textAlign:'center'}}>Loading resume…</div>}
          error={<div style={{color:'#ffb3b3', textAlign:'center'}}>Unable to display the resume.</div>}
        >
          {!loadError && (
            <Page pageNumber={1} scale={scale} renderTextLayer={false} renderAnnotationLayer />
          )}
        </Document>
      </Row>

      <Row style={{ justifyContent: "center", position: "relative" }}>
        <Button
          variant="primary"
          href={pdf}
          target="_blank"
          rel="noopener noreferrer"
          style={{ maxWidth: "250px" }}
          aria-label="Download resume as PDF"
        >
          <AiOutlineDownload aria-hidden="true" />
          <span style={{ marginLeft: 8 }}>Download CV</span>
        </Button>
      </Row>

      {loadError && (
        <Row style={{ justifyContent: "center", marginTop: 16 }}>
          <a href={pdf} target="_blank" rel="noopener noreferrer" style={{ color: "#61dafb" }}>
            Open resume in a new tab
          </a>
        </Row>
      )}
    </Container>
  );
}

export default ResumeNew;
