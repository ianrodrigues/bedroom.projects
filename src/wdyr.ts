/// <reference types="@welldone-software/why-did-you-render" />

import React from 'react';

if (__DEV__) {
  import('@welldone-software/why-did-you-render').then((whyDidYouRender) => {
    whyDidYouRender.default(React, {
      trackAllPureComponents: true,
    });
  });
}
