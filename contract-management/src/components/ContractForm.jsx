import React, { useState } from 'react';

const ContractForm = ({ blueprint, onSave, onCancel }) => {
  const [contractName, setContractName] = useState('');
  const [fieldValues, setFieldValues] = useState({});

  const handleSave = () => {
    if (!contractName.trim()) {
      alert('Contract name is required');
      return;
    }

    const contract = {
      id: Date.now(),
      name: contractName,
      blueprintId: blueprint.id,
      blueprintName: blueprint.name,
      status: 'Created',
      createdDate: new Date().toISOString(),
      fieldValues
    };
    onSave(contract);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-3xl mx-auto border border-white/20">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Create Contract from Blueprint</h2>
      <p className="text-indigo-600 mb-8 text-lg">Blueprint: <span className="font-bold text-indigo-700">{blueprint.name}</span></p>

      <div className="mb-8">
        <label className="block text-lg font-semibold mb-3 text-gray-700">Contract Name</label>
        <input
          type="text"
          value={contractName}
          onChange={(e) => setContractName(e.target.value)}
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-lg"
          placeholder="e.g., John Doe Employment Contract"
        />
      </div>

      <div className="space-y-6 mb-8">
        {blueprint.fields.map(field => (
          <div key={field.id} className="p-6 bg-gradient-to-r from-gray-50 to-indigo-50/30 rounded-xl border border-gray-100">
            <label className="block text-lg font-semibold mb-4 text-gray-700">{field.label}</label>
            {field.type === 'Text' && (
              <input
                type="text"
                value={fieldValues[field.id] || ''}
                onChange={(e) => setFieldValues({ ...fieldValues, [field.id]: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200"
              />
            )}
            {field.type === 'Date' && (
              <input
                type="date"
                value={fieldValues[field.id] || ''}
                onChange={(e) => setFieldValues({ ...fieldValues, [field.id]: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200"
              />
            )}
            {field.type === 'Signature' && (
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setFieldValues({ ...fieldValues, [field.id]: e.target.files[0] })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200"
              />
            )}
            {field.type === 'Checkbox' && (
              <div className="flex items-center p-4 bg-white rounded-lg border-2 border-gray-200">
                <input
                  type="checkbox"
                  checked={fieldValues[field.id] || false}
                  onChange={(e) => setFieldValues({ ...fieldValues, [field.id]: e.target.checked })}
                  className="w-6 h-6 text-indigo-500 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span className="ml-4 text-lg text-gray-700 font-medium">Check to agree</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="flex-1 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Create Contract
        </button>
        <button
          onClick={onCancel}
          className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 font-bold text-lg transition-all duration-300 transform hover:scale-105"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ContractForm;