import React, { useEffect, useState } from "react"
import { Container, Card, Col, Row, CardColumns, CardGroup, Breadcrumb, Button } from "react-bootstrap";

async function Home() {
    const [generalAPI, setgeneralAPI] = useState();
    const [apiReceived, setapiReceived] = useState(false);
    const [newsData, setnewsData] = useState([]);
    const [isCountrySuggestied, setisCountrySuggested] = useState(false);
    const [countrySuggestions, setcountrySuggestions] = useState([]);
    const [defaultCountryValue, setdefaultCountryValue] = useState("");

    const fetchNews = () => {
        fetch("https://bing-news-search1.p.rapidapi.com/news?safeSearch=Strict&textFormat=Raw", {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "bing-news-search1.p.rapidapi.com",
                "x-rapidapi-key": "9c0b8ec9f2msh082db76641e74e1p195d92jsn0d30e44fb4d2",
                "x-bingapis-sdk": "true"
            }
        })
            .then(response => {
                return response.json()
            }).then(responseData => {
                console.log("response", responseData.value);
                localStorage.setItem('news', JSON.stringify(responseData.value));
                setnewsData(responseData.value);
            })
            .catch(err => {
                console.log(err);
            });
    }

    const fetchCountryList = () => {
        await fetch(`https://rapidapi.p.rapidapi.com/countries`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "covid-193.p.rapidapi.com",
                "x-rapidapi-key": "9c0b8ec9f2msh082db76641e74e1p195d92jsn0d30e44fb4d2"
            }
        })
            .then(res => {
                return res.json()
            }).then((response) => {
                localStorage.setItem('countryList', JSON.stringify(response.response))
                setcountrySuggestions(true);
            })
            .catch(err => {
                console.error(err);
            });
    }

    const fetchCovidData = (country = "Canada") => {
        fetch(`https://rapidapi.p.rapidapi.com/statistics?country=${country}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-host": "covid-193.p.rapidapi.com",
                "x-rapidapi-key": "9c0b8ec9f2msh082db76641e74e1p195d92jsn0d30e44fb4d2"
            }
        })
            .then(res => {
                return res.json()
            }).then((response) => {
                localStorage.setItem('covid-basics', JSON.stringify(response));
                setgeneralAPI(response);
                setapiReceived(true);
            })
            .catch(err => {
                console.error(err);
            });
    }

    const getCountrySuggestionList = (e) => {
        var countryList = JSON.parse(localStorage.getItem('countryList'));
        var countrySuggestionsList = countryList.filter(countrySuggestion => {
            return countrySuggestion.toLowerCase().includes(e.target.value.toLowerCase());
        });

        setcountrySuggestions(countrySuggestionsList);
        setisCountrySuggested(true);
        setdefaultCountryValue(e.target.value);
    }

    useEffect(() => {

        if (localStorage.getItem('covid-basics') && (localStorage.getItem('news')) && (localStorage.getItem('countryList'))) {
            setgeneralAPI(JSON.parse(localStorage.getItem('covid-basics')));
            setapiReceived(true);
            setnewsData(JSON.parse(localStorage.getItem('news')));
        }
        else {
            fetchCovidData();
            fetchNews();
            fetchCountryList();
        }
    }, [])

    const validateEscape = (e)=>{
        if (e.keyCode === 27){
            setisCountrySuggested(false);
        }
    }
    
    const selectedCountry = (data) => {
        setcountrySuggestions([]);
        setisCountrySuggested(false);
        fetchCovidData(data);
        setdefaultCountryValue(data);
    }

    return (
        <>
            <Container>
                <Row>
                    <Col >
                        <h5 className="text-primary mt-4">Covid-19 Tracker </h5>
                        <div className="text-center">
                            <input autoComplete="nope" onKeyDown={(e)=>validateEscape(e)} className="form-control align-items-center " value={defaultCountryValue} style={{ width: "30%" }} id="myInput" onChange={(e) => getCountrySuggestionList(e)} type="text" placeholder="Search Country!." />
                            <ul className="list-group scroll-auto home-list" id="myList">
                                {isCountrySuggestied ?
                                    <>
                                        {countrySuggestions.map((data, key) => {
                                            return (
                                                <li key={key} href="return false" style={{ cursor: "pointer" }} onClick={() => selectedCountry(data)} className="list-group-item">{data}</li>
                                            )
                                        })}
                                    </> : ""}
                            </ul>

                        </div>

                        <h3 className="text-danger mt-2 text-center"> {defaultCountryValue} covid cases </h3>
                        <CardGroup className="text-light">
                            <Card className="text-center rounded-border">
                                <Card.Body>
                                    <Card.Text className="font-recovered ">
                                        {apiReceived ? generalAPI.response[0].cases.recovered : ""}
                                    </Card.Text>
                                    Recovered
                                </Card.Body>
                            </Card>
                            <Card className="text-center rounded-border ml-3">
                                <Card.Body>
                                    <Card.Text className="font-active">
                                        {apiReceived ? generalAPI.response[0].cases.active : ""}
                                    </Card.Text>
                                     active
                                </Card.Body>
                            </Card>
                            <Card className="text-center rounded-border ml-3">
                                <Card.Body>
                                    <Card.Text className="font-deaths">
                                        {apiReceived ? generalAPI.response[0].deaths.total : ""}
                                    </Card.Text>
                                     deaths
                                </Card.Body>
                            </Card>
                        </CardGroup>
                        <Card className="text-center  text-light rounded-border mx-auto mt-4">
                            <Card.Body>
                                Critical:
                                    <Card.Text className="font-active">
                                    {apiReceived ? generalAPI.response[0].cases.critical : ""}
                                </Card.Text>
                                    Total Affected:
                                    <Card.Text className="font-active">
                                    {apiReceived ? generalAPI.response[0].cases.total : ""}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Col>
                    <h5 className="mt-4 text-primary"> News </h5>
                    <CardColumns>
                        {newsData.map((data, key) => {
                            return (
                                <>
                                    <Card
                                        text={"white"}
                                        className="mt-2 text-light rounded-border"
                                        key={key}
                                    >
                                        <Card.Body>
                                            <Card.Title text={"dark"}> {data.name}</Card.Title>
                                            <Card.Text>
                                                {data.description}
                                            </Card.Text>
                                            <Button variant="outline-warning" className="mt-2" href={newsData[key].url} target="_blank">Read More...</Button>
                                        </Card.Body>
                                    </Card>
                                </>
                            );
                        })}
                    </CardColumns>
                </Col>
            </Container>
        </>
    )
}

export default Home;