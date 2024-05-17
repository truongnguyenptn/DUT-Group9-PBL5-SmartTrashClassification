import { Button, Result } from 'antd';

export default function ErrorFallback({
  error,
  resetError,
}: any) {
  const isNewVersionError = error.message.match(
    /Failed to fetch dynamically imported module/g,
  );

  return (
    <Result
      extra={
        isNewVersionError && (
          <Button
            onClick={() => {
              resetError();
              window.location.reload();
            }}
          >
            Refresh Page
          </Button>
        )
      }
      status="500"
      title={
        isNewVersionError
          ? 'A new version deployed! Please reload the page.'
          : 'Oops! Something went wrong.'
      }
    />
  );
}
