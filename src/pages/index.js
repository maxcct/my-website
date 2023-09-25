import * as React from "react"
import { graphql } from 'gatsby';
import { createTheme, ThemeProvider, } from '@mui/material/styles';

import Layout from "../components/layout"
import HeavenlyCity from "../components/heavenlyCity";
import Seo from "../components/seo"
import * as styles from "../components/index.module.css"


const IndexPage = ({ data, location, }) => {
  const outerCircles = data.allMarkdownRemark.edges.map(({ node }) => (
    {
      ...node.frontmatter,
      content: node.html,
    }
  ));

  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 720,
        lg: 900,
        xl: 1200,
        xxl: 1536,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <div style={{ height: '100%', }} className={styles.textCenter}>
          <HeavenlyCity hash={location.hash} outerCircles={outerCircles} />
        </div>
      </Layout>
    </ThemeProvider>
)};

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo />

export default IndexPage

export const outerCirclesQuery = graphql`
  query outerCirclesQuery {
    allMarkdownRemark(sort: {frontmatter: {index: ASC}}) {
      edges {
        node {
          html
          frontmatter {
            slug
            heading
            link
            quadrant
            position
            quadrantOrder
            index
            initialTranslate
            expandedTranslate
          }
        }
      }
    }
  }
`;
