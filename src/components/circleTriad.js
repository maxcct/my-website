import React, { useEffect, useState, } from 'react';
import { isMobile } from 'react-device-detect';
import { keyframes } from '@mui/system';
import { styled } from '@mui/material/styles';
import { Box, Typography, } from '@mui/material';

import OuterCircle from './outerCircle';
import { FADE_DURATION, QUADRANTS, QUADRANT_PROPERTIES, } from '../constants';

const CircleTriadContainer = styled((props) => <Box {...props} />
)((props) => ({
  display: 'flex',
  flexDirection:
    props[QUADRANTS.RIGHT] || props[QUADRANTS.LEFT] ? 'column' : 'row',
  [props[QUADRANTS.RIGHT] || props[QUADRANTS.LEFT] ? 'height' : 'width']:
    '11em',
  marginTop: props[QUADRANTS.RIGHT] || props[QUADRANTS.LEFT] ? 'auto' : 0,
  marginRight: props[QUADRANTS.LEFT] ? 0 : 'auto',
  marginBottom: props[QUADRANTS.RIGHT] || props[QUADRANTS.LEFT] ? 'auto' : 0,
  marginLeft: props[QUADRANTS.RIGHT] ? 0 : 'auto',
  ...(props[QUADRANTS.LEFT] && { position: 'relative', zIndex: 2, }),
}));

const getTextAlign = (quadrant) => {
  if (quadrant === QUADRANTS.LEFT) {
    return 'right'
  }
  if (quadrant === QUADRANTS.RIGHT) {
    return 'left';
  }
  return 'center';
}

