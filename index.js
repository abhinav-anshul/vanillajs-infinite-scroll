import React, { useState, useRef } from "react"
import ReactDOM from "react-dom/client"
import InfiniteScroll from "./InfiniteScroll"

function App() {
  const [query, setQuery] = useState("")
  const [data, setData] = useState([])
  const controllerRef = useRef(null)

  const handleInput = (event) => {
    setQuery(event?.target?.value)
  }

  const renderItem = ({ title }, key, ref) => (
    <div ref={ref} key={key}>
      {title}
    </div>
  )
  const getData = (query, pageNumber) => {
    return new Promise(async (resolve, reject) => {
      try {
        // abort controller logic
        if (controllerRef.current) {
          controllerRef.current.abort()
        }
        controllerRef.current = new AbortController()

        const promise = await fetch(
          "https://openlibrary.org/search.json?" +
            new URLSearchParams({ q: query, page: pageNumber }),
          { signal: controllerRef.current.signal }
        )
        const data = await promise.json()
        setData((prev) => [...prev, ...data.docs])
        resolve()
      } catch (error) {
        console.log("error", error)
        reject()
      }
    })
  }
  return (
    <>
      <div>
        <input type="search" value={query} onChange={handleInput} />
        <InfiniteScroll
          query={query}
          getData={getData}
          renderListItem={renderItem}
          listData={data}
        />
      </div>
    </>
  )
}

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(<App />)
