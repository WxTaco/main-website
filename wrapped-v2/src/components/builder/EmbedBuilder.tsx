import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';

// Discord embed limitations
const DISCORD_LIMITS = {
  TITLE_MAX_LENGTH: 256,
  DESCRIPTION_MAX_LENGTH: 4096,
  FIELD_NAME_MAX_LENGTH: 256,
  FIELD_VALUE_MAX_LENGTH: 1024,
  FOOTER_MAX_LENGTH: 2048,
  AUTHOR_NAME_MAX_LENGTH: 256,
  MAX_FIELDS: 25,
  TOTAL_EMBED_CHARS: 6000
};

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

// Interface for validation errors
interface ValidationErrors {
  title?: string;
  description?: string;
  authorName?: string;
  footerText?: string;
  fields?: {
    [key: number]: {
      name?: string;
      value?: string;
    }
  };
  totalChars?: string;
}

// Calculate total characters in the embed
const calculateTotalChars = (data: EmbedData): number => {
  let total = 0;

  if (data.title) total += data.title.length;
  if (data.description) total += data.description.length;

  if (data.author?.name) total += data.author.name.length;

  if (data.footer?.text) total += data.footer.text.length;

  if (data.fields) {
    data.fields.forEach(field => {
      total += field.name.length + field.value.length;
    });
  }

  return total;
};

// Validate embed data against Discord's limitations
const validateEmbedData = (data: EmbedData): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Check title length
  if (data.title && data.title.length > DISCORD_LIMITS.TITLE_MAX_LENGTH) {
    errors.title = `Title exceeds Discord's limit of ${DISCORD_LIMITS.TITLE_MAX_LENGTH} characters`;
  }

  // Check description length
  if (data.description && data.description.length > DISCORD_LIMITS.DESCRIPTION_MAX_LENGTH) {
    errors.description = `Description exceeds Discord's limit of ${DISCORD_LIMITS.DESCRIPTION_MAX_LENGTH} characters`;
  }

  // Check author name length
  if (data.author?.name && data.author.name.length > DISCORD_LIMITS.AUTHOR_NAME_MAX_LENGTH) {
    errors.authorName = `Author name exceeds Discord's limit of ${DISCORD_LIMITS.AUTHOR_NAME_MAX_LENGTH} characters`;
  }

  // Check footer text length
  if (data.footer?.text && data.footer.text.length > DISCORD_LIMITS.FOOTER_MAX_LENGTH) {
    errors.footerText = `Footer text exceeds Discord's limit of ${DISCORD_LIMITS.FOOTER_MAX_LENGTH} characters`;
  }

  // Check fields
  if (data.fields) {
    // Check number of fields
    if (data.fields.length > DISCORD_LIMITS.MAX_FIELDS) {
      if (!errors.fields) errors.fields = {};
      errors.fields[-1] = { name: `Discord allows a maximum of ${DISCORD_LIMITS.MAX_FIELDS} fields` };
    }

    // Check each field's name and value
    data.fields.forEach((field, index) => {
      if (!field.name.trim()) {
        if (!errors.fields) errors.fields = {};
        if (!errors.fields[index]) errors.fields[index] = {};
        errors.fields[index].name = 'Field name cannot be empty';
      } else if (field.name.length > DISCORD_LIMITS.FIELD_NAME_MAX_LENGTH) {
        if (!errors.fields) errors.fields = {};
        if (!errors.fields[index]) errors.fields[index] = {};
        errors.fields[index].name = `Field name exceeds Discord's limit of ${DISCORD_LIMITS.FIELD_NAME_MAX_LENGTH} characters`;
      }

      if (!field.value.trim()) {
        if (!errors.fields) errors.fields = {};
        if (!errors.fields[index]) errors.fields[index] = {};
        errors.fields[index].value = 'Field value cannot be empty';
      } else if (field.value.length > DISCORD_LIMITS.FIELD_VALUE_MAX_LENGTH) {
        if (!errors.fields) errors.fields = {};
        if (!errors.fields[index]) errors.fields[index] = {};
        errors.fields[index].value = `Field value exceeds Discord's limit of ${DISCORD_LIMITS.FIELD_VALUE_MAX_LENGTH} characters`;
      }
    });
  }

  // Check total character count
  const totalChars = calculateTotalChars(data);
  if (totalChars > DISCORD_LIMITS.TOTAL_EMBED_CHARS) {
    errors.totalChars = `Total characters (${totalChars}) exceed Discord's limit of ${DISCORD_LIMITS.TOTAL_EMBED_CHARS}`;
  }

  return errors;
};

