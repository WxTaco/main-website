import { useState } from 'react';
import type { ChangeEvent } from 'react';

export interface EmbedData {
  title?: string;
  description?: string;
  color?: string;
  author?: {
    name?: string;
    iconURL?: string;
    url?: string;
  };
  thumbnail?: string;
  image?: string;
  footer?: {
    text?: string;
    iconURL?: string;
  };
  fields?: Array<{
    name: string;
    value: string;
    inline: boolean;
  }>;
  timestamp?: boolean;
}

interface EmbedBuilderProps {
  embedData: EmbedData;
  onChange: (data: EmbedData) => void;
}

const EmbedBuilder: React.FC<EmbedBuilderProps> = ({ embedData, onChange }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'fields' | 'preview'>('general');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      onChange({
        ...embedData,
        [section]: {
          ...embedData[section as keyof EmbedData],
          [field]: value
        }
      });
    } else {
      onChange({
        ...embedData,
        [name]: value
      });
    }
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onChange({
      ...embedData,
      [name]: checked
    });
  };

  const handleColorChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...embedData,
      color: e.target.value
    });
  };

  const addField = () => {
    const newFields = [...(embedData.fields || []), { name: '', value: '', inline: false }];
    onChange({
      ...embedData,
      fields: newFields
    });
  };

  const updateField = (index: number, field: { name: string; value: string; inline: boolean }) => {
    if (!embedData.fields) return;
    
    const newFields = [...embedData.fields];
    newFields[index] = field;
    
    onChange({
      ...embedData,
      fields: newFields
    });
  };

  const removeField = (index: number) => {
    if (!embedData.fields) return;
    
    const newFields = [...embedData.fields];
    newFields.splice(index, 1);
    
    onChange({
      ...embedData,
      fields: newFields
    });
  };

  // Calculate embed color for preview
  const embedColor = embedData.color || '#c94baf'; // Default to wrapped-pink

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
      <div className="flex border-b border-gray-700">
        <button
          className={`px-4 py-2 ${activeTab === 'general' ? 'bg-wrapped-pink text-white' : 'bg-gray-800 text-gray-300'}`}
          onClick={() => setActiveTab('general')}
        >
          General
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'fields' ? 'bg-wrapped-pink text-white' : 'bg-gray-800 text-gray-300'}`}
          onClick={() => setActiveTab('fields')}
        >
          Fields
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'preview' ? 'bg-wrapped-pink text-white' : 'bg-gray-800 text-gray-300'}`}
          onClick={() => setActiveTab('preview')}
        >
          Preview
        </button>
      </div>

      <div className="p-4">
        {activeTab === 'general' && (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1 text-sm">Title</label>
              <input
                type="text"
                name="title"
                value={embedData.title || ''}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white text-sm"
                placeholder="Embed title"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1 text-sm">Description</label>
              <textarea
                name="description"
                value={embedData.description || ''}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white text-sm h-20"
                placeholder="Embed description"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1 text-sm">Color</label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={embedData.color || '#c94baf'}
                  onChange={handleColorChange}
                  className="bg-gray-800 border border-gray-700 rounded-md h-8 w-8"
                />
                <input
                  type="text"
                  name="color"
                  value={embedData.color || ''}
                  onChange={handleChange}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white text-sm"
                  placeholder="#c94baf"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-1 text-sm">Author</label>
              <div className="space-y-2">
                <input
                  type="text"
                  name="author.name"
                  value={embedData.author?.name || ''}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white text-sm"
                  placeholder="Author name"
                />
                <input
                  type="text"
                  name="author.iconURL"
                  value={embedData.author?.iconURL || ''}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white text-sm"
                  placeholder="Author icon URL"
                />
                <input
                  type="text"
                  name="author.url"
                  value={embedData.author?.url || ''}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white text-sm"
                  placeholder="Author URL"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-1 text-sm">Thumbnail URL</label>
              <input
                type="text"
                name="thumbnail"
                value={embedData.thumbnail || ''}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white text-sm"
                placeholder="https://example.com/thumbnail.png"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1 text-sm">Image URL</label>
              <input
                type="text"
                name="image"
                value={embedData.image || ''}
                onChange={handleChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white text-sm"
                placeholder="https://example.com/image.png"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-1 text-sm">Footer</label>
              <div className="space-y-2">
                <input
                  type="text"
                  name="footer.text"
                  value={embedData.footer?.text || ''}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white text-sm"
                  placeholder="Footer text"
                />
                <input
                  type="text"
                  name="footer.iconURL"
                  value={embedData.footer?.iconURL || ''}
                  onChange={handleChange}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white text-sm"
                  placeholder="Footer icon URL"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="timestamp"
                name="timestamp"
                checked={embedData.timestamp || false}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              <label htmlFor="timestamp" className="text-gray-300 text-sm">Include timestamp</label>
            </div>
          </div>
        )}

        {activeTab === 'fields' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">Embed Fields</h3>
              <button
                onClick={addField}
                className="bg-wrapped-pink hover:bg-pink-600 text-white px-3 py-1 rounded-md text-sm"
              >
                Add Field
              </button>
            </div>

            {embedData.fields && embedData.fields.length > 0 ? (
              <div className="space-y-4">
                {embedData.fields.map((field, index) => (
                  <div key={index} className="bg-gray-800 p-3 rounded-md border border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 text-sm font-medium">Field {index + 1}</span>
                      <button
                        onClick={() => removeField(index)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateField(index, { ...field, name: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm"
                        placeholder="Field name"
                      />
                      <textarea
                        value={field.value}
                        onChange={(e) => updateField(index, { ...field, value: e.target.value })}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm h-16"
                        placeholder="Field value"
                      />
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`inline-${index}`}
                          checked={field.inline}
                          onChange={(e) => updateField(index, { ...field, inline: e.target.checked })}
                          className="mr-2"
                        />
                        <label htmlFor={`inline-${index}`} className="text-gray-300 text-sm">Inline field</label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No fields added yet</p>
                <p className="text-sm mt-1">Click "Add Field" to create a new field</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="border-l-4 rounded-sm overflow-hidden" style={{ borderColor: embedColor }}>
              <div className="bg-gray-900 p-3">
                {embedData.author && embedData.author.name && (
                  <div className="flex items-center mb-2">
                    {embedData.author.iconURL && (
                      <img 
                        src={embedData.author.iconURL} 
                        alt="Author" 
                        className="w-6 h-6 rounded-full mr-2"
                        onError={(e) => (e.currentTarget.style.display = 'none')}
                      />
                    )}
                    <span className="text-white text-sm font-medium">
                      {embedData.author.name}
                    </span>
                  </div>
                )}

                {embedData.title && (
                  <div className="text-white font-semibold mb-1">{embedData.title}</div>
                )}

                {embedData.description && (
                  <div className="text-gray-300 text-sm mb-3 whitespace-pre-wrap">{embedData.description}</div>
                )}

                {embedData.fields && embedData.fields.length > 0 && (
                  <div className="grid grid-cols-1 gap-2 mb-3">
                    {embedData.fields.map((field, index) => (
                      <div key={index} className={field.inline ? "inline-block mr-4" : "block"}>
                        <div className="text-white text-sm font-semibold">{field.name}</div>
                        <div className="text-gray-300 text-sm">{field.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                {embedData.image && (
                  <div className="mb-3">
                    <img 
                      src={embedData.image} 
                      alt="Embed" 
                      className="max-w-full rounded-md"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}

                <div className="flex items-center justify-between">
                  {embedData.footer && embedData.footer.text && (
                    <div className="flex items-center">
                      {embedData.footer.iconURL && (
                        <img 
                          src={embedData.footer.iconURL} 
                          alt="Footer" 
                          className="w-5 h-5 rounded-full mr-2"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                      )}
                      <span className="text-gray-400 text-xs">{embedData.footer.text}</span>
                    </div>
                  )}

                  {embedData.timestamp && (
                    <div className="text-gray-400 text-xs">
                      {new Date().toLocaleString()}
                    </div>
                  )}
                </div>

                {embedData.thumbnail && (
                  <div className="absolute top-0 right-0 mt-3 mr-3">
                    <img 
                      src={embedData.thumbnail} 
                      alt="Thumbnail" 
                      className="w-16 h-16 rounded-md"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmbedBuilder;
