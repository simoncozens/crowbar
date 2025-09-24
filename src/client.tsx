'use client'

import React from 'react';
import dynamic from 'next/dynamic'
import { initHB } from "./opentype/CrowbarFont";

const App = dynamic(() => import('./App'), { ssr: false })

export function ClientOnly() {
  initHB().then((harfbuzz) => {
    console.log("Harfbuzz loaded", harfbuzz);
  });
  return <App />
}