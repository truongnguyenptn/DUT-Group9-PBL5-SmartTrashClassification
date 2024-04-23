import { useToggle } from '@enouvo/react-hooks';
import noop from 'lodash-es/noop';
import { createContext, useState } from 'react';
import type { RangeDate } from '#/shared/utils/type/date';

export interface ChatContextProps {
  filter: {
    visible: boolean;
    toggleVisible: () => void;
    onOpen: () => void;
    onClose: () => void;
  };
  isPendingChat: {
    value: boolean;
    setValue: React.Dispatch<React.SetStateAction<boolean>>;
  };
  searchValue: {
    value: string | undefined;
    setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  };
  rangeDate: {
    setValue: React.Dispatch<React.SetStateAction<RangeDate | undefined>>;
    value: RangeDate | undefined;
  };
}

interface Props {
  children: React.ReactNode;
}

export const ChatContext = createContext<ChatContextProps>({
  filter: {
    onClose: noop,
    onOpen: noop,
    toggleVisible: noop,
    visible: false,
  },
  isPendingChat: {
    setValue: noop,
    value: false,
  },
  rangeDate: {
    setValue: noop,
    value: undefined,
  },
  searchValue: {
    setValue: noop,
    value: undefined,
  },
});

export function ChatContextProvider({ children }: Props) {
  const [filterVisible, onOpenFilter, onCloseFilter, onToggleFilter] =
    useToggle(false);

  const [isPendingAsyncAction, setIsPendingAsyncAction] = useState(false);
  const [searchValue, setSearchValue] = useState<string | undefined>();
  const [rangeDate, setRangeDate] = useState<RangeDate | undefined>();

  return (
    <ChatContext.Provider
      value={{
        filter: {
          onClose: onCloseFilter,
          onOpen: onOpenFilter,
          toggleVisible: onToggleFilter,
          visible: filterVisible,
        },
        isPendingChat: {
          setValue: setIsPendingAsyncAction,
          value: isPendingAsyncAction,
        },
        rangeDate: {
          setValue: setRangeDate,
          value: rangeDate,
        },
        searchValue: {
          setValue: setSearchValue,
          value: searchValue,
        },
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
