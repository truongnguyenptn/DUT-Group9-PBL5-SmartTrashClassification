import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface LoadingScreenProps {
  visible?: boolean;
  delay?: number;
}

export default function LoadingScreen({
  visible: visibleProp = false,
  delay = 300,
}: LoadingScreenProps) {
  const [visible, setVisible] = useState(visibleProp);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined = undefined;
    if (visible !== visibleProp) {
      // Just delay when hiding (state change from true -> false.)
      if (visible) {
        timeoutId = setTimeout(() => setVisible(visibleProp), delay);
      } else {
        setVisible(visibleProp);
      }
    }

    return () => timeoutId && clearTimeout(timeoutId);
  }, [delay, visible, visibleProp]);

  return (
    <div
      className={twMerge(
        'absolute inset-0 z-40 flex h-full w-full items-center justify-center rounded-xl bg-white ease-out md:rounded-none',
        !visible &&
          'pointer-events-none opacity-0 transition-opacity duration-300',
      )}
    >
      <Spin />
    </div>
  );
}
