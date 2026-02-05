import { useCallback, useState } from 'react';
import Button from '../primitive/buttons/Default';
import { useGameStateContext } from 'lib/state/StateContextProvider';
import { GameSlice } from 'lib/state/Store';
import { useShallow } from 'zustand/react/shallow';

const selector = (state: GameSlice) => ({
  isOpen: state.bugReportPopupIsOpen,
  close: state.closeBugReportPopup
})

export function BugReportPopover() {
  const [bugReport, setBugReport] = useState('');
  const { isOpen, close } = useGameStateContext(useShallow(selector))

  const handleSubmit = useCallback(() => {
    // TODO: Implement bug report submission
    console.log('Bug report:', bugReport);
    setBugReport('');
    close();
  }, [bugReport, close]);

  const handleClose = useCallback(() => {
    setBugReport('');
    close();
  }, [close]);

  if (isOpen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/30" onClick={handleClose}>
        <div className="bg-white p-6 rounded-lg shadow-lg w-xl max-w-[95vw]" onClick={e => e.stopPropagation()}>
          <h3 className="text-lg font-semibold mb-3 text-center">Report a Bug</h3>
          <textarea
            className="w-full h-32 p-2 border-2 border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            placeholder="Describe the bug you encountered..."
            value={bugReport}
            onChange={(e) => setBugReport(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!bugReport.trim()}>Submit</Button>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
