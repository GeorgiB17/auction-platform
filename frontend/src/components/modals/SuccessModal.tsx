type SuccessModalProps = {
  text?: string;
};

function SuccessModal({ text = "Success!" }: Readonly<SuccessModalProps>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg px-6 py-4 flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-gray-700">{text}</p>
      </div>
    </div>
  );
}

export default SuccessModal;