const Heading = ({
  quadrant,
  quadrantHeading,
  circleHeading,
  quadrantCueAnimation,
  isFadingOut,
  mobileQuadrantCueAnimations,
}) => {
  const [mobileAnimationQuadrant, setMobileAnimationQuadrant] = useState(null);

  useEffect(() => {
    const mobileAnimationQuadrantTimeouts = {};
    if (isMobile && quadrantCueAnimation && quadrant === QUADRANTS.BOTTOM) {
      Object.keys(QUADRANT_PROPERTIES).forEach((quadrant) =>
        mobileAnimationQuadrantTimeouts.quadrant = setTimeout(() =>
          setMobileAnimationQuadrant(quadrant),
          QUADRANT_PROPERTIES[quadrant].animationDelay
        )
      );

      return () => Object.values(mobileAnimationQuadrantTimeouts).forEach(
        (timeout) => clearTimeout(timeout)
      );
    }
  }, [quadrant, quadrantCueAnimation,]);

  const mobileAnimationHeading = mobileAnimationQuadrant ?
    QUADRANT_PROPERTIES[mobileAnimationQuadrant].heading : null;

  const cueAnimation = mobileQuadrantCueAnimations && mobileAnimationQuadrant ?
    mobileQuadrantCueAnimations.find(animationQuadrant =>
      animationQuadrant[mobileAnimationQuadrant])[mobileAnimationQuadrant] :
    quadrantCueAnimation;

  const fadeInAnimation = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `;

  const fadeOutAnimation = keyframes`
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  `;

  return (
    <Typography
      sx={{
        minWidth:
          quadrant === QUADRANTS.TOP || quadrant === QUADRANTS.BOTTOM ?
          'max-content' : 'initial',
        maxWidth:
          quadrant === QUADRANTS.RIGHT || quadrant === QUADRANTS.LEFT ?
          ['max-content', 'min-content', 'max-content', 'max-content',] :
          'initial',
        fontFamily: 'Suez One',
        ...(!isMobile && {
          fontSize: quadrantHeading ?
            ['1.5em', '1.5em', '2em', '2em',] :
            ['1em', '1.25em', '1.5em', '1.5em',],
        }),
        ...(isMobile && { fontSize: '2em', }),
        textAlign: getTextAlign(quadrant),
        ...(
          !isMobile && {
            marginTop: quadrant === QUADRANTS.BOTTOM ? '83%' : 'auto'
        }),
        ...(isMobile && { marginTop: '7em', }),
        marginBottom: quadrant === QUADRANTS.TOP ? '85%' : 'auto',
        marginRight: quadrant === QUADRANTS.LEFT ?
          ['60%', '56%', '60%', '64%',] : 'auto',
        marginLeft: quadrant === QUADRANTS.RIGHT ?
          ['70%', '60%', '70%', '75%',] : 'auto',
        opacity: isFadingOut ? 1 : 0,
        ...(cueAnimation ?
          cueAnimation : {
          animation: `
            ${isFadingOut ?
              fadeOutAnimation :
              fadeInAnimation} ${FADE_DURATION}ms ease-in-out
          `,
          animationFillMode: 'forwards',
        }),
      }}
      variant={circleHeading ? 'h2' : 'h1'}
    >
      {mobileAnimationHeading || quadrantHeading || circleHeading}
    </Typography>
  );
};

const CircleTriad = ({
  circles,
  quadrant,
  quadrantHeading,
  expandedCircle,
  onExpandCircle,
  hoveredCircle,
  onHoverCircle,
  animateInReady,
  hasAnimatedIn,
  activatedQuadrant,
  getQuadrantCueAnimation,
  blockHoverEffects,
  easterEgged,
}) => {
  const circleHeading = !blockHoverEffects && hoveredCircle !== null && circles
    .filter(circle => circle.quadrant === quadrant)
    .find(circle => circle.index === hoveredCircle || (
      typeof hoveredCircle === 'string' &&
      circle.index === parseInt(hoveredCircle)
    ))?.heading;

  const quadrantIsActive =
    !blockHoverEffects &&
    !circleHeading &&
    activatedQuadrant === quadrant;
  const isQuadrantHeadingFadingOut =
    !blockHoverEffects &&
    !circleHeading &&
    activatedQuadrant &&
    activatedQuadrant.includes(quadrant) &&
    activatedQuadrant.includes('--fadeOut');

  const isCircleHeadingFadingOut =
    !blockHoverEffects &&
    circleHeading &&
    typeof hoveredCircle === 'string' &&
    hoveredCircle.includes('--fadeOut');

  const quadrantCueAnimation =
    typeof getQuadrantCueAnimation === 'function' &&
    getQuadrantCueAnimation(quadrant);

  const mobileQuadrantCueAnimations = isMobile &&
    typeof getQuadrantCueAnimation === 'function' ?
    Object.keys(QUADRANT_PROPERTIES).map(quadrant => (
      { [quadrant]: getQuadrantCueAnimation(quadrant) }
    )) : null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection:
          quadrant === QUADRANTS.LEFT || quadrant === QUADRANTS.RIGHT ?
          'row' : 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        onClick={() => onExpandCircle(null)}
        sx={{
          position: 'absolute',
          display: [
            quadrantCueAnimation && quadrant === QUADRANTS.BOTTOM ?
              'flex' : 'none', 'flex', 'flex',
          ],
          width: quadrant === QUADRANTS.LEFT ? '28em' : '14em',
          minWidth:
            isMobile ? 'max-content' : ['14em', '14em', 'max-content',],
          height: '14em',
        }}
      >
        {
          expandedCircle === null &&
          (
            activatedQuadrant === quadrant ||
            isQuadrantHeadingFadingOut ||
            quadrantCueAnimation
          ) &&
          !circleHeading &&
          (
            <Heading
              quadrant={quadrant}
              quadrantHeading={quadrantHeading}
              quadrantCueAnimation={quadrantCueAnimation}
              isFadingOut={isQuadrantHeadingFadingOut}
              mobileQuadrantCueAnimations={mobileQuadrantCueAnimations}
            />
          )
        }
        {expandedCircle === null && !quadrantCueAnimation && circleHeading && (
          <Heading
            quadrant={quadrant}
            circleHeading={circleHeading}
            isFadingOut={isCircleHeadingFadingOut}
          />
        )}
      </Box>
      <CircleTriadContainer
        left={quadrant === QUADRANTS.LEFT}
        right={quadrant === QUADRANTS.RIGHT}
      >
        {
          circles.filter((circle) => circle.quadrant === quadrant)
            .sort((a, b) => a.quadrantOrder > b.quadrantOrder ? 1 : -1)
            .map((circle) => (
              <OuterCircle
                key={circle.index}
                quadrantIsActive={quadrantIsActive}
                circle={circle}
                circles={circles}
                expandedCircle={expandedCircle}
                onExpandCircle={onExpandCircle}
                hoveredCircle={hoveredCircle}
                onHoverCircle={onHoverCircle}
                animateInReady={animateInReady}
                hasAnimatedIn={hasAnimatedIn}
                quadrantCueAnimation={quadrantCueAnimation}
                blockHoverEffects={blockHoverEffects}
                easterEgged={easterEgged}
              />
            ))
        }
      </CircleTriadContainer>
    </Box>
  )
};

export default CircleTriad;
