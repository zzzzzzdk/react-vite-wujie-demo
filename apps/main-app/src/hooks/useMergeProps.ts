import { useMemo } from 'react';

export default function useMergeProps<T>(
  componentProps: T,
  defaultProps: Partial<T>,
  globalComponentConfig: Partial<T>
): T {
  const _defaultProps = useMemo(() => {
    return { ...defaultProps, ...globalComponentConfig } as any;
  }, [defaultProps, globalComponentConfig]);

  const props = useMemo(() => {
    const mProps: T = { ...componentProps };

    for (const propName in _defaultProps) {
      if (mProps[propName] === undefined) {
        mProps[propName] = _defaultProps[propName] as any;
      }
    }

    return mProps as any;
  }, [componentProps, _defaultProps]);

  return props;
}
