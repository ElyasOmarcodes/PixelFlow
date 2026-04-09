/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useStore } from './store/useStore';
import Home from './components/Home';
import Editor from './components/Editor';

export default function App() {
  const currentProject = useStore((state) => state.currentProject);

  return (
    <>
      {currentProject ? <Editor /> : <Home />}
    </>
  );
}
