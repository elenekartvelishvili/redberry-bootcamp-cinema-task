import '../SessionsSkeleton.css'

const Fake_Groups=[1,2,3,4];
const Fake_Cards=[1,2,3,4];

function SessionSkeleton() {

return (
 <div className="sessions__list" aria-busy="true" aria-label="Loading sessions">
      {Fake_Groups.map((group) => (
        <div key={group} className="skeleton-group">
          <div className="skeleton-group__movie">
            <div className="skeleton skeleton--poster" />
            <div className="skeleton-group__lines">
              <div className="skeleton skeleton--title" />
              <div className="skeleton skeleton--text" />
            </div>
          </div>

          <div className="skeleton-group__cards">
            {Fake_Cards.map((card) => (
              <div key={card} className="skeleton skeleton--card" />
            ))}
          </div>
        </div>
      ))}
    </div>

    );


}

export default SessionSkeleton;
