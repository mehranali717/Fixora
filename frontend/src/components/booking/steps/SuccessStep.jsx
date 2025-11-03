function SuccessStep({ reference, onClose }) {
  return (
    <div className="text-center">
      <div className="text-3xl font-bold text-emerald-500 mb-2">✓ Booked</div>
      <p className="mb-4">
        Your booking reference: <strong>{reference}</strong>
      </p>
      <Button onClick={onClose}>Close</Button>
    </div>
  );
}

export default SuccessStep