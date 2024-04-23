import { useReactiveVar } from '@apollo/client';
import { useCallback } from 'react';
import { sectionLayoutGoogleMapVisible } from '#/graphql/cache';

export const useSectionLayoutGoogleMapVisible = () => {
  const visible = useReactiveVar(sectionLayoutGoogleMapVisible);

  const onShow = useCallback(() => {
    sectionLayoutGoogleMapVisible(true);
  }, []);

  const onHide = useCallback(() => {
    sectionLayoutGoogleMapVisible(false);
  }, []);

  return {
    onHide,
    onShow,
    visible,
  };
};
