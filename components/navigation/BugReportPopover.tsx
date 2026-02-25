import { useCallback, useEffect, useRef, useState } from 'react';
import Button from '../primitive/buttons/Default';
import { useGameStateContext } from 'lib/state/StateContextProvider';
import { GameSlice } from 'lib/state/Store';
import { useShallow } from 'zustand/react/shallow';
import { collectUserEnvironment } from 'lib/util/userAgent';
import { submitBugReport } from 'lib/study/submitBugReport';
import { GameHistory } from 'lib/study/GameHistory';

const selector = (state: GameSlice) => ({
  isOpen: state.bugReportPopupIsOpen,
  close: state.closeBugReportPopup,
  makeHistoryObject: state.makeHistoryObject,
})

export function BugReportDialog(props: { isOpen: boolean, onClose: () => void, makeHistoryObject?: () => GameHistory | undefined }) {
  const { isOpen, onClose, makeHistoryObject } = props;
  const [bugReport, setBugReport] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, isSubmitting]);

  useEffect(() => {
    if (!isOpen) return;

    const timeoutId = window.setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isOpen]);

  useEffect(() => {
    if (!showSuccessToast) return;

    const timeoutId = window.setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, [showSuccessToast]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const userEnv = collectUserEnvironment();
      const history = makeHistoryObject?.();

      const result = await submitBugReport({
        userMessage: bugReport,
        environment: userEnv,
        configId: history?.configId,
        problemId: history?.problemId,
        history: history,
      });

      if (result.success) {
        console.log('Bug report submitted successfully');
        setShowSuccessToast(true);
        setBugReport('');
        onClose();
      } else {
        console.error('Failed to submit bug report:', result.error);
        alert('Failed to submit bug report. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting bug report:', error);
      alert('Failed to submit bug report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [bugReport, isSubmitting, makeHistoryObject, onClose]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <>
      {showSuccessToast && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none">
          <div className="rounded-lg bg-white px-4 py-3 shadow-lg">
          Feedback sent successfully!
          </div>
        </div>
      )}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/30" onClick={handleClose}>
          <div className="bg-light-gray p-6 rounded-lg shadow-lg w-xl max-w-[95vw]" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-3 text-center">Give Feedback</h3>
            <p className="pb-4">Please let us know your experience here.</p>
            <textarea
              ref={textareaRef}
              autoFocus
              className="w-full h-44 p-2 border-2 border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              placeholder=""
              value={bugReport}
              onChange={(e) => setBugReport(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button onClick={handleClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={!bugReport.trim() || isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function BugReportPopover() {
  const { isOpen, close, makeHistoryObject } = useGameStateContext(useShallow(selector))

  return <BugReportDialog isOpen={isOpen} onClose={close} makeHistoryObject={makeHistoryObject} />;
}
