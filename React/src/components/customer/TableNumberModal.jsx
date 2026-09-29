import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTableNumber, closeTableModal } from '../../redux/slices/customerSlice';
import { Utensils, QrCode, ArrowRight, X } from 'lucide-react';

const TableNumberModal = () => {
  const dispatch = useDispatch();
  const { tableNumber, isTableModalOpen } = useSelector((state) => state.customer);
  const [inputTable, setInputTable] = useState(tableNumber || '');
  const [error, setError] = useState('');

  if (!isTableModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = inputTable.toString().trim();
    if (!trimmed) {
      setError('Please enter a valid table number.');
      return;
    }
    dispatch(setTableNumber(trimmed));
    setError('');
  };

  const isInitial = !tableNumber;

  return (
    <div className="modal-backdrop">
      <div className="modal-card animate-slide-up bg-white border border-slate-200">
        {!isInitial && (
          <button
            className="modal-close-btn"
            onClick={() => dispatch(closeTableModal())}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        )}

        <div className="text-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 mx-auto mb-2.5 shadow-xs">
            <QrCode size={24} />
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Welcome to Bowl & Brick
          </h2>
          <p className="text-xs font-medium text-slate-500 mt-1 leading-normal">
            {isInitial
              ? 'Please enter your assigned table number to begin exploring our menu.'
              : 'Update your current table number below.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wider mb-1">
              Table Number
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. 5 or T-12"
                value={inputTable}
                onChange={(e) => {
                  setInputTable(e.target.value);
                  if (error) setError('');
                }}
                className="input-field pl-9 text-center text-base font-black tracking-widest text-slate-900"
                autoFocus
              />
              <Utensils
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>
            {error && <p className="text-xs text-rose-600 mt-1 font-bold">{error}</p>}
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-1.5 py-3 text-xs font-black">
            <span>{isInitial ? 'Start Ordering' : 'Save Table Number'}</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TableNumberModal;
