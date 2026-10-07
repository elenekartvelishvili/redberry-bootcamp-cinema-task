import { useState } from 'react';
import Modal from '../components/Modal';
import { refundOrder } from '../api/tickets';
import './RefundModal.css';

function RefundModal({ order, onClose, onRefunded }) {
  const [refunding, setRefunding] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setError('');
    setRefunding(true);
    try {
      const updatedOrder = await refundOrder(order.reference);
      onRefunded(updatedOrder);
    } catch (err) {
      setError(err.message);
      setRefunding(false);
    }
  };

  return (
    <Modal
      title="Refund this order?"
      subtitle={`Order #${order.reference} · ₾${order.totalPrice}`}
      onClose={onClose}
      className="modal--refund"
    >
      <p className="text-body-m">
        Your seats will be released and the money returned to your card. This cannot be undone.
      </p>

      {error && <p className="field__error text-label-s">{error}</p>}

      <div className="refund__actions">
        <button type="button" className="btn btn--ghost text-button" onClick={onClose} disabled={refunding}>
          Cancel
        </button>
        <button
          type="button"
          className="btn btn--red text-button"
          onClick={handleConfirm}
          disabled={refunding}
        >
          {refunding ? 'Refunding...' : 'Yes, refund'}
        </button>
      </div>
    </Modal>
  );
}

export default RefundModal;