import { Badge } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ChatModal from '../chat/ChatModal';
import LanguageSelector from '../selectors/LanguageSelector';
import NavBar from './NavBar';
import { getEmail } from '#/shared/utils/localStorage';
import Image from '#/shared/components/common/Image';
import { setLocale } from '#/shared/utils/locale';
import {
  HASH_VALUE,
  PATH_URL,
  TERRA_PHONE_NUMBER,
} from '#/shared/utils/constant';
import { useReadMessageMutation } from '#/generated/schemas';
import { callNumber } from '#/shared/utils/tool';
import Logo from '#/assets/images/logo.png';
import { ChatContextProvider } from '#/shared/context/chat';
import { useAuth } from '#/shared/hooks/useAuth';

import { ReactComponent as LogoutOutlineSVG } from '#/assets/svgs/logout-filled.svg';
import { ReactComponent as CallFilledSVG } from '#/assets/svgs/call-filled.svg';
import { ReactComponent as MessageFilledSVG } from '#/assets/svgs/message-filled.svg';
import { useInboxVar } from '#/shared/hooks/useInboxVar';

export default function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const { signOut } = useAuth();
  const email = getEmail();

  const onChangeLanguage = (value: string) => {
    i18n.changeLanguage(value || 'en');
    setLocale(value || 'en');
  };

  const { inbox } = useInboxVar();

  const [readMessage] = useReadMessageMutation();

  const handleOpenBoxChat = () => {
    navigate({ hash: HASH_VALUE });
    readMessage({
      variables: {
        input: {
          email: inbox?.email || '',
          id: inbox?.id || '',
        },
      },
    });
  };

  return (
    <div className="sticky top-0 z-30 w-full bg-white">
      <div className="border-b border-b-primary">
        <div className="mx-auto flex h-fit max-w-container items-center justify-between py-3 xl:px-4">
          <Link className="h-8" to={email ? PATH_URL.home : PATH_URL.login}>
            Smart city
          </Link>

          <div className="flex items-center space-x-2">
            <LanguageSelector
              className="flex h-9 w-9 items-center rounded-full bg-primary"
              onChange={onChangeLanguage}
              value={i18n.language}
            />

            {!!getEmail() && !pathname.includes(PATH_URL.login) && (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
                <Badge dot={inbox?.clientHasNewMessage || false}>
                  <MessageFilledSVG
                    className="cursor-pointer text-white"
                    height={20}
                    onClick={handleOpenBoxChat}
                    width={20}
                  />
                </Badge>
              </div>
            )}

            <div
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-white"
              onClick={() => callNumber(TERRA_PHONE_NUMBER)}
            >
              <CallFilledSVG className="h-5 w-5" />
            </div>

            {!!getEmail() && !pathname.includes(PATH_URL.login) && (
              <div
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-primary text-white"
                onClick={signOut}
              >
                <LogoutOutlineSVG className="h-5 w-5" />
              </div>
            )}
          </div>
        </div>
      </div>

      {!!getEmail() && !pathname.includes(PATH_URL.login) && <NavBar />}

      <ChatContextProvider>
        <ChatModal forceRender />
      </ChatContextProvider>
    </div>
  );
}
