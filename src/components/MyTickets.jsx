import { useState } from 'react';
import { Link } from 'react-router-dom';
import TicketCard from './TicketCard';
import RefundModal from '../modals/RefundModal';
import './MyTickets.css';

function MyTickets({ tickets, loading, error, onRetry, onRefunded }) {
  const [view, setView] = useState('upcoming');
  const [orderToRefund, setOrderToRefund] = useState(null);

  const upcoming = tickets.filter((order) => order.isUpcoming && order.status !== 'refunded');
  const past = tickets.filter((order) => !upcoming.includes(order));
  const shown = view === 'upcoming' ? upcoming : past;

  const handleRefunded = (updatedOrder) => {
    onRefunded(updatedOrder);
    setOrderToRefund(null);
  };

  const pillClass = (name) => `my-tickets__pill text-label-s ${view === name ? 'my-tickets__pill--active' : ''}`;

  const renderList = () => {
    if (loading) return <p className="text-body-m">Loading tickets...</p>;

    if (error) {
      return (
        <div className="my-tickets__status">
          <p className="text-body-m">{error}</p>
          <button type="button" className="btn btn--ghost text-button" onClick={onRetry}>
            Try again
          </button>
        </div>
      );
    }

    if (shown.length === 0) {
      return view === 'upcoming' ? (
        <div className="my-tickets__status">
          <p className="text-body-m">You have no upcoming tickets.</p>
          <Link to="/sessions" className="btn btn--red text-button">
            Browse sessions
          </Link>
        </div>
      ) : (
        <p className="text-body-m">No past tickets yet.</p>
      );
    }

    return (
      <div className="my-tickets__list">
        {shown.map((order) => (
          <TicketCard
            key={order.id}
            order={order}
            onRefund={view === 'upcoming' ? setOrderToRefund : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="my-tickets">
      <div className="my-tickets__pills">
        <button type="button" className={pillClass('upcoming')} onClick={() => setView('upcoming')}>
          Upcoming <span className="my-tickets__count">{upcoming.length}</span>
        </button>
        <button type="button" className={pillClass('past')} onClick={() => setView('past')}>
          Past <span className="my-tickets__count">{past.length}</span>
        </button>
      </div>

      {renderList()}

      {orderToRefund && (
        <RefundModal
          order={orderToRefund}
          onClose={() => setOrderToRefund(null)}
          onRefunded={handleRefunded}
        />
      )}
    </div>
  );
}

export default MyTickets;