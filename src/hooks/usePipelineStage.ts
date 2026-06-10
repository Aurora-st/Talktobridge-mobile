import { useCallback, useEffect, useRef, useState } from 'react';
import type { PipelineStage } from '../types/api';
import { PIPELINE_STAGE_LABELS } from '../types/api';

const PROCESSING_STAGES: PipelineStage[] = [
  'transcribing',
  'translating',
  'synthesizing',
];

const STAGE_INTERVAL_MS = 2_000;

export function usePipelineStage() {
  const [stage, setStage] = useState<PipelineStage>('idle');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearStageInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const setPipelineStage = useCallback(
    (nextStage: PipelineStage) => {
      clearStageInterval();
      setStage(nextStage);
    },
    [clearStageInterval],
  );

  const startProcessingStages = useCallback(() => {
    clearStageInterval();
    let index = 0;
    setStage(PROCESSING_STAGES[0] ?? 'transcribing');

    intervalRef.current = setInterval(() => {
      index = Math.min(index + 1, PROCESSING_STAGES.length - 1);
      const nextStage = PROCESSING_STAGES[index];
      if (nextStage) {
        setStage(nextStage);
      }
    }, STAGE_INTERVAL_MS);
  }, [clearStageInterval]);

  const resetStage = useCallback(() => {
    clearStageInterval();
    setStage('idle');
  }, [clearStageInterval]);

  useEffect(() => {
    return () => {
      clearStageInterval();
    };
  }, [clearStageInterval]);

  return {
    stage,
    message: PIPELINE_STAGE_LABELS[stage],
    setPipelineStage,
    startProcessingStages,
    resetStage,
    isBusy: stage !== 'idle',
  };
}
