// lib/jsonld/loadJsonFromIndex.ts
import React from 'react';
import Script, { ScriptProps } from 'next/script';
import { ReactElement } from 'react';

export function loadJsonLdScripts(
  jsonLdArray: any[],
  idPrefix = 'jsonld'
): ReactElement<ScriptProps>[] {
  return jsonLdArray.map((jsonLd, idx) =>
    React.createElement(Script, {
      key: `${idPrefix}-${idx}`,
      id: `${idPrefix}-${idx}`,
      type: 'application/ld+json',
      strategy: 'beforeInteractive',
      dangerouslySetInnerHTML: { __html: JSON.stringify(jsonLd) },
    })
  );
}
