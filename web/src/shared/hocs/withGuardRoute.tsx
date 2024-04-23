import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmail } from '#/shared/utils/localStorage';
import { PATH_URL } from '#/shared/utils/constant';

function withGuardRoute<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  isPrivate = false,
) {
  return function (props: T) {
    const navigate = useNavigate();
    useEffect(() => {
      const email = getEmail();
      if (!email && isPrivate) {
        navigate(PATH_URL.login, {
          replace: true,
        });
      }
      if (email && !isPrivate) {
        navigate(PATH_URL.home, {
          replace: true,
        });
      }
    }, [navigate]);

    if (!navigator.onLine) location.reload();
    return <WrappedComponent {...props} />;
  };
}

export default withGuardRoute;
