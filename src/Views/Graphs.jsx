import React, { useState } from "react"
import { Button, Form, InputGroup, Spinner } from "react-bootstrap"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  ComposedChart,
} from "recharts"
import { hardData } from "../services/api"
import { notificationStore, searchStore } from "../state/store"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"

const Graphs = () => {
  const [time] = useState("TIME_SERIES_MONTHLY_ADJUSTED")
  const [searchSymbol, setSearchSymbol] = useState("")
  let [lastData, setLastData] = useState([])
  const [spinner, setSpinner] = useState(false)

  const navigate = useNavigate()
  const addGraphData = searchStore((state) => state.addGraphData)
  const setNotifications = notificationStore((state) => state.setNotifications)

  let { symbol } = useParams()

  const stateData = searchStore((state) =>
    state.searchs.filter((n) => n["Symbol"] == symbol)
  )
  if (stateData.length === 0) {
    navigate("/")
  }

  useEffect(() => {
    const petition = async () => {
      let fin
      try {
        const res = await hardData(symbol, time)
        fin = await res.json()
      } catch (e) {
        if (e) return setNotifications(e)
      }
      if (fin["Error Message"]) return setNotifications(fin["Error Message"])
      if (fin["Note"]) return setNotifications(fin["Note"])
      if (fin["Note"] === undefined) addGraphData(symbol, fin)
    }
    if (stateData[0].chartData === undefined) petition()
  }, [])

  let data
  let final
  if (stateData[0].chartData !== undefined) {
    data = stateData[0].chartData["Monthly Adjusted Time Series"]

    final = Object.keys(data).map((key) => {
      return {
        date: key.slice(0, -3),
        [symbol]: +Number(data[key]["4. close"]).toFixed(2),
        volume: +Number(data[key]["6. volume"]),
      }
    })
  }

  const handleSearch = async (e) => {
    setSpinner(true)
    e.preventDefault()
    let data
    try {
      const res = await hardData(searchSymbol, time)
      data = await res.json()
    } catch (e) {
      if (e) return setNotifications(e)
    }
    if (data["Error Message"]) {
      setSpinner(false)
      return setNotifications(data["Error Message"])
    }
    if (data["Note"]) {
      setSpinner(false)
      return setNotifications(data["Note"])
    }
    const add = Object.values(data["Monthly Adjusted Time Series"]).map(
      (n) => +Number(n["4. close"]).toFixed(2)
    )
    let finalData = []
    const reversedFinal = final.reverse()
    for (let i = 0; i < final.length; i++) {
      finalData.push({ ...reversedFinal[i], [searchSymbol]: add[i] })
    }
    setLastData(finalData.reverse())
    setSpinner(false)
  }

  return (
    <>
      <br />
      <div className="btn-home">
        <Button
          className="ms-auto"
          variant="warning"
          size="sm"
          onClick={() => navigate("/")}
        >
          <span>
            <i className="fa-solid fa-arrow-left"></i>
          </span>
          &nbsp; Back to Home
        </Button>
      </div>
      <div className="chart-title">
        <div>
          <h6>
            Chart of <span style={{ color: "red" }}>{symbol} </span>
            {lastData.length > 0 ? (
              <>
                vs <span style={{ color: "blue" }}>{searchSymbol}</span>
              </>
            ) : (
              ""
            )}
          </h6>
        </div>
        <div className="search">
          <Form onSubmit={handleSearch}>
            <InputGroup className="">
              <Form.Control
                size="sm"
                type="text"
                placeholder={"Symbol to compare"}
                value={searchSymbol}
                onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
              />
              {spinner === false ? (
                <Button
                  type="submit"
                  disabled={searchSymbol == "" ? true : false}
                >
                  Compare
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
        </div>
      </div>
      {data !== undefined ? (
        <div>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: 30,
            }}
          >
            <ResponsiveContainer width="95%" aspect={1.5 / 1.0}>
              <ComposedChart
                data={lastData.length <= 0 ? final.reverse() : lastData}
                margin={{
                  top: 0,
                  right: 10,
                  left: 5,
                  bottom: 0,
                }}
                yAxisId={1}
              >
                <CartesianGrid strokeDasharray="10 10" />
                <XAxis
                  dataKey="date"
                  angle={-47}
                  textAnchor="end"
                  interval={25}
                />

                {lastData.length > 0 &&
                lastData[lastData.length - 1][symbol] <
                  lastData[lastData.length - 1][searchSymbol] ? (
                  <YAxis dataKey={searchSymbol} />
                ) : (
                  <YAxis dataKey={symbol} />
                )}

                <YAxis
                  dataKey="volume"
                  yAxisId="right"
                  orientation="right"
                  stroke="#ccc"
                  angle={50}
                />
                <Tooltip />
                <Legend
                  wrapperStyle={{
                    paddingTop: 40,
                  }}
                />
                <Line
                  dot={{ r: 1 }}
                  type="monotone"
                  dataKey={symbol}
                  stroke="red"
                  key={`price of ${symbol}`}
                  name={`price of ${symbol}`}
                />
                {lastData.length > 0 ? (
                  <Line
                    dot={{ r: 1 }}
                    type="monotone"
                    dataKey={searchSymbol}
                    stroke="blue"
                    key={`price of ${searchSymbol}`}
                    name={`price of ${searchSymbol}`}
                  />
                ) : (
                  ""
                )}
                <Bar
                  yAxisId="right"
                  dataKey="volume"
                  fill="#ccc"
                  name={`volume of ${symbol}`}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default Graphs
