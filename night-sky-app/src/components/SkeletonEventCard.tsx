import "../styles/App.css";

interface SkeletonEventCardProps {
  count?: number;
}

function SkeletonEventCard({ count = 8 }: SkeletonEventCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="event-card skeleton-card col-4">
          <div className="skeleton skeleton-image"></div>
          <div className="event-card-content">
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-date"></div>
            <div className="skeleton skeleton-description"></div>
            <div className="skeleton skeleton-description short"></div>
          </div>
        </div>
      ))}
    </>
  );
}

export default SkeletonEventCard;
