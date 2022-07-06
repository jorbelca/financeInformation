import React, { useState } from "react"
import { Accordion, Button, Form, InputGroup } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { fundamentals } from "../services/api"
import { notificationStore, searchStore } from "../state/store"

const Home = () => {
  const [symbol, setSymbol] = useState("")

  const state = searchStore((state) => state.searchs)

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

    if (fin["Error Message"]) return setNotifications(fin["Error Message"])
    if (fin["Note"]) return setNotifications(fin["Note"])
    if (fin["Note"] === undefined) setSearch(fin)
    console.log(fin)
  }

  const navigate = useNavigate()

  return (
    <>
      <div>INFOFinance</div>
      <div className="search">
        <Form onSubmit={(e) => handleSubmit(e)}>
          <InputGroup className="mr-5 p-5 ">
            <Form.Control
              size="sm"
              type="text"
              placeholder="Enter a symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
            <Button type="submit">Search</Button>
          </InputGroup>
        </Form>

        {state.map((n, index) => (
          <Accordion className="results">
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
