import React, { useCallback, useEffect, useState, } from 'react';
import { keyframes } from '@mui/system';
import { isMobile } from 'react-device-detect';

import Circle from './circle';
import Modal from './modal';
import usePreviousProp from '../hooks/usePreviousProp';
import {
  COLOURS,
  EXPAND_DURATION,
  FADE_DURATION,
  INITIAL_ANIMATION_DURATION,
} from '../constants';


const ColourCircle = ({ sx }) => (
  <Circle
    sx={{
      position: 'absolute',
      top: 0,
      width: '100%',
      height: '100%',
      ...sx,
    }}
  />
);

const OuterCircle = ({
  circle,
  circles,
  expandedCircle,
  onExpandCircle,
  hoveredCircle,
  onHoverCircle,
  animateInReady,
  hasAnimatedIn,
  quadrantIsActive,
  groupCueAnimation,
  blockHoverEffects,
  easterEgged,
}) => {
  const [
    mobileContainerStylesOverride, setMobileContainerStylesOverride
  ] = useState(null);

  const previousExpandedCircle = usePreviousProp(expandedCircle);
  const isExpanded = expandedCircle === circle.index;
  const isHovered = !blockHoverEffects && hoveredCircle === circle.index;

  const expandAnimation = keyframes`
    from {
      transform: translate(${circle.initialTranslate});
      box-shadow: 0 0 0.05em 0.025em rgba(0, 0, 0, 0.1);
    }
    to {
      transform: translate(${circle.expandedTranslate}) scale(7);
      box-shadow: 0 0 0.1em 0.05em rgba(0, 0, 0, 0.2);
    }
  `;

  const contractAnimation = keyframes`
    from {
      transform: translate(${circle.expandedTranslate}) scale(7);
    }
    to {
      transform: translate(${circle.initialTranslate});
    }
  `;

  const hoveredAnimation = keyframes`
    0 {
      transform: translate(${circle.initialTranslate}) scale(1);
    }
    50% {
      transform: translate(${circle.initialTranslate}) scale(1.1);
    }
    100% {
      transform: translate(${circle.initialTranslate}) scale(1);
    }
  `;

  const easterEggAnimation = keyframes`
    0 {
      transform: translate(${circle.initialTranslate});
    }
    50% {
      transform: translate(${circle.expandedTranslate});
    }
    100% {
      transform: translate(${circle.initialTranslate});
    }
  `;

  const getColourAnimation = useCallback(
    (isForMask, staysSolid, colourProperty = 'background-color',) =>
    circles.reduce((animationString, currentCircle, index,) => {
      const interval = 100 / (circles.length * 2);
      const backgroundColour = COLOURS[
        (circle.index + index + (isForMask ? 0 : 1)) % circles.length
      ];
      return `
        ${animationString}
        ${interval * index * 2}% {
          ${`opacity: ${staysSolid ? 1 : 0}`};
          ${colourProperty}: ${backgroundColour};
        }
        ${index === circles.length - 1 ? 100 : interval * (index * 2 + 1)}% {
          opacity: 1;
          ${colourProperty}: ${backgroundColour};
        }`
      }, '',
  ), [circles, circle.index,]);

  const colourAnimation = keyframes`${getColourAnimation()}`;

  const colourMaskAnimation = keyframes`${getColourAnimation(true, true,)}`;

  const baseColourAnimationStyles = {
    animationDuration: '24000ms',
    animationIterationCount: 'infinite',
    animationTimingFunction: 'linear',
    animationDirection: 'reverse',
    animationDelay: `${FADE_DURATION}ms`,
  };

  const getColourAnimationStyles = (isForMask) => hasAnimatedIn ? {
    opacity: 1,
    transition: `opacity ${FADE_DURATION}ms ease-in`,
    animation: `${isForMask ? colourMaskAnimation : colourAnimation}`,
    ...baseColourAnimationStyles,
  } : {};

  let containerStyles = {
    zIndex: 1,
    transform: `translate(${circle.initialTranslate})`,
  };

  if (easterEgged) {
    containerStyles = {
      ...containerStyles,
      animation: `${easterEggAnimation} 1000ms ease-in`,
      animationDelay: `${circle.index * 50}ms`,
      animationFillMode: 'forwards',
    };
  } else if (isExpanded) {
    containerStyles = {
      zIndex: 10,
      transform: `translate(${circle.expandedTranslate}) scale(7)`,
      animation: `${expandAnimation} ${EXPAND_DURATION}ms ease-in`,
      animationFillMode: 'forwards',
    };
  } else if (previousExpandedCircle !== circle.index && isHovered) {
    containerStyles = {
      ...containerStyles,
      animation: `${hoveredAnimation} infinite 2000ms ease-in-out`
    };
  } else if (previousExpandedCircle === circle.index) {
    containerStyles = {
      ...containerStyles,
      animation: `${contractAnimation} 200ms ease-out`,
      zIndex: 3,
    };
  }

  // Hack to fix issue where `transform: scale()` creates blurry edges on
  // mobile browsers
  useEffect(() => {
    if (
      isMobile && isExpanded && previousExpandedCircle !== circle.index
    ) {
      setTimeout(() => setMobileContainerStylesOverride({
        position: 'absolute',
        width: '21em',
        height: '21em',
        top: `calc(50% - ${circle.group === 'left' ? '10.5' : '12.5'}em)`,
        left: circle.group === 'left' ? '-0.5em' : 'calc(50% - 10.5em)',
        boxShadow: '0 0 0.5em 0.25em rgba(0, 0, 0, 0.3)',
        zIndex: 10,
      }), EXPAND_DURATION);
    } else if (isMobile && !isExpanded) {
      setMobileContainerStylesOverride(null);
    }
  }, [circle, isExpanded, previousExpandedCircle,]);

  const onClick = () => {
    if (!isExpanded && hasAnimatedIn && !easterEgged) {
      onExpandCircle(circle.index);
    }
  }

  const onMouseEnter = () => {
    onHoverCircle(circle.index);
  };

  return (
    <>
      <Circle
        sx={{
          ...(!hasAnimatedIn && animateInReady && {
            animation: `
              ${contractAnimation} ${INITIAL_ANIMATION_DURATION}ms ease-out
            `,
          }),
          ...(
            mobileContainerStylesOverride && isExpanded ?
              mobileContainerStylesOverride :
              containerStyles
          ),
          ...(!animateInReady && { opacity : 0, }),
          cursor: isExpanded ? 'initial' : 'pointer',
        }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={() => onHoverCircle(null)}
      >
        <ColourCircle
          sx={{
            backgroundColor: COLOURS[circle.index],
            opacity: 0.5,
            ...getColourAnimationStyles(),
          }}
        />
        <ColourCircle
          sx={{
            zIndex: -1,
            backgroundColor: COLOURS[circle.index],
            opacity: 0,
            ...getColourAnimationStyles(true),
          }}
        />
        <ColourCircle
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            opacity: quadrantIsActive &&
              expandedCircle === null &&
              !isHovered ? 1 : 0,
            transition: `opacity ${FADE_DURATION}ms ease-in-out`,
            ...groupCueAnimation,
          }}
        />
      </Circle>
      <Modal
        circle={circle}
        circles={circles}
        isExpanded={isExpanded}
        baseColourAnimationStyles={baseColourAnimationStyles}
        getColourAnimation={getColourAnimation}
        onExpandCircle={onExpandCircle}
      />
    </>
  );
};

export default OuterCircle;
