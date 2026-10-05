import chevronLeft from '../assets/icons/chevron-left.svg';
import './Pagination.css';


function Pagination({currentPage,lastPage,onChange}) 
{
if(lastPage <= 1) return null;

const pages=[];
for(let i=1;i<=lastPage;i++) {
    pages.push(i);
}

  return (
    <nav className="pagination" aria-label="Pages">
      <div className="pagination__row">
        <button
          className="pagination__arrow"
          disabled={currentPage === 1}
          onClick={() => onChange(currentPage - 1)}
          aria-label="Previous page"
        >
          <img src={chevronLeft} alt="" width="16" height="16" />
        </button>

        {pages.map((number) => (
          <button
            key={number}
            className={`pagination__page ${number === currentPage ? 'pagination__page--active' : ''}`}
            onClick={() => onChange(number)}
          >
            {number}
          </button>
        ))}

        <button
          className="pagination__arrow pagination__arrow--next"
          disabled={currentPage === lastPage}
          onClick={() => onChange(currentPage + 1)}
          aria-label="Next page"
        >
          <img src={chevronLeft} alt="" width="16" height="16" />
        </button>
      </div>

      <p className="pagination__info text-body-s">
        Page {currentPage} of {lastPage}
      </p>
    </nav>
  );
}

export default Pagination;

