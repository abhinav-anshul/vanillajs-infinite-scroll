import React, { useState, useRef, useEffect, useCallback } from "react"

function InfiniteScroll({ query, listData, getData, renderListItem }) {
  const [loading, setLoading] = useState(false)
  const pageNumber = useRef(1)
  const observer = useRef(null)

  const lastElementObserver = (node) => {
    if (loading) return

    if (observer.current) {
      observer.current.disconnect()
    }
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        pageNumber.current += 1
        fetchData()
      }
    })
    if (node) {
      observer.current.observe(node)
    }
  }

  const fetchData = useCallback(() => {
    setLoading(true)
    getData(query, pageNumber.current)
    setLoading(false)
  }, [query])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const renderList = () => {
    return listData?.map((item, index) => {
      if (index === listData.length - 1) {
        return renderListItem(item, index, lastElementObserver)
      }
      return renderListItem(item, index, null)
    })
  }

  console.log(renderList())
  return (
    <>
      {renderList()}
      {loading ? <h1>Loading</h1> : null}
    </>
  )
}

export default InfiniteScroll
