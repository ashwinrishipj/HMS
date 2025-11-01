// MedicalDashboard.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Container, Row, Col, Card, CardGroup, Button, Modal } from "react-bootstrap";

// --- COVID DATA ---
const DISEASE_SH_COUNTRIES = "https://disease.sh/v3/covid-19/countries";

// --- MEDICAL CONDITION API (search) ---
const CLINICAL_TABLES_API = "https://clinicaltables.nlm.nih.gov/api/conditions/v3/search";

function MedicalDashboard() {
  // COVID state
  const [covidData, setCovidData] = useState(null);
  const [countriesList, setCountriesList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("Canada");

  // Medical condition search state
  const [conditionQuery, setConditionQuery] = useState("");
  const [conditions, setConditions] = useState([]);
  const [loadingConditions, setLoadingConditions] = useState(false);

  // Modal / detailed condition state
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [conditionDetails, setConditionDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Map country name -> iso2 code (optional)
  const countryNameToIso = useMemo(() => {
    const map = new Map();
    countriesList.forEach((c) => {
      if (c && c.country) map.set(c.country.toLowerCase(), c.countryInfo?.iso2 || "");
    });
    return map;
  }, [countriesList]);

  // Fetch all countries & set initial covid data
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(DISEASE_SH_COUNTRIES);
        const data = await res.json();
        setCountriesList(data);
        const initial = data.find((c) => c.country === selectedCountry);
        setCovidData(initial);
      } catch (err) {
        console.error("Error fetching COVID data:", err);
      }
    };
    fetchCountries();
  }, [selectedCountry]);

  // Search conditions using ClinicalTables API
  const searchConditions = async (query) => {
    if (!query) {
      setConditions([]);
      return;
    }
    setLoadingConditions(true);
    try {
      const url = new URL(CLINICAL_TABLES_API);
      url.searchParams.set("terms", query);
      url.searchParams.set("maxList", 12);
      const res = await fetch(url.toString());
      const json = await res.json();
      const matched = json[3] || [];
      setConditions(matched);
    } catch (err) {
      console.error("Error fetching conditions:", err);
      setConditions([]);
    } finally {
      setLoadingConditions(false);
    }
  };

  // Fetch details for selected condition using Wikipedia API
  const fetchConditionDetails = async (conditionName) => {
    setLoadingDetails(true);
    setConditionDetails(null);
    try {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(conditionName)}`;
      const res = await fetch(url);

      if (res.status === 404) {
        // Handle Wikipedia not found
        setConditionDetails({
          title: conditionName,
          summary: "No Wikipedia page found for this condition.",
          pageUrl: "",
          description: "",
          extractHtml: "",
        });
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();

      setConditionDetails({
        title: data.title,
        summary: data.extract,
        pageUrl: data.content_urls?.desktop?.page || "",
        description: data.description || "",
        extractHtml: data.extract_html || "",
      });
    } catch (err) {
      console.error("Error fetching condition details:", err);
      setConditionDetails({
        title: conditionName,
        summary: "No data found.",
        pageUrl: "",
        description: "",
        extractHtml: "",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCardClick = (cond) => {
    setSelectedCondition(cond);
    fetchConditionDetails(cond[0]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCondition(null);
    setConditionDetails(null);
  };

  const displayNumber = (num) => (num === null || num === undefined ? "-" : num);

  return (
    <Container className="mt-3">
      {/* COVID Section */}
      <Row>
        <Col>
          <h3 className="text-primary text-center">COVID‑19 Tracker</h3>
          <select
            className="form-control w-50 mb-3"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            {countriesList.map((c) => (
              <option key={c.country} value={c.country}>
                {c.country}
              </option>
            ))}
          </select>
        </Col>
      </Row>

      {/* COVID stats */}
      {covidData && (
        <Row className="mt-2">
          <Col>
            <CardGroup className="text-light mb-3">
              <Card className="text-center rounded-border">
                <Card.Body>
                  <Card.Text className="font-recovered display-4">
                    {displayNumber(covidData.recovered ?? covidData.cases?.recovered)}
                  </Card.Text>
                  Recovered
                </Card.Body>
              </Card>
              <Card className="text-center rounded-border ml-3">
                <Card.Body>
                  <Card.Text className="font-active display-4">
                    {displayNumber(covidData.active ?? covidData.cases?.active)}
                  </Card.Text>
                  Active
                </Card.Body>
              </Card>
              <Card className="text-center rounded-border ml-3">
                <Card.Body>
                  <Card.Text className="font-deaths display-4">
                    {displayNumber(covidData.deaths ?? covidData.cases?.deaths)}
                  </Card.Text>
                  Deaths
                </Card.Body>
              </Card>
            </CardGroup>
            <Card className="text-center rounded-border mt-2">
              <div style={{ marginTop: 0 }}>
                <small className="text-muted">
                  {covidData?.updated ? `Last updated: ${new Date(covidData.updated).toLocaleString()}` : ""}
                </small>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* Medical Condition Search */}
      <Row className="mt-4">
        <Col>
          <h3 className="text-success text-center">Medical Condition Explorer</h3>
          <input
            type="text"
            className="form-control w-50 mb-3"
            placeholder="Search for a disease or condition..."
            value={conditionQuery}
            onChange={(e) => {
              setConditionQuery(e.target.value);
              searchConditions(e.target.value);
            }}
          />
          {loadingConditions ? (
            <div>Loading conditions…</div>
          ) : (
            <div style={{ height: "450px", overflowY: "auto", overflowX: "hidden", marginBottom: "20px" }}>
              {conditions.map((cond, idx) => (
                <Row key={idx} className="mb-3">
                  <Col>
                    <Card
                      className="rounded-border p-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleCardClick(cond)}
                    >
                      <Card.Body>
                        <Card.Title>{cond[0]}</Card.Title>
                        {cond[1] && (
                          <Card.Text>
                            <strong>Synonyms:</strong> {cond[1].join(", ")}
                          </Card.Text>
                        )}
                        {cond[2] && (
                          <Card.Text>
                            <strong>Category:</strong> {cond[2]}
                          </Card.Text>
                        )}
                        <Card.Text className="text-muted">
                          Click to view more detailed info in a fullscreen modal
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              ))}
            </div>
          )}
        </Col>
      </Row>

      {/* Modal for condition details */}
      <Modal show={showModal} onHide={handleCloseModal} fullscreen scrollable>
        <Modal.Header closeButton>
          <Modal.Title>{conditionDetails?.title || selectedCondition?.[0]}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingDetails ? (
            <div>Loading details…</div>
          ) : conditionDetails ? (
            <>
              {conditionDetails.description && (
                <p><strong>Description:</strong> {conditionDetails.description}</p>
              )}
              {conditionDetails.summary && (
                <p><strong>Summary:</strong> {conditionDetails.summary}</p>
              )}
              {conditionDetails.extractHtml && (
                <div dangerouslySetInnerHTML={{ __html: conditionDetails.extractHtml }} />
              )}
              {conditionDetails.pageUrl && (
                <p>
                  <strong>Reference:</strong>{" "}
                  <a href={conditionDetails.pageUrl} target="_blank" rel="noreferrer">
                    Read full article on Wikipedia
                  </a>
                </p>
              )}
            </>
          ) : (
            <p>No details available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default MedicalDashboard;
