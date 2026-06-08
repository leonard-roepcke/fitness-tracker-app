import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import { nextUniformFontSize } from '@/app/utils/buttonTextFit';

type ButtonTextGroupContextValue = {
  fontSize: number;
  generation: number;
  register: (id: string) => void;
  unregister: (id: string) => void;
  report: (id: string, wrapped: boolean) => void;
};

const ButtonTextGroupContext = createContext<ButtonTextGroupContextValue | null>(null);

type ButtonTextGroupProps = {
  children: React.ReactNode;
  baseFontSize: number;
  minFontSize?: number;
  step?: number;
};

export function ButtonTextGroup({
  children,
  baseFontSize,
  minFontSize = 11,
  step = 1,
}: ButtonTextGroupProps) {
  const [fontSize, setFontSize] = useState(baseFontSize);
  const [generation, setGeneration] = useState(0);
  const registered = useRef(new Set<string>());
  const reported = useRef(new Map<string, boolean>());

  const evaluateReports = useCallback(() => {
    if (reported.current.size !== registered.current.size || registered.current.size === 0) {
      return;
    }

    const anyWrapped = [...reported.current.values()].some(Boolean);
    reported.current.clear();

    if (anyWrapped && fontSize > minFontSize) {
      setFontSize((current) => nextUniformFontSize(current, minFontSize, step));
      setGeneration((value) => value + 1);
    }
  }, [fontSize, minFontSize, step]);

  const register = useCallback((id: string) => {
    registered.current.add(id);
  }, []);

  const unregister = useCallback((id: string) => {
    registered.current.delete(id);
    reported.current.delete(id);
  }, []);

  const report = useCallback((id: string, wrapped: boolean) => {
    reported.current.set(id, wrapped);
    evaluateReports();
  }, [evaluateReports]);

  const value = useMemo(
    () => ({ fontSize, generation, register, unregister, report }),
    [fontSize, generation, register, unregister, report],
  );

  return (
    <ButtonTextGroupContext.Provider value={value}>
      {children}
    </ButtonTextGroupContext.Provider>
  );
}

export function useButtonTextGroup() {
  return useContext(ButtonTextGroupContext);
}
