'use client';

import { useEffect, useReducer, useRef } from 'react';
import type { z } from 'zod';
import { progressEventSchema } from '@/lib/schemas';
import type { ProgressEvent } from '@/lib/schemas';

export type SSEStatus = 'connecting' | 'receiving' | 'done' | 'error';

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

export function useSse<T>(url: string | null, resultSchema?: z.ZodType<T>) {
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
      try {
        const data = progressEventSchema.parse(JSON.parse(e.data));
        dispatch({ type: 'progress', step: data });
      } catch {
        dispatch({
          type: 'error',
          message: 'Invalid progress data from server',
        });
        es.close();
      }
    });

    es.addEventListener('result', (e: MessageEvent) => {
      try {
        const raw: unknown = JSON.parse(e.data);
        const data = resultSchema ? resultSchema.parse(raw) : (raw as T);
        dispatch({ type: 'result', data });
      } catch {
        dispatch({ type: 'error', message: 'Invalid result data from server' });
      }
      es.close();
    });

    es.addEventListener('error', (e: Event) => {
      if (e instanceof MessageEvent) {
        try {
          const data = JSON.parse(e.data) as { message?: string };
          dispatch({ type: 'error', message: data.message ?? 'Unknown error' });
        } catch {
          dispatch({ type: 'error', message: 'Server error' });
        }
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
  }, [url, resultSchema]);

  return state;
}
