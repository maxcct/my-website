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
  GROUPS,
  INITIAL_ANIMATION_DURATION,
} from '../constants';



const HeavenlyCity = ({ outerCircles }) => {
  const [cursorAngle, setCursorAngle] = useState(null);
  const [cursorDistFromCentreX, setCursorDistFromCentreX] = useState(0);
  const [cursorDistFromCentreY, setCursorDistFromCentreY] = useState(0);
  const [expandedCircle, setExpandedCircle] = useState(null);
  const [hoveredCircle, setHoveredCircle] = useState(null);
  const [activatedQuadrant, setActivatedQuadrant] = useState(null);
  const [animateInReady, setAnimateInReady] = useState(false);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const [getGroupCueAnimation, setGetGroupCueAnimation] = useState(null);
  const [
    hasPlayedGroupCueAnimation, setHasPlayedGroupCueAnimation
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

    const activateQuadrant = (group) => {
      clearFadeOut();
      setActivatedQuadrant(group);
    };

    if (typeof window !== undefined && hoveredCircle === null) {
      const cursorAbsoluteDistFromCentreX = Math.abs(cursorDistFromCentreX);
      const cursorAbsoluteDistFromCentreY = Math.abs(cursorDistFromCentreY);
      if (
        hasAnimatedIn && hasPlayedGroupCueAnimation &&
        (cursorAbsoluteDistFromCentreX < window.innerWidth / 3) &&
        (cursorAbsoluteDistFromCentreY < window.innerHeight / 2.5) &&
        (
          cursorAbsoluteDistFromCentreX > 90 ||
          cursorAbsoluteDistFromCentreY > 90
        )
      ) {
        if (cursorAngle >= 55 && cursorAngle < 125) {
          activateQuadrant('left');
        } else if (
          ((cursorAngle > 0 && cursorAngle >= 145 && cursorAngle < 180) ||
          (cursorAngle < 0 && cursorAngle >= -180 && cursorAngle < -145)) &&
          cursorAbsoluteDistFromCentreY > 130
          )
        {
          activateQuadrant('top');
        } else if (cursorAngle >= -125 && cursorAngle < -55) {
          activateQuadrant('right');
        } else if (
          (cursorAngle < 0 && cursorAngle >= -35) ||
          (cursorAngle >= 0  && cursorAngle < 35))
        {
          activateQuadrant('bottom');
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
    hasPlayedGroupCueAnimation,
    hoveredCircle,
  ]);

  useEffect(() => {
    if (!hasPlayedGroupCueAnimation && hasAnimatedIn) {
      const animationDuration = 1000;

      setTimeout(
        () => setHasPlayedGroupCueAnimation(true),
        GROUPS.left.animationDelay + animationDuration
      )

      setGetGroupCueAnimation(() => {
        return (group) => {
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
            animationDelay: `${GROUPS[group].animationDelay}ms`,
          }
        }
      });
    };
  }, [hasPlayedGroupCueAnimation, hasAnimatedIn,]);

  const runEasterEggAnimation = () => {
    if (!easterEgged) {
      setEasterEgged(true);
      setTimeout(() => setEasterEgged(false), 1600);
    }
  };

  const onExpandCircle = (circleIndex) => {
    clearFadeOut();
    if (hasAnimatedIn) {
      setHasPlayedGroupCueAnimation(true);
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
    !hasPlayedGroupCueAnimation ||
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
          group='top'
          groupHeading={GROUPS.top.heading}
          circles={outerCircles}
          expandedCircle={expandedCircle}
          onExpandCircle={onExpandCircle}
          hoveredCircle={hoveredCircle}
          onHoverCircle={onHoverCircle}
          animateInReady={animateInReady}
          hasAnimatedIn={hasAnimatedIn}
          activatedQuadrant={activatedQuadrant}
          getGroupCueAnimation={
            !hasPlayedGroupCueAnimation && getGroupCueAnimation
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
            group='left'
            groupHeading={GROUPS.left.heading}
            circles={outerCircles}
            expandedCircle={expandedCircle}
            onExpandCircle={onExpandCircle}
            hoveredCircle={hoveredCircle}
            onHoverCircle={onHoverCircle}
            animateInReady={animateInReady}
            hasAnimatedIn={hasAnimatedIn}
            activatedQuadrant={activatedQuadrant}
            getGroupCueAnimation={
              !hasPlayedGroupCueAnimation && getGroupCueAnimation
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
            group='right'
            groupHeading={GROUPS.right.heading}
            circles={outerCircles}
            expandedCircle={expandedCircle}
            onExpandCircle={onExpandCircle}
            hoveredCircle={hoveredCircle}
            onHoverCircle={onHoverCircle}
            animateInReady={animateInReady}
            hasAnimatedIn={hasAnimatedIn}
            activatedQuadrant={activatedQuadrant}
            getGroupCueAnimation={
              !hasPlayedGroupCueAnimation && getGroupCueAnimation
            }
            blockHoverEffects={blockHoverEffects}
            easterEgged={easterEgged}
          />
        </Box>
        <CircleTriad
          group='bottom'
          groupHeading={GROUPS.bottom.heading}
          circles={outerCircles}
          expandedCircle={expandedCircle}
          onExpandCircle={onExpandCircle}
          hoveredCircle={hoveredCircle}
          onHoverCircle={onHoverCircle}
          animateInReady={animateInReady}
          hasAnimatedIn={hasAnimatedIn}
          activatedQuadrant={activatedQuadrant}
          getGroupCueAnimation={
            !hasPlayedGroupCueAnimation && getGroupCueAnimation
          }
          blockHoverEffects={blockHoverEffects}
          easterEgged={easterEgged}
        />
      </Box>
    </Box>
)};

export default HeavenlyCity;
