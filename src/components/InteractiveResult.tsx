import { buildInteractiveResult, Result, SearchEngine } from '@coveo/headless';
import { FunctionComponent, PropsWithChildren, useEffect, useRef } from 'react';

interface InteractiveResultProps extends PropsWithChildren {
  result: Result;
  engine?: SearchEngine;
}

export const InteractiveResult: FunctionComponent<InteractiveResultProps> = (
  props
) => {
  const controllerRef = useRef<any>(null);

  useEffect(() => {
    const engine = props.engine || (window as any).headlessEngine;
    controllerRef.current = buildInteractiveResult(engine, {
      options: {result: props.result},
    });

    return () => {
      if (controllerRef.current) {
        controllerRef.current.cancelPendingSelect();
      }
    };
  }, [props.result, props.engine]);

  const handleInteraction = (action: string) => {
    if (controllerRef.current) {
      switch (action) {
        case 'select':
          controllerRef.current.select();
          break;
        case 'beginDelayedSelect':
          controllerRef.current.beginDelayedSelect();
          break;
        case 'cancelPendingSelect':
          controllerRef.current.cancelPendingSelect();
          break;
      }
    }
  };

  return (
    <a
      href={filterProtocol(props.result.clickUri)}
      onClick={() => handleInteraction('select')}
      onContextMenu={() => handleInteraction('select')}
      onMouseDown={() => handleInteraction('select')}
      onMouseUp={() => handleInteraction('select')}
      onTouchStart={() => handleInteraction('beginDelayedSelect')}
      onTouchEnd={() => handleInteraction('cancelPendingSelect')}
    >
      {props.children}
    </a>
  );
};

function filterProtocol(uri: string) {
  const isAbsolute = /^(https?|ftp|file|mailto|tel):/i.test(uri);
  const isRelative = /^\//.test(uri);

  return isAbsolute || isRelative ? uri : '';
}