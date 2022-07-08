import React, { useState } from "react"
import { Button, Form, InputGroup } from "react-bootstrap"
import {
  LineChart,
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
      const res = await hardData(symbol, time)
      fin = await res.json()

      if (fin["Error Message"]) return setNotifications(fin["Error Message"])
      if (fin["Note"]) return setNotifications(fin["Note"])
      if (fin["Note"] === undefined) addGraphData(symbol, fin)
      console.log(fin)
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
        price: +Number(data[key]["4. close"]).toFixed(2),
        volume: +Number(data[key]["6. volume"]),
      }
    })
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    const res = await hardData(searchSymbol, time)
    const data = await res.json()

    if (data["Error Message"]) return setNotifications(data["Error Message"])
    if (data["Note"]) return setNotifications(data["Note"])
    const add = Object.values(data["Monthly Adjusted Time Series"]).map(
      (n) => +Number(n["4. close"]).toFixed(2)
    )
    let finalData = []
    const reversedFinal = final.reverse()
    for (let i = 0; i < final.length; i++) {
      finalData.push({ ...reversedFinal[i], price2: add[i] })
    }
    setLastData(finalData.reverse())
  }

  return (
    <>
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
                placeholder={symbol}
                value={searchSymbol}
                onChange={(e) => setSearchSymbol(e.target.value.toUpperCase())}
              />
              {/* <Form.Select aria-label="Default select example" size="sm">
              <option disabled>Frecuency</option>
              <option value="TIME_SERIES_INTRADAY">Daily</option>
              <option value="TIME_SERIES_DAILY">Daily</option>
              <option value="TIME_SERIES_WEEKLY">Weekly</option>
              <option value="TIME_SERIES_DAILY">Monthly</option>
            </Form.Select> */}
              <Button type="submit">Compare</Button>
            </InputGroup>
          </Form>
        </div>
        <div>
          <Button
            className="ms-auto"
            variant="warning"
            size="sm"
            onClick={() => navigate("/")}
          >
            Home
          </Button>
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
            }}
          >
            <ResponsiveContainer width="95%" aspect={2.0 / 1.0}>
              <ComposedChart
                data={lastData.length <= 0 ? final.reverse() : lastData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 0,
                  bottom: 5,
                }}
                yAxisId={1}
              >
                <CartesianGrid strokeDasharray="1 1" />
                <XAxis dataKey="date" />

                {lastData.length > 0 &&
                lastData.at(-1).price < lastData.at(-1).price2 ? (
                  <YAxis dataKey="price2" />
                ) : (
                  <YAxis dataKey="price" />
                )}

                <YAxis
                  dataKey="volume"
                  yAxisId="right"
                  orientation="right"
                  stroke="#ccc"
                />
                <Tooltip />
                <Legend />
                <Line
                  dot={{ r: 1 }}
                  type="monotone"
                  dataKey="price"
                  stroke="red"
                  key="price"
                  name="price"
                  yAxisId={0}
                />
                {lastData.length > 0 ? (
                  <Line
                    dot={{ r: 1 }}
                    type="monotone"
                    dataKey="price2"
                    stroke="blue"
                    key="price2"
                    name="price2"
                  />
                ) : (
                  ""
                )}
                <Bar yAxisId="right" dataKey="volume" fill="#ccc" />
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

// <Table responsive size="sm">
//               <thead>
//                 <tr>
//                   <th></th>
//                   <th>Open</th>
//                   <th>High</th>
//                   <th>Low</th>
//                   <th>Close</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {/* {Object.values(Object.entries(n)[2][1]).map((n) => (
//                   <>
//                     <tr>
//                       {Object.values(keys.map((n) => <td>{n}</td>))}
//                       <td> {Number(n["1. open"]).toFixed(2)}</td>
//                       <td>{Number(n["2. high"]).toFixed(2)}</td>
//                       <td>{Number(n["3. low"]).toFixed(2)}</td>
//                       <td>{Number(n["4. close"]).toFixed(2)}</td>
//                     </tr>
//                   </>
//                 ))} */}
//               </tbody>
//             </Table>
