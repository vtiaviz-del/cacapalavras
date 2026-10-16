import { useEffect, useState } from 'react';
import Editor from './components/Editor';
import Player from './components/Player';

// Sem hash na URL = editor. Com hash = jogo (é esse link que vai no embed).
export default function App() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return hash.length > 1 ? <Player key={hash} /> : <Editor />;
}
