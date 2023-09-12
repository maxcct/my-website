import React, { useCallback, useEffect, useRef, useState, } from 'react';
import { Box, } from '@mui/material';
import { keyframes } from '@mui/system';
import debounce from 'lodash.debounce';

import Circle from './circle';
import CircleTriad from './circleTriad';
import Quadrilateral from './quadrilateral';
import useDetectClickOutside from '../hooks/useDetectClickOutside';
import {
  FADE_DURATION,
  INITIAL_ANIMATION_DURATION,
  QUADRANTS,
  QUADRANT_PROPERTIES,
  QUADRANT_ANGLES,
  QUADRANT_DISTANCES,
} from '../constants';


// Helper functions for determining whether quadrant should be activated,
// based on whether cursor position is within specified range of degrees
const isWithinRange = (value, min, max) => value >= min && value < max;
const isCursorInLeftQuadrant = (angle) => isWithinRange(
  angle, QUADRANT_ANGLES.LEFT_MIN, QUADRANT_ANGLES.LEFT_MAX
);
const isCursorInRightQuadrant = (angle) => isWithinRange(
  angle, QUADRANT_ANGLES.RIGHT_MIN, QUADRANT_ANGLES.RIGHT_MAX
);
const isCursorInTopQuadrant = (angle, yDistance) =>
  ((angle > 0 && isWithinRange(
    angle, QUADRANT_ANGLES.TOP_MIN, QUADRANT_ANGLES.TOP_MAX
  )) ||
  (angle < 0 && isWithinRange(
    angle, -QUADRANT_ANGLES.TOP_MAX, -QUADRANT_ANGLES.TOP_MIN
  ))) &&
  yDistance > QUADRANT_DISTANCES.Y_TOP_THRESHOLD;
const isCursorInBottomQuadrant = (angle) =>
  ((angle > 0 && isWithinRange(
    angle, QUADRANT_ANGLES.BOTTOM_MIN, QUADRANT_ANGLES.BOTTOM_MAX
  )) ||
  (angle < 0 && isWithinRange(
    angle, -QUADRANT_ANGLES.BOTTOM_MAX, -QUADRANT_ANGLES.BOTTOM_MIN
  )));

