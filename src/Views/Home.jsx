import React, { useState } from "react"
import { Accordion, Button, Form, InputGroup } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { fundamentals } from "../services/api"
import { notificationStore, searchStore } from "../state/store"

const Home = () => {
  const [symbol, setSymbol] = useState("")

  const state = searchStore((state) => state.searchs)

  const removeAll = searchStore((state) => state.resetSearch)
  const removeSearch = searchStore((state) => state.removeSearch)
  const setSearch = searchStore((state) => state.setSearch)
  const setNotifications = notificationStore((state) => state.setNotifications)

  let fin

  const eliminateData = (id) => removeSearch(id)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const res = await fundamentals(symbol)
    fin = await res.json()

    setSymbol("")

    if (Object.keys(fin).length === 0)
      return setNotifications("That symbol does not exist")
    if (fin["Error Message"]) return setNotifications(fin["Error Message"])
    if (fin["Note"]) return setNotifications(fin["Note"])
    if (fin["Note"] === undefined) setSearch(fin)
    console.log(fin)
  }

  const navigate = useNavigate()

  return (
    <>
      <div className="title">
        <div>InfoFinance</div>
      </div>
      <div className="search">
        <Form onSubmit={(e) => handleSubmit(e)}>
          <InputGroup className="mr-5 p-5 ">
            <Form.Control
              size="sm"
              type="text"
              placeholder="Enter a symbol of the US market"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
            <Button type="submit">Search</Button>
          </InputGroup>
        </Form>

        <div className="service-btns">
          <div>
            <Button
              className="ms-auto"
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/compare}`)}
            >
              Compare with Charts
            </Button>
          </div>{" "}
          <div>
            <Button
              className="ms-auto"
              variant="danger"
              size="sm"
              onClick={() => {
                if (window.confirm("Do you want to clear the local memory ?"))
                  removeAll()
              }}
            >
              Remove All
            </Button>
          </div>
        </div>
        {state.map((n, index) => (
          <Accordion className="results" key={n["Symbol"]}>
            <Accordion.Header>
              {n["Symbol"]}
              <span className="ms-auto infoDetail">
                {n["AssetType"]} / {n["Country"]} / {n["Currency"]}
              </span>
              <Button
                className="ms-auto"
                variant="warning"
                size="sm"
                onClick={() => navigate(`/graphs/${n["Symbol"]}`)}
              >
                Graph
              </Button>
              <Button
                className="ms-auto"
                variant="danger"
                size="sm"
                onClick={() => eliminateData(n.id)}
              >
                Delete
              </Button>
            </Accordion.Header>
            <Accordion.Body>
              <div
                style={{
                  fontSize: "2.3vmin",
                  textAlign: "start",
                  margin: 3,
                }}
              >
                <b>Description: </b>
                {n["Description"]}
                <br />
                <b>Address: </b>
                {n["Address"]}
                <br />
              </div>
              <div key={index} className="detail">
                {Object.keys(n).map((key) => {
                  if (
                    key === "id" ||
                    key === "CIK" ||
                    key === "FiscalYearEnd" ||
                    key === "Symbol" ||
                    key === "AssetType" ||
                    key === "LatestQuarter" ||
                    key === "ExDividendDate" ||
                    key === "Description" ||
                    key === "Address" ||
                    key === "chartData"
                  )
                    return ""
                  return (
                    <div key={key + index}>
                      <b>{key}</b>: {n[key]}
                    </div>
                  )
                })}
              </div>
            </Accordion.Body>
          </Accordion>
        ))}
      </div>
    </>
  )
}

export default Home
