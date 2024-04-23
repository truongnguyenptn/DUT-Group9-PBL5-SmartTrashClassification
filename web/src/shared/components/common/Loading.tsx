import { Spin } from 'antd';

function Loading() {
  return (
    <div className="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center">
      <Spin />
    </div>
  );
}

export default Loading;
