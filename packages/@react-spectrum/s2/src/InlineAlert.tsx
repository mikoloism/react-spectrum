/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import AlertTriangle from '../s2wf-icons/assets/svg/S2_Icon_AlertTriangle_20_N.svg';
import CheckmarkCircle from '../s2wf-icons/assets/svg/S2_Icon_CheckmarkCircle_20_N.svg';
import {DOMProps, DOMRef} from '@react-types/shared';
import {filterDOMProps} from '@react-aria/utils';
import {StyleProps, focusRing, getAllowedOverrides} from './style-utils' with {type: 'macro'};
import InfoCircle from '../s2wf-icons/assets/svg/S2_Icon_InfoCircle_20_N.svg';
import NoticeSquare from '../s2wf-icons/assets/svg/S2_Icon_Notice_20_N.svg';
import {ReactNode, forwardRef, useEffect, useRef} from 'react';
import {useDOMRef} from '@react-spectrum/utils';
import {style} from '../style/spectrum-theme' with {type: 'macro'};
import {useFocusRing} from 'react-aria';
import {Provider, HeadingContext} from 'react-aria-components';
import {ContentContext} from './Content';
import {IconContext} from './Icon';

export interface InlineAlertProps extends DOMProps, StyleProps, InlineStylesProps {
  /**
   * The contents of the Inline Alert.
   */
  children: ReactNode,
  /**
   * Whether to automatically focus the Inline Alert when it first renders.
   */
  autoFocus?: boolean
}

interface InlineStylesProps {
  /**
   * The semantic tone of a Inline Alert.
   * @default neutral
   */
  variant?: 'informative' | 'positive' | 'notice' | 'negative' | 'neutral',
  /**
   * The visual style of the Inline Alert.
   * @default border
   */
  fillStyle?: 'border' | 'subtleFill' | 'boldFill'
}

const inlineAlert = style<InlineStylesProps & {isFocusVisible?: boolean}>({
  ...focusRing(),
  display: 'inline-block',
  position: 'relative',
  boxSizing: 'border-box',
  maxWidth: 320,
  fontSize: 'ui',
  fontFamily: 'sans',
  padding: 24,
  borderRadius: 'lg',
  borderStyle: 'solid',
  borderWidth: 2,
  borderColor: {
    fillStyle: {
      border: {
        variant: {
          informative: 'informative-800',
          positive: 'positive-700',
          notice: 'notice-700',
          negative: 'negative-800',
          neutral: 'gray-700' // is there a semantic color name for neutral?
        }
      },
      subtleFill: 'transparent',
      boldFill: 'transparent'
    }
  },
  backgroundColor: {
    variant: {
      informative: {
        fillStyle: {
          border: 'gray-25',
          subtleFill: 'informative-subtle',
          boldFill: 'informative'
        }
      },
      positive: {
        fillStyle: {
          border: 'gray-25',
          subtleFill: 'positive-subtle',
          boldFill: 'positive'
        }
      },
      notice: {
        fillStyle: {
          border: 'gray-25',
          subtleFill: 'notice-subtle',
          boldFill: 'notice'
        }
      },
      negative: {
        fillStyle: {
          border: 'gray-25',
          subtleFill: 'negative-subtle',
          boldFill: 'negative'
        }
      },
      neutral: {
        fillStyle: {
          border: 'gray-25',
          subtleFill: 'neutral-subtle',
          boldFill: 'neutral-subdued'
        }
      }
    }
  },
  color: {
    default: 'gray-900',
    fillStyle: {
      boldFill: {
        default: 'white',
        variant: {
          notice: 'black'
        }
      }
    }
  }
}, getAllowedOverrides());

const icon = style<InlineStylesProps>({
  gridArea: 'icon',
  '--iconPrimary': {
    type: 'fill',
    value: {
      fillStyle: {
        border: {
          variant: {
            informative: 'informative',
            positive: 'positive',
            notice: 'notice',
            negative: 'negative',
            neutral: 'neutral'
          }
        },
        subtleFill: {
          variant: {
            informative: 'informative',
            positive: 'positive',
            notice: 'notice',
            negative: 'negative',
            neutral: 'neutral'
          }
        },
        boldFill: {
          default: 'white',
          variant: {
            notice: 'black'
          }
        }
      }
    }
  }
});

const grid = style({
  display: 'grid',
  columnGap: 24,
  gridTemplateColumns: '1fr auto',
  gridTemplateRows: 'auto auto auto',
  width: 'full',
  gridTemplateAreas: [
    'heading icon',
    'content content'
  ]
});

let ICONS = {
  informative: InfoCircle,
  positive: CheckmarkCircle,
  notice: NoticeSquare,
  negative: AlertTriangle,
  neutral: undefined
};

const heading = style<InlineStylesProps>({
  marginTop: 0,
  gridArea: 'heading',
  fontSize: 'ui',
  lineHeight: 'ui',
  color: '[inherit]'
});

const content = style<InlineStylesProps>({
  gridArea: 'content',
  fontSize: 'body-sm',
  lineHeight: 'body'
});

function InlineAlert(props: InlineAlertProps, ref: DOMRef<HTMLDivElement>) {
  let {
    children,
    variant = 'neutral',
    fillStyle = 'border',
    autoFocus
  } = props;

  let domRef = useDOMRef(ref);

  let Icon = null;
  let iconAlt = '';
  if (variant in ICONS) {
    Icon = ICONS[variant];
    iconAlt = variant;
  }

  let {isFocusVisible, focusProps} = useFocusRing({autoFocus: props.autoFocus});
  let autoFocusRef = useRef(props.autoFocus);
  useEffect(() => {
    if (autoFocusRef.current && domRef.current) {
      domRef.current.focus();
    }
    autoFocusRef.current = false;
  }, [domRef]);

  return (
    <div
      {...filterDOMProps(props)}
      {...focusProps}
      ref={domRef}
      tabIndex={autoFocus ? -1 : undefined}
      autoFocus={autoFocus}
      role="alert"
      style={props.UNSAFE_style}
      className={(props.UNSAFE_className || '') + inlineAlert({
        variant,
        fillStyle,
        isFocusVisible
      }, props.styles)}>
      <div
        className={grid}>
        <Provider
          values={[
            // @ts-ignore
            [HeadingContext, {className: heading}],
            // @ts-ignore
            [ContentContext, {className: content}],
            [IconContext, {styles: icon({variant, fillStyle})}]
          ]}>
          {Icon && <Icon aria-label={iconAlt} />}
          {children}
        </Provider>
      </div>
    </div>
  );
}

/**
 * Inline alerts display a non-modal message associated with objects in a view.
 * These are often used in form validation, providing a place to aggregate feedback related to multiple fields.
 */
const _InlineAlert = /*#__PURE__*/ forwardRef(InlineAlert);
export {_InlineAlert as InlineAlert};