import React, { useState } from 'react';
import { Plus, Trash2, Eye } from 'lucide-react';
import BlueprintEditor from './components/BlueprintEditor';
import ContractForm from './components/ContractForm';
import ContractView from './components/ContractView';

// Main App Component
const App = () => {
  const [blueprints, setBlueprints] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [view, setView] = useState('dashboard');
  const [selectedBlueprint, setSelectedBlueprint] = useState(null);
  const [selectedContract, setSelectedContract] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  const handleSaveBlueprint = (blueprint) => {
    if (blueprint.id && blueprints.find(b => b.id === blueprint.id)) {
      setBlueprints(blueprints.map(b => b.id === blueprint.id ? blueprint : b));
    } else {
      setBlueprints([...blueprints, blueprint]);
    }
    setView('dashboard');
  };

  const handleDeleteBlueprint = (id) => {
    if (confirm('Delete this blueprint?')) {
      setBlueprints(blueprints.filter(b => b.id !== id));
    }
  };

  const handleSaveContract = (contract) => {
    setContracts([...contracts, contract]);
    setView('dashboard');
  };

  const handleUpdateContractStatus = (id, newStatus) => {
    setContracts(contracts.map(c =>
      c.id === id ? { ...c, status: newStatus } : c
    ));
  };

  const handleViewContract = (contract) => {
    const blueprint = blueprints.find(b => b.id === contract.blueprintId);
    setSelectedContract({ contract, blueprint });
    setView('viewContract');
  };

  const getFilteredContracts = () => {
    if (filterStatus === 'all') return contracts;
    if (filterStatus === 'active') return contracts.filter(c =>
      !['Locked', 'Revoked'].includes(c.status)
    );
    if (filterStatus === 'pending') return contracts.filter(c =>
      ['Created', 'Approved', 'Sent'].includes(c.status)
    );
    if (filterStatus === 'signed') return contracts.filter(c =>
      ['Signed', 'Locked'].includes(c.status)
    );
    return contracts;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-8 px-6 shadow-xl">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
            Contract Management Platform
          </h1>
          <p className="text-purple-100 mt-2 text-lg">Manage blueprints and contracts efficiently</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-6">
        {view === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
              {/* Blueprints Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800">Blueprints</h2>
                  <button
                    onClick={() => setView('createBlueprint')}
                    className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    <Plus size={20} />
                    New Blueprint
                  </button>
                </div>
                {blueprints.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
                      <Plus size={32} className="text-indigo-400" />
                    </div>
                    <p className="mb-4 text-xl">No blueprints yet</p>
                    <p className="text-sm text-gray-400">Create a blueprint to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {blueprints.map(blueprint => (
                      <div key={blueprint.id} className="p-6 border border-gray-100 rounded-xl hover:shadow-xl hover:border-indigo-200 transition-all duration-300 bg-gradient-to-r from-white to-indigo-50/30">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold text-xl text-gray-800">{blueprint.name}</h3>
                            <p className="text-sm text-indigo-600 mt-2 font-medium">{blueprint.fields.length} fields</p>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                setSelectedBlueprint(blueprint);
                                setView('createContract');
                              }}
                              className="p-3 text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 hover:scale-110"
                              title="Create Contract"
                            >
                              <Plus size={20} />
                            </button>
                            <button
                              onClick={() => handleDeleteBlueprint(blueprint.id)}
                              className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                              title="Delete"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
                <h2 className="text-3xl font-bold mb-8 text-gray-800">Statistics</h2>
                <div className="space-y-6">
                  <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <span className="font-bold text-lg text-gray-700">Total Contracts</span>
                    <span className="text-3xl font-bold text-blue-600">{contracts.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <span className="font-bold text-lg text-gray-700">Signed</span>
                    <span className="text-3xl font-bold text-green-600">
                      {contracts.filter(c => ['Signed', 'Locked'].includes(c.status)).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-100">
                    <span className="font-bold text-lg text-gray-700">Pending</span>
                    <span className="text-3xl font-bold text-yellow-600">
                      {contracts.filter(c => ['Created', 'Approved', 'Sent'].includes(c.status)).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl border border-red-100">
                    <span className="font-bold text-lg text-gray-700">Revoked</span>
                    <span className="text-3xl font-bold text-red-600">
                      {contracts.filter(c => c.status === 'Revoked').length}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contracts Table */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Contracts</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      filterStatus === 'all'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterStatus('active')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      filterStatus === 'active'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setFilterStatus('pending')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      filterStatus === 'pending'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setFilterStatus('signed')}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      filterStatus === 'signed'
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                  >
                    Signed
                  </button>
                </div>
              </div>
              {getFilteredContracts().length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <Eye size={32} className="text-gray-400" />
                  </div>
                  <p className="mb-4 text-xl">No contracts found</p>
                  <p className="text-sm text-gray-400">Create a blueprint first, then generate contracts from it</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-indigo-100">
                        <th className="text-left py-4 px-6 font-bold text-gray-800 text-lg">Contract Name</th>
                        <th className="text-left py-4 px-6 font-bold text-gray-800 text-lg">Blueprint</th>
                        <th className="text-left py-4 px-6 font-bold text-gray-800 text-lg">Status</th>
                        <th className="text-left py-4 px-6 font-bold text-gray-800 text-lg">Created Date</th>
                        <th className="text-center py-4 px-6 font-bold text-gray-800 text-lg">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getFilteredContracts().map(contract => (
                        <tr key={contract.id} className="border-b border-gray-50 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200">
                          <td className="py-4 px-6 font-medium text-gray-900">{contract.name}</td>
                          <td className="py-4 px-6 text-indigo-600 font-medium">{contract.blueprintName}</td>
                          <td className="py-4 px-6">
                            <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(contract.status)} shadow-sm`}>
                              {contract.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-gray-600 font-medium">
                            {new Date(contract.createdDate).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex justify-center gap-3">
                              <button
                                onClick={() => handleViewContract(contract)}
                                className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm"
                                title="View"
                              >
                                <Eye size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {view === 'createBlueprint' && (
          <BlueprintEditor
            onSave={handleSaveBlueprint}
            onCancel={() => setView('dashboard')}
          />
        )}

        {view === 'createContract' && selectedBlueprint && (
          <ContractForm
            blueprint={selectedBlueprint}
            onSave={handleSaveContract}
            onCancel={() => {
              setView('dashboard');
              setSelectedBlueprint(null);
            }}
          />
        )}

        {view === 'viewContract' && selectedContract && (
          <ContractView
            contract={selectedContract.contract}
            blueprint={selectedContract.blueprint}
            onClose={() => {
              setView('dashboard');
              setSelectedContract(null);
            }}
            onUpdateStatus={handleUpdateContractStatus}
          />
        )}
      </main>
    </div>
  );
};

export default App;