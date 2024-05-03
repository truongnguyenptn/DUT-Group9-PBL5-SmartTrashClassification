import { ReactElement } from 'react';

interface ConditionalWrapperProps {
  condition: boolean;
  wrapper: (children: ReactElement) => JSX.Element;
  children: ReactElement;
}
function ConditionalWrapper({
  condition,
  wrapper,
  children,
}: ConditionalWrapperProps) {
  return condition ? wrapper(children) : <>{children}</>;
}

export default ConditionalWrapper;
