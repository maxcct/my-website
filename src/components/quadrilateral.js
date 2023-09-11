import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, } from '@mui/material';

const Quadrilateral = styled((props) => <Box {...props} />
)(() => ({
  display: 'flex',
  height: '11em',
  margin: '0 auto',
  width: '11em',
}));

export default Quadrilateral;
