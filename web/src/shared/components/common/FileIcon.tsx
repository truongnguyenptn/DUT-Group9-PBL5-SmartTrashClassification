import { ReactComponent as PdfSVG } from '#/assets/svgs/pdf.svg';
import { ReactComponent as ExcelSVG } from '#/assets/svgs/excel.svg';
import { ReactComponent as WordSVG } from '#/assets/svgs/word.svg';
import { ReactComponent as VolumeHighFilledSVG } from '#/assets/svgs/volume-high-filled.svg';
import { ReactComponent as FolderFilledSVG } from '#/assets/svgs/folder-filled.svg';
import {
  AUDIO_MIME_FILE,
  EXCEL_MIME_TYPE,
  PDF_MIME_TYPE,
  WORD_MIME_TYPE,
} from '#/shared/utils/constant';

interface FileIconProps {
  fileType: string;
  width?: number;
  height?: number;
}

export default function FileIcon({
  fileType,
  width = 24,
  height = 24,
}: FileIconProps) {
  if (PDF_MIME_TYPE.includes(fileType))
    return <PdfSVG height={height} width={width} />;
  if (WORD_MIME_TYPE.includes(fileType))
    return <WordSVG height={height} width={width} />;
  if (EXCEL_MIME_TYPE.includes(fileType))
    return <ExcelSVG height={height} width={width} />;
  if (AUDIO_MIME_FILE.includes(fileType))
    return (
      <VolumeHighFilledSVG
        className="text-grey-secondary-400"
        height={height}
        width={width}
      />
    );

  return (
    <FolderFilledSVG
      className="text-grey-secondary-400"
      height={height}
      width={width}
    />
  );
}
