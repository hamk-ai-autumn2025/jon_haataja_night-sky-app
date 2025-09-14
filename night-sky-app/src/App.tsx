// Supports weights 200-800
//@ts-expect-error ts can't find font but it still works
import '@fontsource-variable/plus-jakarta-sans';
import './App.css'
import Button from './components/Button';


function App() {
  return (
      <div>
        <h1>Night Sky App</h1>
        <Button title="Click Me" disabled={false} buttonType='btn-secondary'/>
      </div>
  );
}


export default App
