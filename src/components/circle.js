import React, { forwardRef, } from 'react';
import { styled } from '@mui/material/styles';
import { Box, } from '@mui/material';

const Circle = styled(forwardRef(({ clipMode, ...otherProps }, ref) =>
  <Box ref={ref} {...otherProps} />
))(({ clipMode, }) => ({
  display: 'flex',
  height: '3em',
  width: '3em',
  ...(clipMode ? { clipPath: 'ellipse(50% 50% at 50% 50%)', } : { borderRadius: '50%', }),
  margin: 'auto',
}));

export default Circle;
