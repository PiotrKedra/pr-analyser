'use client';

import { useEffect, useReducer, useRef } from 'react';
import type { ProgressEvent } from '@/lib/schemas';

type SSEStatus = 'connecting' | 'receiving' | 'done' | 'error';

type SSEState<T> = {
  status: SSEStatus;
  progressSteps: ProgressEvent[];
  result: T | null;
  error: string | null;
};

type SSEAction<T> =
  | { type: 'reset' }
  | { type: 'progress'; step: ProgressEvent }
  | { type: 'result'; data: T }
  | { type: 'error'; message: string };

function createReducer<T>() {
  return (state: SSEState<T>, action: SSEAction<T>): SSEState<T> => {
    switch (action.type) {
      case 'reset':
        return {
          status: 'connecting',
          progressSteps: [],
          result: null,
          error: null,
        };
      case 'progress':
        return {
          ...state,
          status: 'receiving',
          progressSteps: [...state.progressSteps, action.step],
        };
      case 'result':
        return { ...state, status: 'done', result: action.data };
      case 'error':
        return { ...state, status: 'error', error: action.message };
    }
  };
}

const initialState: SSEState<unknown> = {
  status: 'connecting',
  progressSteps: [],
  result: null,
  error: null,
};

export function useSSE<T>(url: string | null) {
  const [state, dispatch] = useReducer(
    createReducer<T>(),
    initialState as SSEState<T>,
  );
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    if (!url) return;

    dispatch({ type: 'reset' });

    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.addEventListener('progress', (e: MessageEvent) => {
      const data = JSON.parse(e.data) as ProgressEvent;
      dispatch({ type: 'progress', step: data });
    });

    es.addEventListener('result', (e: MessageEvent) => {
      const data = JSON.parse(e.data) as T;
      dispatch({ type: 'result', data });
      es.close();
    });

    es.addEventListener('error', (e: Event) => {
      if (e instanceof MessageEvent) {
        const data = JSON.parse(e.data) as { message: string };
        dispatch({ type: 'error', message: data.message });
      } else {
        dispatch({ type: 'error', message: 'Server error' });
      }
      es.close();
    });

    es.onerror = () => {
      if (es.readyState === EventSource.CLOSED) return;
      dispatch({ type: 'error', message: 'Connection failed' });
      es.close();
    };

    return () => {
      es.close();
      eventSourceRef.current = null;
    };
  }, [url]);

  return state;
}
