import React, { useRef, useState } from "react"
import { Button, Form, InputGroup, Spinner } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { hardData } from "../services/api"
import { notificationStore } from "../state/store"
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Bar,
  ComposedChart,
  Tooltip,
} from "recharts"

const Compare = () => {
  const [symbol, setSymbol] = useState("")
  const [data, setData] = useState([])
  const [time, setTime] = useState(data.time || "")
  const [spinner, setSpinner] = useState(false)
  const navigate = useNavigate()
  const setNotifications = notificationStore((state) => state.setNotifications)

  const colors = ["red", "blue", "black", "green", "orange", "purple", "brown"]
  const timeReturned = (timeSent) => {
    if (timeSent === "TIME_SERIES_DAILY") return "Time Series (Daily)"
    if (timeSent === "TIME_SERIES_WEEKLY") return "Weekly Time Series"
    if (timeSent === "TIME_SERIES_MONTHLY") return "Monthly Time Series"
  }
  const handleSearch = async (e) => {
    e.preventDefault()

    if (data.length > 0 && time !== data.time) {
      setTime(data.time)
      return setNotifications(
        "Please only comparisions with the same frecuency"
      )
    }

    if (data.length > 0) {
      data.symbols.map((n) => {
        if (n === symbol) {
          return setNotifications("No duplicates of the same symbols")
        }
      })
    }

    setSpinner(true)
    let dataRecieved
    try {
      const res = await hardData(symbol, time)
      dataRecieved = await res.json()
    } catch (e) {
      setSpinner(false)
      return setNotifications(e)
    }
    if (dataRecieved["Error Message"]) {
      setSpinner(false)
      return setNotifications(dataRecieved["Error Message"])
    }
    if (dataRecieved["Note"]) {
      setSpinner(false)
      return setNotifications(dataRecieved["Note"])
    }

    let final = []
    if (data.length > 0) {
      data.symbols.map((n) => {
        if (n === symbol) {
          return setNotifications("No duplicates of the same symbols")
        }
      })
      const add = Object.values(dataRecieved[timeReturned(time)]).map(
        (n) => +Number(n["4. close"]).toFixed(2)
      )
      let updatedData = []
      for (let i = 0; i < data.length; i++) {
        updatedData.push({ ...data[i], [symbol]: add[i] })
      }
      if (data.symbols !== undefined && data.symbols.length > 0) {
        updatedData.symbols = [...data.symbols, symbol]
      }
      updatedData.time = time

      setSymbol("")
      setSpinner(false)
      return setData(updatedData.reverse())
    } else {
      final = Object.keys(dataRecieved[timeReturned(time)]).map((key) => {
        return {
          date: key,
          [symbol]: +Number(
            dataRecieved[timeReturned(time)][key]["4. close"]
          ).toFixed(2),
          volume: +Number(dataRecieved[timeReturned(time)][key]["5. volume"]),
        }
      })

      final.time = time

      if (final.symbols === undefined) final.symbols = [symbol]

      setSymbol("")
      setSpinner(false)
      return setData(final.reverse())
    }
  }
  let cleanedEnt = []
  if (data.length > 0)
    Object.entries(data.at(-1)).forEach((key) => {
      if (key[0] !== "volume" && key[0] !== "date") {
        cleanedEnt.push(key)
      }
    })
  let orderedSymbol
  if (cleanedEnt.length > 0)
    cleanedEnt.sort((a, b) => {
      a[1] > b[1] ? (orderedSymbol = a[0]) : (orderedSymbol = b[0])
    })

  return (
    <>
      <div className="chart-title">
        <h5>Search & Compare</h5>
        <div>
          <Button
            className="ms-auto"
            variant="warning"
            size="sm"
            onClick={() => navigate(`/`)}
          >
            <span>
              <i className="fa-solid fa-arrow-left"></i>
            </span>
            &nbsp; Home
          </Button>
        </div>
      </div>
      <div className="search m-4">
        <Form onSubmit={handleSearch}>
          <InputGroup>
            <Form.Control
              size="sm"
              type="text"
              placeholder="Symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            />

            <Form.Select
              aria-label="Default select "
              size="sm"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              <option>Select the Frecuency</option>
              <option value="TIME_SERIES_INTRADAY" disabled>
                Intraday
              </option>
              <option value="TIME_SERIES_DAILY">Daily</option>
              <option value="TIME_SERIES_WEEKLY">Weekly</option>
              <option value="TIME_SERIES_MONTHLY">Monthly</option>
            </Form.Select>
            {spinner === false ? (
              <Button
                type="submit"
                disabled={time === "" || symbol === "" ? true : false}
              >
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
      </div>

      {data.length > 0 ? (
        <ResponsiveContainer width="95%" aspect={1.5 / 1.0}>
          <ComposedChart
            data={data}
            margin={{
              top: 30,
              right: 10,
              left: 5,
              bottom: 0,
            }}
            wrapperStyle={{
              bottom: 100,
            }}
          >
            <CartesianGrid strokeDasharray="10 10" />
            <XAxis dataKey="date" angle={-47} textAnchor="end" interval={15} />

            <YAxis dataKey={orderedSymbol} />

            <YAxis
              dataKey="volume"
              yAxisId="right"
              orientation="right"
              stroke="#ccc"
              angle={52}
            />
            <Tooltip />
            <Legend
              wrapperStyle={{
                left: 0,
                top: 0,
                paddingBottom: 40,
              }}
            />

            {data.symbols.map((data) => (
              <Line
                dot={{ r: 1 }}
                type="monotone"
                dataKey={`${data}`}
                stroke={colors[Math.floor(Math.random() * 7) + 1]}
                key={`price of ${data}`}
                name={`price of ${data}`}
                yAxisId={0}
              />
            ))}

            <Bar
              yAxisId="right"
              dataKey="volume"
              fill="#ccc"
              name={`volume of ${data.symbols[0]}`}
            />
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <></>
      )}
      {data.length > 0 ? (
        <div>
          <Button
            className="ms-auto"
            variant="danger"
            size="sm"
            onClick={() => setData([])}
          >
            CLEAR CHART
          </Button>
        </div>
      ) : (
        ""
      )}
    </>
  )
}

export default Compare
