import type { ImageProps } from 'antd';
import { Image as AntdImage } from 'antd';
import NotHaveImage from '#/assets/images/defaultImage.png';

interface ImageValueProps {
  defaultSrc?: string;
}
function Image({
  defaultSrc = NotHaveImage,
  src,
  alt,
  preview,
  ...rest
}: ImageProps & ImageValueProps) {
  return (
    <AntdImage
      alt={alt || 'SmartCity image'}
      data-testid="antd-image"
      preview={
        preview !== false
          ? {
              ...(typeof preview !== 'boolean' && preview),
              transitionName: '',
            }
          : preview
      }
      src={src || defaultSrc}
      {...rest}
    />
  );
}

export default Image;
