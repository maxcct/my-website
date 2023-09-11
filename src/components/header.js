import * as React from 'react';

import GitHubIcon from '@mui/icons-material/GitHub';

const Header = ({ siteTitle }) => (
  <header
    style={{
      height: `var(--height-header)`,
      display: `flex`,
      fontFamily: `Suez One`,
    }}
  >
    <a
      href="https://github.com/maxcct"
      target='_blank'
      rel='noreferrer'
      aria-label='Github'
      style={{
        marginRight: 'auto',
      }}
    >
      <GitHubIcon />
    </a>
    <a
      href='mailto:&#109;&#097;&#120;&#116;&#114;&#101;&#118;&#105;&#116;&#116;&#064;&#103;&#109;&#097;&#105;&#108;&#046;&#099;&#111;&#109;'
      target='_blank'
      rel="noreferrer"
      style={{
        textDecoration: 'none',
        marginLeft: 'auto',
      }}
    >
      &#109;&#097;&#120;&#116;&#114;&#101;&#118;&#105;&#116;&#116;&#064;&#103;&#109;&#097;&#105;&#108;&#046;&#099;&#111;&#109;
    </a>
  </header>
)

export default Header