const HeavenlyCity = ({ outerCircles }) => {
  const [cursorAngle, setCursorAngle] = useState(null);
  const [cursorDistFromCentreX, setCursorDistFromCentreX] = useState(0);
  const [cursorDistFromCentreY, setCursorDistFromCentreY] = useState(0);
  const [expandedCircle, setExpandedCircle] = useState(null);
  const [hoveredCircle, setHoveredCircle] = useState(null);
  const [activatedQuadrant, setActivatedQuadrant] = useState(null);
  const [animateInReady, setAnimateInReady] = useState(false);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const [getQuadrantCueAnimation, setGetQuadrantCueAnimation] = useState(null);
  const [
    hasPlayedQuadrantCueAnimation, setHasPlayedQuadrantCueAnimation
  ] = useState(false);
  const [easterEgged, setEasterEgged] = useState(null);
  const windowWidthRef = useRef();
  const windowHeightRef = useRef();
  const containerRef = useRef();
  const fadeOutTimerRef = useRef(null);
  useDetectClickOutside(containerRef, () => setExpandedCircle(null));

  useEffect(() => {
    const onPageReady = () => {
      setAnimateInReady(true);
      setTimeout(() => setHasAnimatedIn(true), INITIAL_ANIMATION_DURATION);
    }
    if (document.readyState === 'complete') {
      onPageReady();
    } else if (typeof window !== undefined) {
      window.addEventListener('load', onPageReady);
      return () => window.removeEventListener('load', onPageReady);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== undefined) {
      const debouncedHandleMouseMove = debounce(({ clientX, clientY }) => {
        setCursorDistFromCentreX(clientX - window.innerWidth / 2);
        setCursorDistFromCentreY(clientY - window.innerHeight / 2);
        let cursorRadians = Math.atan2(
          cursorDistFromCentreX, cursorDistFromCentreY
        );
        setCursorAngle(cursorRadians * 180 / Math.PI * -1);
      }, 5);

      window.addEventListener('mousemove', debouncedHandleMouseMove);
      return () =>
        window.removeEventListener('mousemove', debouncedHandleMouseMove);
    }
  }, [cursorDistFromCentreX, cursorDistFromCentreY,]);

  useEffect(() => {
    if (typeof window !== undefined) {
      const onResize = () => {
        windowWidthRef.current = window.innerWidth;
        windowHeightRef.current = window.innerHeight;
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }
  }, []);

  const clearFadeOut = useCallback(() => {
    if (fadeOutTimerRef.current) {
      clearTimeout(fadeOutTimerRef.current);
      fadeOutTimerRef.current = null;
      if (
        typeof hoveredCircle === 'string' &&
        hoveredCircle.includes('--fadeOut')
      ) {
        setHoveredCircle(null);
      }
      if (activatedQuadrant && activatedQuadrant.includes('--fadeOut')) {
        setActivatedQuadrant(null);
      }
    }
  }, [fadeOutTimerRef, hoveredCircle, activatedQuadrant,]);

  // Sets quadrant as active if cursor within area defined by distance & angle
  useEffect(() => {
    const deactivateQuadrant = () => {
      if (!fadeOutTimerRef.current) {
        setActivatedQuadrant(aQ => aQ ? `${aQ}--fadeOut` : null);
        fadeOutTimerRef.current = setTimeout(() => {
          setActivatedQuadrant(
            aQ => aQ && aQ.includes('--fadeOut') ? null : aQ
          );
          fadeOutTimerRef.current = null;
        }, FADE_DURATION);
      }
    };

    const activateQuadrant = (quadrant) => {
      clearFadeOut();
      setActivatedQuadrant(quadrant);
    };

    if (typeof window !== undefined && hoveredCircle === null) {
      const cursorAbsoluteDistFromCentreX = Math.abs(cursorDistFromCentreX);
      const cursorAbsoluteDistFromCentreY = Math.abs(cursorDistFromCentreY);
      if (
        hasAnimatedIn && hasPlayedQuadrantCueAnimation &&
        (
          cursorAbsoluteDistFromCentreX <
          window.innerWidth * QUADRANT_DISTANCES.WINDOW_X_RATIO
        ) &&
        (
          cursorAbsoluteDistFromCentreY <
          window.innerHeight * QUADRANT_DISTANCES.WINDOW_Y_RATIO
        ) &&
        (
          cursorAbsoluteDistFromCentreX > QUADRANT_DISTANCES.X_THRESHOLD ||
          cursorAbsoluteDistFromCentreY > QUADRANT_DISTANCES.Y_THRESHOLD
        )
      ) {
        if (isCursorInLeftQuadrant(cursorAngle)) {
          activateQuadrant(QUADRANTS.LEFT);
        } else if (
          isCursorInTopQuadrant(cursorAngle, cursorAbsoluteDistFromCentreY)
        ) {
          activateQuadrant(QUADRANTS.TOP);
        } else if (isCursorInRightQuadrant(cursorAngle)) {
          activateQuadrant(QUADRANTS.RIGHT);
        } else if (isCursorInBottomQuadrant(cursorAngle)) {
          activateQuadrant(QUADRANTS.BOTTOM);
        } else {
          deactivateQuadrant();
        }
      } else {
        deactivateQuadrant();
      }
    } else {
      deactivateQuadrant();
    }
  },
  [
    clearFadeOut,
    cursorAngle,
    cursorDistFromCentreX,
    cursorDistFromCentreY,
    hasAnimatedIn,
    hasPlayedQuadrantCueAnimation,
    hoveredCircle,
  ]);

  useEffect(() => {
    if (!hasPlayedQuadrantCueAnimation && hasAnimatedIn) {
      const animationDuration = 1000;

      setTimeout(
        () => setHasPlayedQuadrantCueAnimation(true),
        QUADRANT_PROPERTIES[QUADRANTS.LEFT].animationDelay + animationDuration
      )

      setGetQuadrantCueAnimation(() => {
        return (quadrant) => {
          const animation = keyframes`
            0 {
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              opacity: 0;
            }
          `;
          return {
            animation: `${animation} ${animationDuration}ms ease-in-out`,
            animationDelay: `${QUADRANT_PROPERTIES[quadrant].animationDelay}ms`,
          }
        }
      });
    };
  }, [hasPlayedQuadrantCueAnimation, hasAnimatedIn,]);

  const runEasterEggAnimation = () => {
    if (!easterEgged) {
      setEasterEgged(true);
      setTimeout(() => setEasterEgged(false), 1600);
    }
  };

  const onExpandCircle = (circleIndex) => {
    clearFadeOut();
    if (hasAnimatedIn) {
      setHasPlayedQuadrantCueAnimation(true);
      setExpandedCircle(circleIndex);
    }
  };

  const onHoverCircle = (circleIndex) => {
    clearFadeOut();
    if (!easterEgged) {
      if (hoveredCircle !== null && circleIndex === null) {
        setHoveredCircle(`${hoveredCircle}--fadeOut`);
        fadeOutTimerRef.current = setTimeout(() => {
          setHoveredCircle(
            hC => typeof hC === 'string' && hC.includes('--fadeOut') ? null : hC
          );
          fadeOutTimerRef.current = null;
        }, FADE_DURATION);
      } else {
        setHoveredCircle(circleIndex);
      }
    }
  };

  const pupilAnimation = keyframes`
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.15);
    }
    100% {
      transform: scale(1);
    }
  `;

  const eyelidAnimation = keyframes`
    0 {
      transform: translateY(-11em);
    }
    2% {
      transform: translateY(0);
    }
    4% {
      transform: translateY(-11em);
    }
    100% {
      transform: translateY(-11em);
    }
  `;

  const irisAnimation = keyframes`
    0 {
      background: linear-gradient(#FFF, #FFF);
    }
    2% {
      background: linear-gradient(
        180deg, rgba(0,0,0,1) 50%, rgba(0,0,0,0.6) 100%
      );
    }
    4% {
      background: linear-gradient(#FFF, #FFF);
    }
    100% {
      background: linear-gradient(#FFF, #FFF);
    }
  `;

  const blockHoverEffects =
    !hasAnimatedIn ||
    !hasPlayedQuadrantCueAnimation ||
    expandedCircle ||
    easterEgged;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: `var(--height-content)`,
        opacity: animateInReady ? 1 : 0,
        transition: `opacity ${INITIAL_ANIMATION_DURATION} ease-in`,
      }}
    >
      <Box
        ref={containerRef}
        sx={{ width: '20em', margin: '0 auto', }}
      >
        <CircleTriad
          quadrant={QUADRANTS.TOP}
          quadrantHeading={QUADRANT_PROPERTIES[QUADRANTS.TOP].heading}
          circles={outerCircles}
          expandedCircle={expandedCircle}
          onExpandCircle={onExpandCircle}
          hoveredCircle={hoveredCircle}
          onHoverCircle={onHoverCircle}
          animateInReady={animateInReady}
          hasAnimatedIn={hasAnimatedIn}
          activatedQuadrant={activatedQuadrant}
          getQuadrantCueAnimation={
            !hasPlayedQuadrantCueAnimation && getQuadrantCueAnimation
          }
          blockHoverEffects={blockHoverEffects}
          easterEgged={easterEgged}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            height: '11em', width: '20em',
            margin: '0 auto',
          }}
        >
          <CircleTriad
            quadrant={QUADRANTS.LEFT}
            quadrantHeading={QUADRANT_PROPERTIES[QUADRANTS.LEFT].heading}
            circles={outerCircles}
            expandedCircle={expandedCircle}
            onExpandCircle={onExpandCircle}
            hoveredCircle={hoveredCircle}
            onHoverCircle={onHoverCircle}
            animateInReady={animateInReady}
            hasAnimatedIn={hasAnimatedIn}
            activatedQuadrant={activatedQuadrant}
            getQuadrantCueAnimation={
              !hasPlayedQuadrantCueAnimation && getQuadrantCueAnimation
            }
            blockHoverEffects={blockHoverEffects}
            easterEgged={easterEgged}
          />
          <Quadrilateral
            sx={{
              height: '14em',
              width: '14em',
              margin: '-1.5em 0 0',
              padding: '1.5em',
              borderRadius: '50%',
              backgroundColor: '#000',
            }}
          >
            <Quadrilateral sx={{ backgroundColor: '#000', }}>
              <Circle
                sx={{
                  position: 'relative',
                  height: '11em',
                  width: '11em',
                  backgroundColor: '#FFF',
                  animation: `${irisAnimation} 10000ms infinite linear`,
                  animationDelay: '5000ms',
                }}
                clipMode
              >
                <Quadrilateral
                  sx={{
                    position: 'absolute',
                    top: 0,
                    width: '11em',
                    height: '11em',
                    zIndex: 1,
                    borderRadius: '50%',
                    backgroundColor: '#000',
                    transform: 'translateY(-11em)',
                    animation: `${eyelidAnimation} 10000ms infinite linear`,
                    animationDelay: '5000ms',
                  }}
                />
                <Circle
                  sx={{
                    animation: `${pupilAnimation} 6000ms infinite`,
                    animationFillMode: 'forwards',
                  }}
                  clipMode
                >
                  <Circle
                    sx={{
                      zIndex: -2,
                      transform: `rotate(${cursorAngle || 225}deg)`,
                      backgroundColor: '#000',
                    }}
                    clipMode
                  >
                    <Circle
                      sx={{
                        width: '0.75em',
                        height: '0.75em',
                        zIndex: -1,
                        transform: `translate(0, 0.5em)`,
                        backgroundColor: '#FFF',
                        boxShadow: '0 0 6px 3px rgba(255, 255, 255, 0.3)',
                      }}
                      onClick={runEasterEggAnimation}
                    />
                  </Circle>
                </Circle>
              </Circle>
            </Quadrilateral>
          </Quadrilateral>
          <CircleTriad
            quadrant={QUADRANTS.RIGHT}
            quadrantHeading={QUADRANT_PROPERTIES[QUADRANTS.RIGHT].heading}
            circles={outerCircles}
            expandedCircle={expandedCircle}
            onExpandCircle={onExpandCircle}
            hoveredCircle={hoveredCircle}
            onHoverCircle={onHoverCircle}
            animateInReady={animateInReady}
            hasAnimatedIn={hasAnimatedIn}
            activatedQuadrant={activatedQuadrant}
            getQuadrantCueAnimation={
              !hasPlayedQuadrantCueAnimation && getQuadrantCueAnimation
            }
            blockHoverEffects={blockHoverEffects}
            easterEgged={easterEgged}
          />
        </Box>
        <CircleTriad
          quadrant={QUADRANTS.BOTTOM}
          quadrantHeading={QUADRANT_PROPERTIES[QUADRANTS.BOTTOM].heading}
          circles={outerCircles}
          expandedCircle={expandedCircle}
          onExpandCircle={onExpandCircle}
          hoveredCircle={hoveredCircle}
          onHoverCircle={onHoverCircle}
          animateInReady={animateInReady}
          hasAnimatedIn={hasAnimatedIn}
          activatedQuadrant={activatedQuadrant}
          getQuadrantCueAnimation={
            !hasPlayedQuadrantCueAnimation && getQuadrantCueAnimation
          }
          blockHoverEffects={blockHoverEffects}
          easterEgged={easterEgged}
        />
      </Box>
    </Box>
)};

export default HeavenlyCity;
