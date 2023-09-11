const COLOURS = ['rgb(255, 0, 0)', 'rgb(254, 80, 0)', 'rgb(255, 205, 0)', 'rgb(177, 188, 85)', 'rgb(0, 154, 23)', 'rgb(38, 208, 124)',
'rgb(0, 188, 227)', 'rgb(0, 138, 216)', 'rgb(0, 51, 161)', 'rgb(155, 38, 182)', 'rgb(217, 1, 122)', 'rgb(255, 102, 204)'];
const GROUPS = {
  top: {
    heading: 'Work Experience',
    animationDelay: 0,
  },
  right: {
    heading: 'Life Experience',
    animationDelay: 1000,
  },
  bottom: {
    heading: 'Education',
    animationDelay: 2000,
  },
  left: {
    heading: 'I endorse',
    animationDelay: 3000,
  },
};
const INITIAL_ANIMATION_DURATION = 1500;
const FADE_DURATION = 500;
const EXPAND_DURATION = 500;

export {
  COLOURS,
  EXPAND_DURATION,
  FADE_DURATION,
  GROUPS,
  INITIAL_ANIMATION_DURATION,
};