const EmbedBuilder: React.FC<EmbedBuilderProps> = ({ embedData, onChange }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'fields'>('general');
  const [fullPreview, setFullPreview] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Validate embed data whenever it changes
  useEffect(() => {
    const errors = validateEmbedData(embedData);
    setValidationErrors(errors);
  }, [embedData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [section, field] = name.split('.');

      // Handle nested properties based on the section
      if (section === 'author') {
        onChange({
          ...embedData,
          author: {
            ...embedData.author,
            [field]: value
          }
        });
      } else if (section === 'footer') {
        onChange({
          ...embedData,
          footer: {
            ...embedData.footer,
            [field]: value
          }
        });
      }
      // Add more sections here if needed in the future
    } else {
      // Handle top-level properties
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
    <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden flex flex-col">
      {/* Top section with tabs */}
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
      </div>

      {/* Form section */}
      <div className="p-4">
        {activeTab === 'general' && (
          <div className="space-y-4">
            {validationErrors.totalChars && (
              <div className="bg-red-900/50 border border-red-500 rounded-md p-3 text-red-200 text-sm">
                <span className="font-semibold">Error:</span> {validationErrors.totalChars}
              </div>
            )}

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-gray-300 text-sm">Title</label>
                <span className="text-gray-400 text-xs">
                  {embedData.title?.length || 0}/{DISCORD_LIMITS.TITLE_MAX_LENGTH}
                </span>
              </div>
              <input
                type="text"
                name="title"
                value={embedData.title || ''}
                onChange={handleChange}
                className={`w-full bg-gray-800 border ${validationErrors.title ? 'border-red-500' : 'border-gray-700'} rounded-md px-3 py-2 text-white text-sm`}
                placeholder="Embed title"
                maxLength={DISCORD_LIMITS.TITLE_MAX_LENGTH}
              />
              {validationErrors.title && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.title}</p>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-gray-300 text-sm">Description</label>
                <span className="text-gray-400 text-xs">
                  {embedData.description?.length || 0}/{DISCORD_LIMITS.DESCRIPTION_MAX_LENGTH}
                </span>
              </div>
              <textarea
                name="description"
                value={embedData.description || ''}
                onChange={handleChange}
                className={`w-full bg-gray-800 border ${validationErrors.description ? 'border-red-500' : 'border-gray-700'} rounded-md px-3 py-2 text-white text-sm h-20`}
                placeholder="Embed description"
                maxLength={DISCORD_LIMITS.DESCRIPTION_MAX_LENGTH}
              />
              {validationErrors.description && (
                <p className="text-red-400 text-xs mt-1">{validationErrors.description}</p>
              )}
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
              <div className="flex justify-between items-center mb-1">
                <label className="block text-gray-300 text-sm">Author</label>
                {embedData.author?.name && (
                  <span className="text-gray-400 text-xs">
                    {embedData.author.name.length}/{DISCORD_LIMITS.AUTHOR_NAME_MAX_LENGTH}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  name="author.name"
                  value={embedData.author?.name || ''}
                  onChange={handleChange}
                  className={`w-full bg-gray-800 border ${validationErrors.authorName ? 'border-red-500' : 'border-gray-700'} rounded-md px-3 py-2 text-white text-sm`}
                  placeholder="Author name"
                  maxLength={DISCORD_LIMITS.AUTHOR_NAME_MAX_LENGTH}
                />
                {validationErrors.authorName && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.authorName}</p>
                )}
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
              <div className="flex justify-between items-center mb-1">
                <label className="block text-gray-300 text-sm">Footer</label>
                {embedData.footer?.text && (
                  <span className="text-gray-400 text-xs">
                    {embedData.footer.text.length}/{DISCORD_LIMITS.FOOTER_MAX_LENGTH}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  name="footer.text"
                  value={embedData.footer?.text || ''}
                  onChange={handleChange}
                  className={`w-full bg-gray-800 border ${validationErrors.footerText ? 'border-red-500' : 'border-gray-700'} rounded-md px-3 py-2 text-white text-sm`}
                  placeholder="Footer text"
                  maxLength={DISCORD_LIMITS.FOOTER_MAX_LENGTH}
                />
                {validationErrors.footerText && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.footerText}</p>
                )}
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
              <div>
                <h3 className="text-white font-semibold">Embed Fields</h3>
                <p className="text-gray-400 text-xs mt-1">
                  {embedData.fields?.length || 0}/{DISCORD_LIMITS.MAX_FIELDS} fields used
                </p>
              </div>
              <button
                onClick={addField}
                className={`${embedData.fields && embedData.fields.length >= DISCORD_LIMITS.MAX_FIELDS
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-wrapped-pink hover:bg-pink-600'} text-white px-3 py-1 rounded-md text-sm`}
                disabled={embedData.fields && embedData.fields.length >= DISCORD_LIMITS.MAX_FIELDS}
              >
                Add Field
              </button>
            </div>

            {validationErrors.fields && validationErrors.fields[-1] && (
              <div className="bg-red-900/50 border border-red-500 rounded-md p-3 text-red-200 text-sm mb-4">
                <span className="font-semibold">Error:</span> {validationErrors.fields[-1].name}
              </div>
            )}

            {embedData.fields && embedData.fields.length > 0 ? (
              <div className="space-y-4">
                {embedData.fields.map((field, index) => (
                  <div key={index} className={`bg-gray-800 p-3 rounded-md border ${
                    validationErrors.fields && validationErrors.fields[index]
                      ? 'border-red-500'
                      : 'border-gray-700'
                  }`}>
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
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-gray-400 text-xs">Name</label>
                        <span className="text-gray-400 text-xs">
                          {field.name.length}/{DISCORD_LIMITS.FIELD_NAME_MAX_LENGTH}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateField(index, { ...field, name: e.target.value })}
                        className={`w-full bg-gray-700 border ${
                          validationErrors.fields && validationErrors.fields[index]?.name
                            ? 'border-red-500'
                            : 'border-gray-600'
                        } rounded-md px-3 py-2 text-white text-sm`}
                        placeholder="Field name"
                        maxLength={DISCORD_LIMITS.FIELD_NAME_MAX_LENGTH}
                      />
                      {validationErrors.fields && validationErrors.fields[index]?.name && (
                        <p className="text-red-400 text-xs mt-1">{validationErrors.fields[index].name}</p>
                      )}

                      <div className="flex justify-between items-center mb-1">
                        <label className="text-gray-400 text-xs">Value</label>
                        <span className="text-gray-400 text-xs">
                          {field.value.length}/{DISCORD_LIMITS.FIELD_VALUE_MAX_LENGTH}
                        </span>
                      </div>
                      <textarea
                        value={field.value}
                        onChange={(e) => updateField(index, { ...field, value: e.target.value })}
                        className={`w-full bg-gray-700 border ${
                          validationErrors.fields && validationErrors.fields[index]?.value
                            ? 'border-red-500'
                            : 'border-gray-600'
                        } rounded-md px-3 py-2 text-white text-sm h-16`}
                        placeholder="Field value"
                        maxLength={DISCORD_LIMITS.FIELD_VALUE_MAX_LENGTH}
                      />
                      {validationErrors.fields && validationErrors.fields[index]?.value && (
                        <p className="text-red-400 text-xs mt-1">{validationErrors.fields[index].value}</p>
                      )}

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


      </div>

      {/* Preview section at the bottom */}
      <div className="border-t border-gray-700 w-full">
        <div className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-white font-semibold">Embed Preview</h3>
            <div className="flex items-center">
              <span className="text-gray-300 text-sm mr-2">Compact</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={fullPreview}
                  onChange={() => setFullPreview(!fullPreview)}
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-wrapped-pink"></div>
              </label>
              <span className="text-gray-300 text-sm ml-2">Full</span>
            </div>
          </div>

          {/* Validation summary */}
          {Object.keys(validationErrors).length > 0 && (
            <div className="bg-red-900/50 border border-red-500 rounded-md p-3 text-red-200 text-sm mb-4">
              <div className="font-semibold mb-1">Discord Embed Validation Errors:</div>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.title && <li>{validationErrors.title}</li>}
                {validationErrors.description && <li>{validationErrors.description}</li>}
                {validationErrors.authorName && <li>{validationErrors.authorName}</li>}
                {validationErrors.footerText && <li>{validationErrors.footerText}</li>}
                {validationErrors.totalChars && <li>{validationErrors.totalChars}</li>}
                {validationErrors.fields && validationErrors.fields[-1] && (
                  <li>{validationErrors.fields[-1].name}</li>
                )}
                {validationErrors.fields && Object.keys(validationErrors.fields)
                  .filter(key => key !== '-1')
                  .map(key => {
                    const index = parseInt(key);
                    const fieldErrors = validationErrors.fields![index];
                    return (
                      <li key={key}>
                        Field {index + 1}: {fieldErrors.name || fieldErrors.value}
                      </li>
                    );
                  })
                }
              </ul>
            </div>
          )}
        </div>

        {/* Full-width preview container */}
        <div className={`w-full ${fullPreview ? 'h-[500px] overflow-auto custom-scrollbar px-4 pb-4' : 'relative px-4 pb-4'}`}>
          {!fullPreview && (
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-800 to-transparent flex justify-center items-end pb-1 z-10">
              <div className="flex flex-col items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-wrapped-pink animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                <span className="text-xs text-gray-400">Toggle "Full" to see all content</span>
              </div>
            </div>
          )}
          <div className="border-l-4 rounded-sm overflow-hidden relative w-full bg-gray-800 p-4" style={{ borderColor: embedColor }}>
            <div className={`bg-gray-900 p-3 ${fullPreview ? 'min-h-[450px]' : 'max-h-[300px] overflow-hidden'}`}>
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
                    <span className="text-white text-sm font-medium overflow-hidden text-ellipsis"
                      style={{
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        maxWidth: '100%',
                        display: 'inline-block'
                      }}
                    >
                      {embedData.author.name}
                    </span>
                  </div>
                )}

                {embedData.title && (
                  <div className="text-white font-semibold mb-1 overflow-hidden text-ellipsis"
                    style={{
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      maxWidth: '100%'
                    }}
                  >
                    {embedData.title}
                  </div>
                )}

                {embedData.description && (
                  <div className="text-gray-300 text-sm mb-3 whitespace-pre-wrap overflow-hidden"
                    style={{
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                      maxWidth: '100%'
                    }}
                  >
                    {embedData.description}
                  </div>
                )}

                {embedData.fields && embedData.fields.length > 0 && (
                  <div className={`${fullPreview ? 'grid grid-cols-1 md:grid-cols-3' : 'grid grid-cols-1'} gap-3 mb-3`}>
                    {embedData.fields.map((field, index) => (
                      <div key={index} className={`${field.inline ? (fullPreview ? "col-span-1" : "mb-2") : "col-span-full mb-2"}`}>
                        <div className="text-white text-sm font-semibold overflow-hidden text-ellipsis"
                          style={{
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            maxWidth: '100%'
                          }}
                        >
                          {field.name}
                        </div>
                        <div className="text-gray-300 text-sm overflow-hidden"
                          style={{
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            maxWidth: '100%',
                            whiteSpace: 'pre-wrap'
                          }}
                        >
                          {field.value}
                        </div>
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
                      <span className="text-gray-400 text-xs overflow-hidden text-ellipsis"
                      style={{
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word',
                        maxWidth: '100%',
                        display: 'inline-block'
                      }}
                    >
                      {embedData.footer.text}
                    </span>
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

          {fullPreview && (
            <div className="mx-4 mt-4 bg-gray-900 rounded-lg p-3 border border-gray-700">
              <p className="text-gray-300 text-sm">
                <span className="text-wrapped-pink font-semibold">Note:</span> This is a full preview of how your embed will look when expanded in Discord.
                You can scroll to see all content if the embed is large.
              </p>
            </div>
          )}
        </div>
      </div>
  );
};

export default EmbedBuilder;
