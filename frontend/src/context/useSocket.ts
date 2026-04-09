import { useContext } from 'react';
import { SocketContext } from './socketContextImpl';

export function useSocket() {
  return useContext(SocketContext);
}
