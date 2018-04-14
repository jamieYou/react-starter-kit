import React from "react"
import { Route } from "react-router-dom"

Route.defaultProps = {
  exact: true
}

export default function routeGroup(...args: React.Component[]) {
  return args.map(item => {
    const { path = null } = item.props
    return React.cloneElement(item, { key: item.key || path })
  })
}
