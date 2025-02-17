import type { Story } from '@storybook/react';
import Toast from './component';
import { ToastProps } from './types';

export default {
  title: 'Components/Toast',
  component: Toast,
  argTypes: {},
};

const Template: Story<ToastProps> = (args: ToastProps) => {
  const { level } = args;

  return <Toast key={level} {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  content: 'Source name',
  level: 'success',
};
