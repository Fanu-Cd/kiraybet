import { useState, useRef, useEffect } from 'react';

function useHover() {
  const [hovered, setHovered] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const node = ref.current;
    if (node) {
      const handleMouseOver = () => setHovered(true);
      const handleMouseOut = () => setHovered(false);

      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);

      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      };
    }
  }, []);

  return [ref, hovered];
}

export default useHover;
