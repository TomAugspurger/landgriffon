import { useState } from 'react';
import type { Story } from '@storybook/react';

import Search from './component';
import type { SearchProps } from './component';

export default {
  title: 'Components/Search',
  component: Search,
  argTypes: {
    theme: {
      control: {
        type: 'select',
        options: ['dark', 'light'],
      },
    },
    size: {
      control: {
        type: 'select',
        options: ['sm', 'base'],
      },
    },
    labelRef: {
      control: {
        disable: true,
      },
    },
  },
};

const Template: Story<SearchProps> = ({ ...args }: SearchProps) => {
  const [value, setValue] = useState('');

  const onChange = (e) => {
    setValue(e);
  };

  return (
    <>
      <Search id="search-component" value={value} onChange={onChange} {...args} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Search by feature, planning area name...',
};
