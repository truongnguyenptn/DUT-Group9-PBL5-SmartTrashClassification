import { Spin } from 'antd';

import loadableComponent from '@loadable/component';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const loadable = (loadFn: (props: unknown) => Promise<any>) =>
  loadableComponent(loadFn, {
    fallback: (
      <div className="flex h-full w-full items-center justify-center">
        <Spin />
      </div>
    ),
  });

export default loadable;
