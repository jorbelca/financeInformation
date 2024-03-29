import React, { useState } from "react"
import {
  Accordion,
  Button,
  Form,
  InputGroup,
  OverlayTrigger,
  Spinner,
  Tooltip,
} from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { fundamentals } from "../services/api"
import { notificationStore, searchStore } from "../state/store"

const Home = () => {
  const [symbol, setSymbol] = useState("")
  const [spinner, setSpinner] = useState(false)
  const state = searchStore((state) => state.searchs)

  const removeAll = searchStore((state) => state.resetSearch)
  const removeSearch = searchStore((state) => state.removeSearch)
  const setSearch = searchStore((state) => state.setSearch)
  const setNotifications = notificationStore((state) => state.setNotifications)

  let fin

  const eliminateData = (id) => removeSearch(id)

  const handleSubmit = async (e) => {
    let isAllready = false
    setSpinner(true)
    e.preventDefault()
    state.map((state) => {
      if (symbol === state.Symbol) {
        isAllready = true
        setSpinner(false)
        return setNotifications("This symbol is allready in memory")
      }
    })
    if (isAllready === true) return
    try {
      const res = await fundamentals(symbol)
      fin = await res.json()
    } catch (e) {
      if (e) return setNotifications(e)
    }
    setSymbol("")

    if (Object.keys(fin).length === 0) {
      setSpinner(false)
      return setNotifications("That symbol does not exist")
    }
    if (fin["Error Message"]) {
      setSpinner(false)
      return setNotifications(fin["Error Message"])
    }
    if (fin["Note"]) {
      setSpinner(false)
      return setNotifications(fin["Note"])
    }
    if (fin["Note"] === undefined) setSearch(fin)
    setSpinner(false)
  }

  const navigate = useNavigate()

  return (
    <>
      <div className="title">
        <h2>InfoFinance</h2>
      </div>
      <div className="search">
        <Form onSubmit={(e) => handleSubmit(e)}>
          <InputGroup className="mr-5 p-5 ">
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip>
                  Due to limitations of the api provider, in this input only
                  introduce symbols of the US market
                </Tooltip>
              }
            >
              <Form.Control
                size="sm"
                type="text"
                placeholder="Introduce a symbol of the US market"
                value={symbol}
                onChange={(e) => setSymbol(e.target.value.toLocaleUpperCase())}
              />
            </OverlayTrigger>

            {spinner === false ? (
              <Button type="submit" disabled={symbol === "" ? true : false}>
                Search &nbsp;
                <span>
                  <i className="fa-solid fa-magnifying-glass"></i>
                </span>
              </Button>
            ) : (
              <Button variant="primary" disabled>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                Searching...
              </Button>
            )}
          </InputGroup>
        </Form>

        <div className="service-btns">
          <div>
            <OverlayTrigger
              key={"top"}
              placement={"top"}
              overlay={
                <Tooltip>
                  You can introduce any symbol of any market in the world, even
                  ETF's
                </Tooltip>
              }
            >
              <Button
                className="ms-auto"
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/compare`)}
              >
                Compare with Charts
              </Button>
            </OverlayTrigger>
          </div>
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
              Remove All &nbsp;
              <span>
                <i className="fa-solid fa-trash-can"></i>
              </span>
            </Button>
          </div>
        </div>
        {state.map((n, index) => (
          <Accordion className="results" key={n["Symbol"]}>
            <Accordion.Header>
              <span className="symb"> {n["Symbol"]}</span>
              <p className="name">
                <b> {n["Name"]}</b>
              </p>
              <span className="ms-auto infoDetail">
                {n["AssetType"]} / {n["Country"]} / {n["Currency"]}
              </span>
              <div className="accordion-btns">
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
                  <span>
                    <i className="fa-solid fa-trash-can"></i>
                  </span>
                </Button>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <div className="body-description">
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
