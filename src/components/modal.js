import React, { forwardRef, useEffect, useRef, useState, } from 'react';
import { styled } from '@mui/material/styles';
import { Box, IconButton, Typography, } from '@mui/material';
import { keyframes } from '@mui/system';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import Circle from './circle';
import WildCardLogo from '../images/svg/wild_card_logo.svg';
import DangerFarmsLogo from '../images/svg/danger_farms_logo.svg';
import SpareRoomLogo from '../images/svg/spareroom_logo.svg';
import TravelLogo from '../images/svg/travel_logo.svg';
import XRLogo from '../images/svg/xr_logo.svg';
import PhilosophyLogo from '../images/svg/philosophy_logo.svg';
import UdacityLogo from '../images/svg/udacity_logo.svg';
import CambridgeLogo from '../images/svg/cambridge_logo.svg';
import EDXLogo from '../images/svg/edx_logo.svg';
import NHRPLogo from '../images/svg/nhrp_logo.svg';
import ClariceLogo from '../images/svg/clarice_logo.svg';
import QRILogo from '../images/svg/qri_logo.svg';

import { QUADRANTS } from '../constants';


const getCircleImage = (
  slug,
) => {
  const styles = {
    maxHeight: '11em',
    margin: 'auto',
  };

  const circleImages = {
    wild_card:
      <WildCardLogo
        className='animatedSvg'
        style={{...styles, marginTop: '12%',}}
      />,
    danger_farms:
      <DangerFarmsLogo
        className='animatedSvg'
        style={{...styles, marginTop: '27%',}}
      />,
    spareroom:
      <SpareRoomLogo
        className='animatedSvg'
        style={{...styles, marginTop: '18%',}}
      />,
    travel:
      <TravelLogo
        className='animatedSvg'
        style={{...styles, marginTop: '26%',}}
      />,
    xr:
      <XRLogo
        className='animatedSvg'
        style={{...styles, marginTop: '23%',}}
      />,
    philosophy:
      <PhilosophyLogo
        className='animatedSvg'
        style={{...styles, marginTop: '15%',}}
      />,
    udacity:
      <UdacityLogo
        className='animatedSvg'
        style={{...styles, marginTop: '30%',}}
      />,
    cambridge:
      <CambridgeLogo
        className='animatedSvg'
        style={{...styles, marginTop: '24%',}}
      />,
    other_coding:
      <EDXLogo
        className='animatedSvg'
        style={{...styles, marginTop: '20%',}}
      />,
    nhrp:
      <NHRPLogo
        className='animatedSvg'
        style={{...styles, marginTop: '20%',}}
      />,
    clarice:
      <ClariceLogo
        className='animatedSvg'
        style={{...styles, marginTop: '20%',}}
      />,
    qri:
      <QRILogo
        className='animatedSvg'
        style={{...styles, marginTop: '25%',}}
      />,
  };
  return circleImages[slug];
};

const ModalButton = styled(forwardRef((props, ref) =>
  <IconButton ref={ref} disableRipple {...props} />
))(() => ({
    width: '2.5em',
    height: '100%',
    padding: 0,
    borderRadius: 0,
}));

const ArrowIcon = styled(
  ({ fill, hovered, position, ...otherProps }) => position === 'left' ?
    <ArrowBackIosIcon {...otherProps} /> :
    <ArrowForwardIosIcon {...otherProps} viewBox='0 0 12 24' />
)(({ fill, hovered, position, }) => ({
  width: '2em',
  height: '2em',
  marginRight: position === 'left' ? 'auto' : '0.5em',
  marginLeft: position === 'left' ? '0.5em' : 'auto',
  fill,
  opacity: hovered === position ? 0.8 : 0.3,
}));

const arrowsRotation =
  [335, 0, 25, 65, 90, 115, 155, 180, 205, 245, 270, 295,];

const ExternalLink = ({ link, children, }) => (
  <a
    className='animatedText'
    href={link}
    target='_blank'
    rel='noreferrer'
  >
    {children}
  </a>
);

