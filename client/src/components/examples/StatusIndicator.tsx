import StatusIndicator from '../StatusIndicator';

export default function StatusIndicatorExample() {
  return (
    <div className="flex flex-wrap gap-4">
      <StatusIndicator type="connection" status="active" />
      <StatusIndicator type="market" status="active" />
      <StatusIndicator type="algorithm" status="active" />
      <StatusIndicator type="connection" status="connecting" />
      <StatusIndicator type="market" status="inactive" />
    </div>
  );
}
