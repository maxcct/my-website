import React, { useEffect, useState, } from 'react';
import { isMobile } from 'react-device-detect';
import { keyframes } from '@mui/system';
import { styled } from '@mui/material/styles';
import { Box, Typography, } from '@mui/material';

import OuterCircle from './outerCircle';
import { FADE_DURATION, GROUPS, } from '../constants';

const CircleTriadContainer = styled((props) => <Box {...props} />
)((props) => ({
  display: 'flex',
  flexDirection: props.right || props.left ? 'column' : 'row',
  [props.right || props.left ? 'height' : 'width']: '11em',
  marginTop: props.right || props.left ? 'auto' : 0,
  marginRight: props.left ? 0 : 'auto',
  marginBottom: props.right || props.left ? 'auto' : 0,
  marginLeft: props.right ? 0 : 'auto',
  ...(props.left && { position: 'relative', zIndex: 2, }),
}));

const getTextAlign = (group) => {
  if (group === 'left') {
    return 'right'
  }
  if (group === 'right') {
    return 'left';
  }
  return 'center';
}

const Heading = ({
  group,
  groupHeading,
  circleHeading,
  groupCueAnimation,
  isFadingOut,
  mobileGroupCueAnimations,
}) => {
  const [mobileAnimationGroup, setMobileAnimationGroup] = useState(null);

  useEffect(() => {
    if (isMobile && groupCueAnimation && group === 'bottom') {
      Object.keys(GROUPS).forEach((GROUP) =>
        setTimeout(() =>
          setMobileAnimationGroup(GROUP),
          GROUPS[GROUP].animationDelay
        )
      );
    }
  }, [group, groupCueAnimation,]);

  const mobileAnimationHeading = mobileAnimationGroup ?
    GROUPS[mobileAnimationGroup].heading : null;

  const cueAnimation = mobileGroupCueAnimations && mobileAnimationGroup ?
    mobileGroupCueAnimations.find(animationGroup =>
      animationGroup[mobileAnimationGroup])[mobileAnimationGroup] :
    groupCueAnimation;

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
          group === 'top' || group === 'bottom' ? 'max-content' : 'initial',
        maxWidth:
          group === 'right' || group === 'left' ?
          ['max-content', 'min-content', 'max-content', 'max-content',] :
          'initial',
        fontFamily: 'Suez One',
        ...(!isMobile && {
          fontSize: groupHeading ?
            ['1.5em', '1.5em', '2em', '2em',] :
            ['1em', '1.25em', '1.5em', '1.5em',],
        }),
        ...(isMobile && { fontSize: '2em', }),
        textAlign: getTextAlign(group),
        ...(!isMobile && { marginTop: group === 'bottom' ? '83%' : 'auto' }),
        ...(isMobile && { marginTop: '7em', }),
        marginBottom: group === 'top' ? '85%' : 'auto',
        marginRight: group === 'left' ? ['60%', '56%', '60%', '64%',] : 'auto',
        marginLeft: group === 'right' ? ['70%', '60%', '70%', '75%',] : 'auto',
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
      {mobileAnimationHeading || groupHeading || circleHeading}
    </Typography>
  );
};

const CircleTriad = ({
  circles,
  group,
  groupHeading,
  expandedCircle,
  onExpandCircle,
  hoveredCircle,
  onHoverCircle,
  animateInReady,
  hasAnimatedIn,
  activatedQuadrant,
  getGroupCueAnimation,
  blockHoverEffects,
  easterEgged,
}) => {
  const circleHeading = !blockHoverEffects && hoveredCircle !== null && circles
    .filter(circle => circle.group === group)
    .find(circle => circle.index === hoveredCircle || (
      typeof hoveredCircle === 'string' &&
      circle.index === parseInt(hoveredCircle)
    ))?.heading;

  const quadrantIsActive =
    !blockHoverEffects &&
    !circleHeading &&
    activatedQuadrant === group;
  const isGroupHeadingFadingOut =
    !blockHoverEffects &&
    !circleHeading &&
    activatedQuadrant &&
    activatedQuadrant.includes(group) &&
    activatedQuadrant.includes('--fadeOut');

  const isCircleHeadingFadingOut =
    !blockHoverEffects &&
    circleHeading &&
    typeof hoveredCircle === 'string' &&
    hoveredCircle.includes('--fadeOut');

  const groupCueAnimation =
    typeof getGroupCueAnimation === 'function' &&
    getGroupCueAnimation(group);

  const mobileGroupCueAnimations = isMobile &&
    typeof getGroupCueAnimation === 'function' ?
    Object.keys(GROUPS).map(GROUP => (
      { [GROUP]: getGroupCueAnimation(GROUP) }
    )) : null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection:
          group === 'left' || group === 'right' ? 'row' : 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        onClick={() => onExpandCircle(null)}
        sx={{
          position: 'absolute',
          display: [
            groupCueAnimation && group === 'bottom' ?
              'flex' : 'none', 'flex', 'flex',
          ],
          width: group === 'left' ? '28em' : '14em',
          minWidth:
            isMobile ? 'max-content' : ['14em', '14em', 'max-content',],
          height: '14em',
        }}
      >
        {
          expandedCircle === null &&
          (
            activatedQuadrant === group ||
            isGroupHeadingFadingOut ||
            groupCueAnimation
          ) &&
          !circleHeading &&
          (
            <Heading
              group={group}
              groupHeading={groupHeading}
              groupCueAnimation={groupCueAnimation}
              isFadingOut={isGroupHeadingFadingOut}
              mobileGroupCueAnimations={mobileGroupCueAnimations}
            />
          )
        }
        {expandedCircle === null && !groupCueAnimation && circleHeading && (
          <Heading
            group={group}
            circleHeading={circleHeading}
            isFadingOut={isCircleHeadingFadingOut}
          />
        )}
      </Box>
      <CircleTriadContainer left={group === 'left'} right={group === 'right'}>
        {
          circles.filter((circle) => circle.group === group)
            .sort((a, b) => a.groupOrder > b.groupOrder ? 1 : -1)
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
                groupCueAnimation={groupCueAnimation}
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
