import type { Rule } from 'antd/lib/form';
import { validateRegex } from '@enouvo/react-uikit';
import { ReactComponent as InfoFilledSVG } from '#/assets/svgs/info-filled.svg';

export const displayValidateMessage = (message?: string) => (
  <div className="flex items-center gap-2">
    <InfoFilledSVG className="text-error" height={16} width={16} />
    <p className="m-0 w-[calc(100%-4rem)]">{message}</p>
  </div>
);

type RuleCreator = (message?: string) => Rule;

export const required: RuleCreator = message => ({
  message,
  required: true,
});

export const validateEmail: RuleCreator = message => ({
  message,
  pattern: validateRegex.email,
});

export const maxText = (max: number, message?: string): Rule => ({
  max,
  message,
});
export const shortText = (): Rule => maxText(50);
export const longText = (): Rule => maxText(200);
