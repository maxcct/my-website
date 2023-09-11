/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from 'react';
import { graphql, useStaticQuery, } from 'gatsby';

import Header from "./header"
import './layout.css'

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <div style={{ height: '100%', padding: `var(--page-padding)`}}>
      <Header siteTitle={data.site.siteMetadata?.title || `Title`} />
      <main style={{ height: `100%`, zIndex: 0, }}>
        {children}
      </main>
    </div>
  )
}

export default Layout
