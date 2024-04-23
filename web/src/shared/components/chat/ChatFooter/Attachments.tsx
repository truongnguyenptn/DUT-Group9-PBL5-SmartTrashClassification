import { ReactComponent as AttachOutlineSVG } from '#/assets/svgs/attach-outline.svg';
import { ReactComponent as ImageOutlineSVG } from '#/assets/svgs/image-outline.svg';
import { ReactComponent as CameraOutlineSVG } from '#/assets/svgs/camera-outline.svg';

import useTypeSafeTranslation from '#/shared/hooks/useTypeSafeTranslation';

export default function Attachments() {
  const { t } = useTypeSafeTranslation();

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex cursor-pointer items-center gap-4">
        <ImageOutlineSVG height={24} width={24} />
        {t('chat.photoLibrary')}
      </div>
      <div className="flex cursor-pointer items-center gap-4">
        <CameraOutlineSVG height={24} width={24} />
        {t('chat.camera')}
      </div>
      <div className="flex cursor-pointer items-center gap-4">
        <AttachOutlineSVG height={24} width={24} />
        {t('chat.attachFiles')}
      </div>
    </div>
  );
}
