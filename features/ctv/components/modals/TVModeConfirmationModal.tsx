"use client";

interface TVModeConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M12.7071 4.70711C13.0976 4.31658 13.0976 3.68342 12.7071 3.29289C12.3166 2.90237 11.6834 2.90237 11.2929 3.29289L8 6.58579L4.70711 3.29289C4.31658 2.90237 3.68342 2.90237 3.29289 3.29289C2.90237 3.68342 2.90237 4.31658 3.29289 4.70711L6.58579 8L3.29289 11.2929C2.90237 11.6834 2.90237 12.3166 3.29289 12.7071C3.68342 13.0976 4.31658 13.0976 4.70711 12.7071L8 9.41421L11.2929 12.7071C11.6834 13.0976 12.3166 13.0976 12.7071 12.7071C13.0976 12.3166 13.0976 11.6834 12.7071 11.2929L9.41421 8L12.7071 4.70711Z" 
        fill="#283943"
      />
    </svg>
  );
}

export function TVModeConfirmationModal({ isOpen, onClose, onConfirm }: TVModeConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-[4px] shadow-[0px_8px_24px_4px_rgba(0,0,0,0.1),0px_2px_2px_0px_rgba(0,0,0,0.1)] w-[600px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center pl-4 bg-white">
          <div className="flex-1 pr-2 py-4">
            <h2 className="font-optimistic font-bold text-[16px] leading-[20px] text-[#1C2B33] truncate">
              Some settings will change when you switch to TV
            </h2>
          </div>
          <div className="flex gap-2 pr-1 py-2">
            <button
              className="p-3 rounded hover:bg-[#F1F4F7] transition-colors"
              onClick={onClose}
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-2">
          <div className="font-sf-pro text-[14px] leading-[20px] text-[#1C2B33]">
            <p className="mb-3">
              Some settings in this campaign aren&apos;t compatible with TV. Review what will change before you continue:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#1C2B33]">
              <li>Advantage+ catalog: Turned off</li>
              <li>A/B testing: Turned off</li>
              <li>Cost per result goal: Turned off</li>
              <li>Value rules: Turned off</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2 items-center justify-end px-4 py-2">
            <button
              className="h-9 px-3 flex items-center justify-center bg-[#F8F9FB] border border-[#CBD2D9] rounded hover:bg-[#EBEEF1] transition-colors"
              onClick={onClose}
            >
              <span className="font-optimistic-display font-medium text-[14px] leading-none text-[#1C2B33]">
                Cancel
              </span>
            </button>
            <button
              className="h-9 px-3 flex items-center justify-center bg-[#0A78BE] rounded hover:bg-[#0969A5] transition-colors"
              onClick={onConfirm}
            >
              <span className="font-optimistic-display font-medium text-[14px] leading-none text-white">
                Continue
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
