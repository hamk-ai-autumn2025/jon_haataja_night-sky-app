// import { useState } from 'react'
// Supports weights 200-800
//@ts-expect-error ts can't find font but it still works
import '@fontsource-variable/plus-jakarta-sans';
import './App.css'
import ErrorBoundary from './ErrorBoundary';


function App() {
  return (
    <ErrorBoundary>
      <div>
        <h1>Night Sky App</h1>
      </div>
    </ErrorBoundary>
  );
}


export default App
