import React from 'react';
import { X, Lock, AlertCircle } from 'lucide-react';

// Types
const CONTRACT_STATUSES = ['Created', 'Approved', 'Sent', 'Signed', 'Locked', 'Revoked'];

const ContractView = ({ contract, blueprint, onClose, onUpdateStatus }) => {
  const getNextStatuses = (currentStatus) => {
    const statusIndex = CONTRACT_STATUSES.indexOf(currentStatus);
    if (currentStatus === 'Locked' || currentStatus === 'Revoked') return [];
    if (currentStatus === 'Created') return ['Approved', 'Revoked'];
    if (currentStatus === 'Approved') return ['Sent', 'Revoked'];
    if (currentStatus === 'Sent') return ['Signed', 'Revoked'];
    if (currentStatus === 'Signed') return ['Locked', 'Revoked'];
    return [];
  };

  const getStatusColor = (status) => {
    const colors = {
      'Created': 'bg-gray-200 text-gray-700',
      'Approved': 'bg-blue-200 text-blue-700',
      'Sent': 'bg-yellow-200 text-yellow-700',
      'Signed': 'bg-purple-200 text-purple-700',
      'Locked': 'bg-green-200 text-green-700',
      'Revoked': 'bg-red-200 text-red-700'
    };
    return colors[status] || 'bg-gray-200 text-gray-700';
  };

  const nextStatuses = getNextStatuses(contract.status);

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-3xl mx-auto border border-white/20">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-3 text-gray-800">{contract.name}</h2>
          <p className="text-indigo-600 text-lg">Blueprint: <span className="font-semibold">{contract.blueprintName}</span></p>
        </div>
        <button onClick={onClose} className="p-3 text-gray-500 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-110">
          <X size={28} />
        </button>
      </div>

      <div className="mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-semibold text-gray-700">Status:</span>
            <span className={`ml-4 px-6 py-2 rounded-full text-lg font-bold ${getStatusColor(contract.status)} shadow-sm`}>
              {contract.status}
            </span>
          </div>
          <div className="text-lg text-gray-600 font-medium">
            Created: {new Date(contract.createdDate).toLocaleDateString()}
          </div>
        </div>
      </div>

      {(contract.status === 'Locked' || contract.status === 'Revoked') && (
        <div className={`mb-8 p-6 rounded-xl flex items-center gap-4 ${
          contract.status === 'Locked' ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200' : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-200'
        }`}>
          {contract.status === 'Locked' ? <Lock size={24} /> : <AlertCircle size={24} />}
          <span className="font-bold text-lg">
            {contract.status === 'Locked'
              ? 'This contract is locked and cannot be edited'
              : 'This contract has been revoked and cannot proceed further'
            }
          </span>
        </div>
      )}

      <div className="space-y-6 mb-8">
        <h3 className="text-2xl font-bold text-gray-800">Contract Details</h3>
        {blueprint.fields.map(field => (
          <div key={field.id} className="p-6 bg-gradient-to-r from-white to-indigo-50/50 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200">
            <label className="block text-lg font-semibold text-gray-700 mb-3">{field.label}</label>
            <div className="text-gray-900 text-lg">
              {field.type === 'Checkbox'
                ? (contract.fieldValues[field.id] ? '✓ Checked' : '✗ Unchecked')
                : field.type === 'Signature' && contract.fieldValues[field.id] instanceof File
                  ? contract.fieldValues[field.id].name
                  : contract.fieldValues[field.id] || '(Not provided)'
              }
            </div>
          </div>
        ))}
      </div>

      {nextStatuses.length > 0 && (
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Available Actions</h3>
          <div className="flex gap-4 flex-wrap">
            {nextStatuses.map(status => (
              <button
                key={status}
                onClick={() => onUpdateStatus(contract.id, status)}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  status === 'Revoked'
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                }`}
              >
                {status === 'Revoked' ? 'Revoke Contract' : `Mark as ${status}`}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onClose}
        className="w-full px-8 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-bold text-lg transition-all duration-300 transform hover:scale-105"
      >
        Close
      </button>
    </div>
  );
};

export default ContractView;