import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (newTarget: number) => void;
  sellerName: string;
  initialTarget: number;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, onUpdate, sellerName, initialTarget }) => {
  const [newTarget, setNewTarget] = React.useState(initialTarget);

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '5px',
        width: '300px',
        textAlign: 'center',
      }}>
        <h2>Edit User Information</h2>
        <div style={{ marginBottom: '15px' }}>
          <label>Name</label>
          <input type="text" value={sellerName} readOnly style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>Monthly Target</label>
          <input
            type="number"
            value={newTarget}
            onChange={(e) => setNewTarget(Number(e.target.value))}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div>
          <button onClick={onClose} style={{ marginRight: '10px' }}>Cancel</button>
          <button onClick={() => onUpdate(newTarget)}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
