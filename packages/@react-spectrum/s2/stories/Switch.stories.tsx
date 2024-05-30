import {Switch} from '../src';
import type {Meta} from '@storybook/react';
import {style} from '../style/spectrum-theme' with {type: 'macro'};

const meta: Meta<typeof Switch> = {
  component: Switch,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
};

export default meta;

export const Example = (args: any) => <Switch {...args}>Wi-Fi</Switch>;

export const LongLabel = (args: any) => (<Switch {...args} styles={style({maxWidth: 128})}>Switch with very long label so we can see wrapping</Switch>);