import {
  ColorSlider as AriaColorSlider,
  ColorSliderProps as AriaColorSliderProps,
  SliderOutput,
  SliderTrack
} from 'react-aria-components';
import {FieldLabel} from './Field';
import {style} from '../style/spectrum-theme' with {type: 'macro'};
import {ColorHandle} from './ColorHandle';
import {forwardRef, useRef} from 'react';
import {StyleProps, getAllowedOverrides} from './style-utils' with {type: 'macro'};
import {useDOMRef} from '@react-spectrum/utils';
import {DOMRef} from '@react-types/shared';

export interface ColorSliderProps extends Omit<AriaColorSliderProps, 'children' | 'className' | 'style'>, StyleProps {
  label?: string
}

function ColorSlider(props: ColorSliderProps, ref: DOMRef<HTMLDivElement>) {
  let {UNSAFE_className = '', UNSAFE_style, styles} = props;
  let containerRef = useDOMRef(ref);
  let trackRef = useRef(null);
  return (
    <AriaColorSlider 
      {...props}
      ref={containerRef}
      style={UNSAFE_style}
      // The visual label is hidden when vertical, so make it an aria-label instead.
      aria-label={props['aria-label'] || (props.orientation === 'vertical' ? props.label : undefined)}
      className={renderProps => UNSAFE_className + style({
        width: {
          orientation: {
            horizontal: 192
          }
        },
        height: {
          orientation: {
            vertical: 192
          }
        },
        display: {
          orientation: {
            horizontal: 'grid',
            vertical: 'block'
          }
        },
        gridTemplateColumns: ['1fr', 'auto'],
        gridTemplateAreas: [
          'label output',
          'track track'
        ],
        rowGap: 4
      }, getAllowedOverrides())(renderProps, styles)}>
      {({isDisabled, orientation, state}) => (<>
        {orientation === 'horizontal' && props.label && 
          <FieldLabel isDisabled={isDisabled}>{props.label}</FieldLabel>
        }
        {orientation === 'horizontal' && 
          <SliderOutput
            className={style({
              gridArea: 'output',
              fontFamily: 'sans',
              fontSize: 'control',
              lineHeight: 'ui',
              cursor: 'default',
              color: {
                default: 'neutral-subdued',
                isDisabled: 'disabled'
              }
            })} />
        }
        <SliderTrack
          ref={trackRef}
          style={({defaultStyle, isDisabled}) => ({
            background: isDisabled ? undefined : `${defaultStyle.background}, repeating-conic-gradient(#E1E1E1 0% 25%, white 0% 50%) 50% / 16px 16px`
          })}
          className={style({
            gridArea: 'track',
            width: {
              orientation: {
                horizontal: 'full',
                vertical: 24
              }
            },
            height: {
              orientation: {
                horizontal: 24,
                vertical: 'full'
              }
            },
            borderRadius: 'default',
            outlineColor: {
              default: 'gray-1000/10',
              forcedColors: 'ButtonBorder'
            },
            outlineWidth: 1,
            outlineOffset: -1,
            outlineStyle: {
              default: 'solid',
              isDisabled: 'none'
            },
            backgroundColor: {
              isDisabled: 'disabled'
            }
          })}>
          <ColorHandle 
            containerRef={trackRef}
            getPosition={() => {
              let x = state.orientation === 'horizontal' ? state.getThumbPercent(0) : 0.5;
              let y = state.orientation === 'horizontal' ? 0.5 : 1 - state.getThumbPercent(0);
              return {x, y};
            }} />
        </SliderTrack>
      </>)}
    </AriaColorSlider>
  );
}

/**
 * A ColorSlider allows users to adjust an individual channel of a color value.
 */
let _ColorSlider = forwardRef(ColorSlider);
export {_ColorSlider as ColorSlider};