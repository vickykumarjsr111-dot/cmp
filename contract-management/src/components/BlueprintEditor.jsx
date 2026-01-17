import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

// Types
const FIELD_TYPES = ['Text', 'Date', 'Signature', 'Checkbox'];

const BlueprintEditor = ({ onSave, onCancel, editBlueprint = null }) => {
  const [name, setName] = useState(editBlueprint?.name || '');
  const [fields, setFields] = useState(editBlueprint?.fields || []);
  const [draggedField, setDraggedField] = useState(null);

  const addField = (type) => {
    const newField = {
      id: Date.now(),
      type,
      label: `${type} Field`,
      position: fields.length
    };
    setFields([...fields, newField]);
  };

  const updateField = (id, key, value) => {
    setFields(fields.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const deleteField = (id) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleSave = () => {
    if (!name.trim()) {
      alert('Blueprint name is required');
      return;
    }
    if (fields.length === 0) {
      alert('Add at least one field');
      return;
    }
    onSave({ id: editBlueprint?.id || Date.now(), name, fields });
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto border border-white/20">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        {editBlueprint ? 'Edit Blueprint' : 'Create Blueprint'}
      </h2>

      <div className="mb-8">
        <label className="block text-lg font-semibold mb-3 text-gray-700">Blueprint Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200 text-lg"
          placeholder="e.g., Employment Contract Template"
        />
      </div>

      <div className="mb-8">
        <label className="block text-lg font-semibold mb-4 text-gray-700">Add Fields</label>
        <div className="flex gap-3 flex-wrap">
          {FIELD_TYPES.map(type => (
            <button
              key={type}
              onClick={() => addField(type)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold"
            >
              + {type}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-lg font-semibold mb-4 text-gray-700">Fields</label>
        {fields.length === 0 ? (
          <div className="text-center py-12 bg-gradient-to-r from-gray-50 to-indigo-50 rounded-xl text-gray-500 border-2 border-dashed border-gray-200">
            <Plus size={48} className="mx-auto mb-4 text-indigo-300" />
            <p className="text-xl">No fields added yet</p>
            <p className="text-sm mt-2">Click the buttons above to add fields</p>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-center p-6 bg-gradient-to-r from-white to-indigo-50/50 rounded-xl border border-indigo-100 hover:shadow-lg transition-all duration-200">
                <span className="text-lg font-bold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">#{index + 1}</span>
                <div className="flex-1">
                  <input
                    type="text"
                    value={field.label}
                    onChange={(e) => updateField(field.id, 'label', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all duration-200"
                    placeholder="Field label"
                  />
                </div>
                <span className="px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full text-sm font-bold border border-indigo-200">
                  {field.type}
                </span>
                <button
                  onClick={() => deleteField(field.id)}
                  className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="flex-1 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Save Blueprint
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

export default BlueprintEditor;