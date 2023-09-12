const COLOURS = ['rgb(255, 0, 0)', 'rgb(254, 80, 0)', 'rgb(255, 205, 0)', 'rgb(177, 188, 85)', 'rgb(0, 154, 23)', 'rgb(38, 208, 124)',
'rgb(0, 188, 227)', 'rgb(0, 138, 216)', 'rgb(0, 51, 161)', 'rgb(155, 38, 182)', 'rgb(217, 1, 122)', 'rgb(255, 102, 204)'];

const INITIAL_ANIMATION_DURATION = 1500;

const FADE_DURATION = 500;

const EXPAND_DURATION = 500;

const QUADRANTS = {
  LEFT: 'left',
  RIGHT: 'right',
  TOP: 'top',
  BOTTOM: 'bottom',
};

const QUADRANT_PROPERTIES = {
  [QUADRANTS.TOP]: {
    heading: 'Work Experience',
    animationDelay: 0,
  },
  [QUADRANTS.RIGHT]: {
    heading: 'Life Experience',
    animationDelay: 1000,
  },
  [QUADRANTS.BOTTOM]: {
    heading: 'Education',
    animationDelay: 2000,
  },
  [QUADRANTS.LEFT]: {
    heading: 'I endorse',
    animationDelay: 3000,
  },
};

const QUADRANT_ANGLES = {
  LEFT_MIN: 55,
  LEFT_MAX: 125,
  TOP_MIN: 145,
  TOP_MAX: 180,
  RIGHT_MIN: -125,
  RIGHT_MAX: -55,
  BOTTOM_MIN: -35,
  BOTTOM_MAX: 35,
};

const QUADRANT_DISTANCES = {
  X_THRESHOLD: 90,
  Y_THRESHOLD: 90,
  Y_TOP_THRESHOLD: 130,
  WINDOW_X_RATIO: 1 / 3,
  WINDOW_Y_RATIO: 1 / 2.5,
};

export {
  COLOURS,
  EXPAND_DURATION,
  FADE_DURATION,
  INITIAL_ANIMATION_DURATION,
  QUADRANTS,
  QUADRANT_PROPERTIES,
  QUADRANT_ANGLES,
  QUADRANT_DISTANCES,
};
