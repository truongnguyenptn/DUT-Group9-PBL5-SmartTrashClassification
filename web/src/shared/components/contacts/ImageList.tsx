import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';
import { IMAGE_LIMIT } from '#/shared/utils/constant';
import type { TerraDocument } from '#/shared/utils/type/contact';
import Image from '#/shared/components/common/Image';

interface ImageListProps {
  imageDocuments?: TerraDocument[];
  onToggleShowFullImages?: () => void;
  isShowFull?: boolean;
}

export default function ImageList({
  imageDocuments,
  onToggleShowFullImages,
  isShowFull,
}: ImageListProps) {
  const { t } = useTypeSafeTranslation();

  const images =
    imageDocuments && imageDocuments.length > IMAGE_LIMIT && isShowFull
      ? [...imageDocuments, imageDocuments[0]]
      : imageDocuments?.slice(0, IMAGE_LIMIT);

  return (
    <div className="grid grid-cols-6 items-start gap-2 xl:grid-cols-4 xmd:grid-cols-3">
      {images?.map((image, index) => (
        <div className="relative h-full" key={index}>
          <Image
            className="h-full rounded object-contain"
            rootClassName="w-full"
            src={image.url}
          />
          {index === images.length - 1 &&
            imageDocuments &&
            imageDocuments.length > IMAGE_LIMIT && (
              <div
                className={`${
                  isShowFull
                    ? 'bg-scroll-bar text-default-info'
                    : 'bg-overlay-color text-white underline'
                } absolute inset-0 flex w-full cursor-pointer items-center justify-center rounded`}
                onClick={onToggleShowFullImages}
              >
                {isShowFull
                  ? t('commonFields.seeLess')
                  : t('commonFields.seeMore')}
              </div>
            )}
        </div>
      ))}
    </div>
  );
}
