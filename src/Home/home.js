// Home.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Card,
  Col,
  Row,
  CardColumns,
  CardGroup,
  Button,
} from "react-bootstrap";

/**
 * Requirements before using:
 *  - Set your NewsAPI key in env: REACT_APP_NEWSAPI_KEY=your_key
 *  - npm start / build as usual (create-react-app style env variable)
 *
 * Data sources:
 *  - COVID & countries: https://disease.sh (no API key)
 *  - News: https://newsapi.org (requires API key)
 */

const DISEASE_SH_COUNTRIES = "https://disease.sh/v3/covid-19/countries";
const NEWSAPI_TOP_HEADLINES = "https://newsapi.org/v2/top-headlines";
const NEWSAPI_KEY = process.env.REACT_APP_NEWSAPI_KEY || "821f3ca020904207bddf11cc2e59e451"; // set this in your .env

function Home() {
  const [covidData, setCovidData] = useState(null); // the selected country's covid object
  const [countriesList, setCountriesList] = useState([]); // [{country, countryInfo:{iso2}}...]
  const [newsArticles, setNewsArticles] = useState([]);
  const [queryCountryName, setQueryCountryName] = useState(""); // input value
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState({ covid: false, news: false, countries: false });

  // memo: map country name -> iso2 for quick lookup
  const countryNameToIso = useMemo(() => {
    const map = new Map();
    countriesList.forEach((c) => {
      // iso2 may be null for some entries; handle gracefully
      if (c && c.country) {
        map.set(c.country.toLowerCase(), (c.countryInfo && c.countryInfo.iso2) || "");
      }
    });
    return map;
  }, [countriesList]);

  // load cached or remote countries list
  const fetchCountries = async () => {
    setLoading((s) => ({ ...s, countries: true }));
    try {
      const cached = localStorage.getItem("countriesList");
      if (cached) {
        setCountriesList(JSON.parse(cached));
        setLoading((s) => ({ ...s, countries: false }));
        return;
      }

      const res = await fetch(DISEASE_SH_COUNTRIES);
      if (!res.ok) throw new Error(`Countries fetch failed ${res.status}`);
      const data = await res.json();
      // data is an array of country objects
      setCountriesList(data);
      localStorage.setItem("countriesList", JSON.stringify(data));
    } catch (err) {
      console.error("fetchCountries error:", err);
    } finally {
      setLoading((s) => ({ ...s, countries: false }));
    }
  };

  // fetch covid data for a country by name (disease.sh supports country name)
  const fetchCovidForCountry = async (countryName = "Canada") => {
    setLoading((s) => ({ ...s, covid: true }));
    try {
      const cacheKey = `covid-${countryName}`;
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        setCovidData(JSON.parse(cached));
      } else {
        // disease.sh supports /countries/{country}
        const url = `${DISEASE_SH_COUNTRIES}/${encodeURIComponent(countryName)}?strict=true`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`COVID fetch failed ${res.status}`);
        const data = await res.json();
        setCovidData(data);
        localStorage.setItem(cacheKey, JSON.stringify(data));
      }
    } catch (err) {
      console.error("fetchCovidForCountry error:", err);
      setCovidData(null);
    } finally {
      setLoading((s) => ({ ...s, covid: false }));
    }
  };

  // fetch news using NewsAPI by 2-letter country code (iso2 lowercase)
  const fetchNewsForIso2 = async (iso2) => {
    setLoading((s) => ({ ...s, news: true }));
    setNewsArticles([]);
    if (!NEWSAPI_KEY) {
      console.warn("No NewsAPI key provided. Set REACT_APP_NEWSAPI_KEY.");
      setLoading((s) => ({ ...s, news: false }));
      return;
    }

    if (!iso2) {
      // fallback: fetch global headlines (without country param)
      try {
        const url = new URL(NEWSAPI_TOP_HEADLINES);
        url.searchParams.set("apiKey", NEWSAPI_KEY);
        url.searchParams.set("pageSize", "12");
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`News fetch failed ${res.status}`);
        const json = await res.json();
        setNewsArticles(json.articles || []);
      } catch (err) {
        console.error("fetchNewsForIso2 (global) error:", err);
      } finally {
        setLoading((s) => ({ ...s, news: false }));
      }
      return;
    }

    try {
      const url = new URL(NEWSAPI_TOP_HEADLINES);
      url.searchParams.set("country", iso2.toLowerCase()); // 'us','ca' etc.
      url.searchParams.set("apiKey", NEWSAPI_KEY);
      url.searchParams.set("pageSize", "12");
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`News fetch failed ${res.status}`);
      const json = await res.json();
      setNewsArticles(json.articles || []);
    } catch (err) {
      console.error("fetchNewsForIso2 error:", err);
      setNewsArticles([]);
    } finally {
      setLoading((s) => ({ ...s, news: false }));
    }
  };

  // search suggestions (simple client-side filter)
  const onCountryInputChange = (e) => {
    const val = e.target.value;
    setQueryCountryName(val);
    if (!val) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const lower = val.toLowerCase();
    const matches = countriesList
      .filter((c) => c && c.country && c.country.toLowerCase().includes(lower))
      .slice(0, 12); // limit
    setSuggestions(matches);
    setShowSuggestions(true);
  };

  const onSelectCountry = (countryName) => {
    setQueryCountryName(countryName);
    setShowSuggestions(false);
    fetchCovidForCountry(countryName);
    const iso2 = countryNameToIso.get(countryName.toLowerCase()) || "";
    fetchNewsForIso2(iso2);
  };

  // hide suggestions on Escape
  const onKeyDown = (e) => {
    if (e.key === "Escape") setShowSuggestions(false);
  };

  // initial load: countries list, default country covid + news
  useEffect(() => {
    const init = async () => {
      await fetchCountries();
      // try to restore last selected country
      const lastCountry = localStorage.getItem("lastCountry") || "Canada";
      setQueryCountryName(lastCountry);
      await fetchCovidForCountry(lastCountry);
      const iso2 = countryNameToIso.get(lastCountry.toLowerCase()) || "";
      await fetchNewsForIso2(iso2);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // when covidData changes, store last country
  useEffect(() => {
    if (covidData && covidData.country) {
      localStorage.setItem("lastCountry", covidData.country);
    }
  }, [covidData]);

  // rendering helpers (safe optional chaining for older browsers)
  const displayNumber = (num) => (num === null || num === undefined ? "-" : num);

  return (
    <Container className="mt-3">
      <Row>
        <Col>
          <h5 className="text-primary mt-2">Covid-19 Tracker</h5>

          <div className="text-center mb-2" style={{ position: "relative" }}>
            <input
              autoComplete="off"
              onKeyDown={onKeyDown}
              className="form-control d-inline-block"
              value={queryCountryName}
              style={{ width: "30%" }}
              onChange={onCountryInputChange}
              type="text"
              placeholder="Search Country..."
              aria-label="Search country"
            />

            {showSuggestions && suggestions.length > 0 && (
              <ul
                className="list-group home-list"
                style={{
                  position: "absolute",
                  left: "35%",
                  top: "40px",
                  width: "30%",
                  maxHeight: "220px",
                  overflowY: "auto",
                  zIndex: 999,
                }}
                role="listbox"
              >
                {suggestions.map((c, idx) => (
                  <li
                    key={idx}
                    className="list-group-item list-group-item-action"
                    style={{ cursor: "pointer" }}
                    onClick={() => onSelectCountry(c.country)}
                    role="option"
                  >
                    {c.country}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <h3 className="text-danger mt-2 text-center">
            {covidData?.country ? `${covidData.country} COVID cases` : "Loading..."}
          </h3>

          <CardGroup className="text-light mb-3">
            <Card className="text-center rounded-border">
              <Card.Body>
                <Card.Text className="font-recovered">
                  {displayNumber(covidData?.recovered ?? covidData?.cases?.recovered)}
                </Card.Text>
                Recovered
              </Card.Body>
            </Card>

            <Card className="text-center rounded-border ml-3">
              <Card.Body>
                <Card.Text className="font-active">
                  {displayNumber(covidData?.active ?? covidData?.cases?.active)}
                </Card.Text>
                Active
              </Card.Body>
            </Card>

            <Card className="text-center rounded-border ml-3">
              <Card.Body>
                <Card.Text className="font-deaths">
                  {displayNumber(covidData?.deaths ?? covidData?.deaths?.total)}
                </Card.Text>
                Deaths
              </Card.Body>
            </Card>
          </CardGroup>

          <Card className="text-center text-light rounded-border mx-auto mt-2 p-2">
            <Card.Body>
              <div>
                <strong>Critical:</strong>{" "}
                <span className="font-active">
                  {displayNumber(covidData?.critical ?? covidData?.cases?.critical)}
                </span>
              </div>
              <div>
                <strong>Total Affected:</strong>{" "}
                <span className="font-active">{displayNumber(covidData?.cases?.total ?? covidData?.cases)}</span>
              </div>
              <div style={{ marginTop: 8 }}>
                <small className="text-muted">
                  {loading.covid ? "Updating..." : covidData?.updated ? `Last updated: ${new Date(covidData.updated).toLocaleString()}` : ""}
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <h5 className="text-primary">News</h5>
          {NEWSAPI_KEY ? (
            <CardColumns>
              {newsArticles.length === 0 ? (
                <div>{loading.news ? "Loading news..." : "No articles found."}</div>
              ) : (
                newsArticles.map((article, idx) => (
                  <Card text="white" className="mt-2 text-light rounded-border" key={idx}>
                    <Card.Body>
                      <Card.Title>{article.title}</Card.Title>
                      <Card.Text>{article.description}</Card.Text>
                      <Button variant="outline-warning" href={article.url} target="_blank" rel="noreferrer">
                        Read More...
                      </Button>
                    </Card.Body>
                  </Card>
                ))
              )}
            </CardColumns>
          ) : (
            <div className="alert alert-warning">
              No NewsAPI key detected. Set <code>REACT_APP_NEWSAPI_KEY</code> in your environment to fetch news.
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
