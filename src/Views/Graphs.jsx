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
} from "recharts"
import { hardData } from "../services/api"
import { notificationStore, searchStore } from "../state/store"
import { useNavigate, useParams } from "react-router-dom"
import { useEffect } from "react"

const Graphs = () => {
  const [time, setTime] = useState("TIME_SERIES_MONTHLY_ADJUSTED")
  // const [symbol, setSymbol] = useState("")
  const navigate = useNavigate()
  const addGraphData = searchStore((state) => state.addGraphData)
  const setNotifications = notificationStore((state) => state.setNotifications)

  let { symbol } = useParams()

  useEffect(() => {
    const petition = async () => {
      let fin
      const res = await hardData(symbol, time)
      fin = await res.json()

      if (fin["Error Message"]) return setNotifications(fin["Error Message"])
      if (fin["Note"]) return setNotifications(fin["Note"])
      if (fin["Note"] === undefined) addGraphData(symbol, fin)
    }
  }, [time])

  const stateData = searchStore((state) =>
    state.searchs.filter((n) => n["Symbol"] == symbol)
  )

  const data = stateData[0].chartData["Monthly Adjusted Time Series"]

  const final = Object.keys(data).map((key) => {
    return (key = data[key])
  })
  console.log(final)
  return (
    <>
      <div>Chart of {symbol}</div>
      <Button
        className="ms-auto"
        variant="warning"
        size="sm"
        onClick={() => navigate("/")}
      >
        Home
      </Button>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="data" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* <div className="search">
        <Form>
          <InputGroup className="mr-5 p-5 ">
            <Form.Control
              data={data}
              size="sm"
              type="text"
              placeholder={symbol}
              value={symbol}
            />
            <Form.Select aria-label="Default select example" size="sm">
              <option disabled>Frecuency</option>
              <option value="TIME_SERIES_INTRADAY">Daily</option>
              <option value="TIME_SERIES_DAILY">Daily</option>
              <option value="TIME_SERIES_WEEKLY">Weekly</option>
              <option value="TIME_SERIES_DAILY">Monthly</option>
            </Form.Select>
            <Button type="submit">Search</Button>
          </InputGroup>
        </Form>
      </div> */}
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

// const keys = state.map((n) => n["Monthly Time Series"])
// const data = Object.values(state[2]["Monthly Time Series"])

// const tata = [
//   {
//     x: keys.map((n) =>(return n)),
//   },
//   data.map((n) => {
//     y: {
//       n["1. open"]
//     }
//   }),
// ]
// let result = [{ x: "", y: "" }]
// state.map((k) => ({
//   x: Object.keys(k["Monthly Time Series"]),
//   y: Object.values(k["Monthly Time Series"]),
// }))
