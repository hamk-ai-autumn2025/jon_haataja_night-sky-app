// import { useState } from 'react'
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