const Modal = ({
  circle,
  circles,
  isExpanded,
  baseColourAnimationStyles,
  getColourAnimation,
  onExpandCircle,
}) => {
  const [hoveredButton, setHoveredButton] = useState(null);

  const discButtonRef = useRef();
  const leftButtonRef = useRef();
  const rightButtonRef = useRef();

  const moveForward = () => {
    onExpandCircle((circle.index + 1) % circles.length);
  }

  const moveBack = () => {
    const nextIndex = circle.index - 1;
    onExpandCircle(
      nextIndex < 0 ? circles.length + nextIndex : nextIndex
    );
  }

  const onKeyDown = (event, position) => {
    if (event.key === 'Escape') {
      onExpandCircle(null);
    }
    if (
      event.key === 'ArrowRight' ||
      (position === 'right' && event.key === 'Enter')
    ) {
      moveForward();
    }
    if (
      event.key === 'ArrowLeft' ||
      (position === 'left' && event.key === 'Enter')
    ) {
      moveBack();
    }
  };

  const modalAnimation = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  `;

  const textColourAnimation = keyframes`
    ${getColourAnimation(false, true, 'color',)}
  `;
  const svgColourAnimation = keyframes`
    ${getColourAnimation(false, true, 'fill',)}
  `;

  useEffect(() => {
    if (rightButtonRef.current && isExpanded) {
      rightButtonRef.current.focus();
    }
  }, [rightButtonRef, isExpanded]);

  useEffect(() => {
    const discButton = discButtonRef.current;
    const onClick = (event) => {
      if (
        typeof window !== undefined &&
        isExpanded &&
        rightButtonRef.current && leftButtonRef.current &&
        !rightButtonRef.current.contains(event.target) &&
        !leftButtonRef.current.contains(event.target)
      ) {
        window.open(circle.link, '_blank', 'noreferrer')?.focus();
      }
    }

    if (isExpanded && discButtonRef.current) {
      discButton.addEventListener('mousedown', onClick);
      return () => discButton.removeEventListener('mousedown', onClick);
    }
  }, [isExpanded, discButtonRef, rightButtonRef, leftButtonRef, circle,]);

  return (
    <Circle
      sx={{
        display: 'flex',
        position: 'absolute',
        top: `
          calc(50% - ${circle.quadrant === QUADRANTS.LEFT ? '8' : '10'}em)
        `,
        right: `
          calc(50% - ${circle.quadrant === QUADRANTS.LEFT ? '16.55' : '8'}em)
        `,
        width: '16em',
        height: '16em',
        zIndex: 10,
        opacity: 0,
        pointerEvents:  isExpanded ? 'initial' : 'none',
        ...(isExpanded && {
          animation: `${modalAnimation} 500ms ease-in`,
          animationFillMode: 'forwards',
          animationDelay: '500ms',
        }),
        '.animatedText, .animatedLinkContainer a': {
          animation: `${textColourAnimation}`,
          ...baseColourAnimationStyles,
        },
        '.animatedSvg': {
          animation: `${svgColourAnimation}`,
          ...baseColourAnimationStyles,
        },
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
      }}
    >
      <ExternalLink link={circle.link}>
        <Typography
          sx={{
            position: 'absolute',
            top: circle.heading.length > 12 ?
              ['-55%', '-70%', '-75%', '-75%',] :
              ['-45%', '-60%', '-65%', '-65%',],
            left: [0, '-12.5%', '-25%', '-25%',],
            width: ['100%', '125%', '150%', '150%',],
            fontFamily: 'Suez One',
            fontSize: ['2em', '2.5em', '3em', '3em',],
            visibility: ['hidden', 'visible',]
          }}
          variant='h1'
        >
          {circle.heading}
        </Typography>
      </ExternalLink>
      <Box sx={{ position: 'absolute', width: '100%', }}>
        {getCircleImage(circle.slug)}
      </Box>
      <Box
        ref={discButtonRef}
        sx={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          transform: `rotate(${arrowsRotation[circle.index]}deg)`,
          opacity: hoveredButton ? 0.8 : 0.2,
          transition: 'opacity 500ms ease-in-out',
          cursor: 'pointer',
        }}
      >
        <ModalButton
          ref={leftButtonRef}
          onClick={moveBack}
          onKeyDown={(event) => onKeyDown(event, 'left')}
          onMouseEnter={() => setHoveredButton(true)}
          onMouseLeave={() => setHoveredButton(null)}
          tabIndex={-1}
          title='left'
        >
          <ArrowIcon
            className='animatedSvg'
            hovered={hoveredButton}
            position={'left'}
          />
        </ModalButton >
        <ModalButton
          ref={rightButtonRef}
          onClick={moveForward}
          onKeyDown={(event) => onKeyDown(event, 'right')}
          onMouseEnter={() => setHoveredButton('right')}
          onMouseLeave={() => setHoveredButton(null)}
          position={'right'}
          tabIndex={0}
          title='right'
        >
          <ArrowIcon
            className='animatedSvg'
            hovered={hoveredButton}
            position={'right'}
          />
        </ModalButton>
      </Box>
      {circle.content && (
        <Box
          sx={{
            position: 'absolute',
            top: '20em',
            left: '-25%',
            width: '150%',
            padding: isExpanded ? '2em 1em 3em' : 0,
            ...(!isExpanded && {
              '*' : { height: 0, margin: 0, fontSize: 0, }
            }),
          }}
        >
          <ExternalLink link={circle.link}>
            <Typography
              sx={{
                height: ['auto', 0],
                fontFamily: 'Suez One',
                fontSize: ['2em', '2.5em', '3em', '3em',],
                marginBottom: ['1em', '0',],
                visibility: ['visible', 'hidden',]
              }}
              variant='h1'
            >
              {circle.heading}
            </Typography>
          </ExternalLink>
          <Typography
            className='animatedLinkContainer'
            component='div'
            sx={{
              position: 'relative',
              width: '100%',
              textAlign: 'left',
              fontFamily: 'Alata',
            }}
            dangerouslySetInnerHTML={{ __html: circle.content }}
          />
        </Box>
      )}
    </Circle>
  );
};

export default Modal;
