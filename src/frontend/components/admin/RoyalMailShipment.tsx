export default function RoyalMailShipment({
  royalMailOrderId,
  trackingNumber,
}: {
  royalMailOrderId: string | null;
  trackingNumber: string | null;
}) {
  if (!royalMailOrderId) {
    return (
      <p className="text-sm text-text/50">
        Not sent to Royal Mail yet. Orders are sent automatically once paid — if this one is missing,
        create it directly in Click &amp; Drop.
      </p>
    );
  }

  return (
    <div className="text-sm text-text/70">
      <p className="font-semibold text-text">Sent to Royal Mail automatically</p>
      {trackingNumber ? (
        <p className="mt-1">
          Tracking: <span className="font-mono font-semibold text-text">{trackingNumber}</span>
        </p>
      ) : (
        <p className="mt-1 text-text/50">
          Tracking number is assigned once the label is printed in Click &amp; Drop.
        </p>
      )}
    </div>
  );
}
