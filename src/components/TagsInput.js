import { useState, useRef } from 'react';
import { Form } from 'react-bootstrap';
import { X } from 'react-bootstrap-icons';

export function TagsInput({
  value = [],
  onChange,
  placeholder,
  maxLength = 50,           // ← новый пропс, по умолчанию 50
}) {
  const [input, setInput] = useState('')
  const [feedback, setFeedback] = useState('')
  const inputRef = useRef(null)

  placeholder = placeholder || 'Введите артикул и нажмите Enter или вставьте пачку…';

  const addTags = (newTags) => {
    // 1. Нормализация (trim + uppercase)
    const normalized = newTags
      .map(t => (t || '').trim().toUpperCase())
      .filter(t => t.length > 0);
  
    if (normalized.length === 0) return;
  
    // 2. Сколько всего нормализованных пришло
    const incomingCount = normalized.length;
  
    // 3. Уникальные из пачки
    const uniqueNew = [...new Set(normalized)];
  
    // 4. Сколько дублей было внутри пачки
    const duplicatesInPaste = incomingCount - uniqueNew.length;
  
    // 5. Текущие теги как Set
    const currentSet = new Set(value);
  
    const tooLong = [];
    const duplicatesWithExisting = [];
    const toAdd = [];
  
    uniqueNew.forEach(t => {
      if (t.length > maxLength) {
        tooLong.push(t);
      } else if (currentSet.has(t)) {
        duplicatesWithExisting.push(t);
      } else {
        toAdd.push(t);
      }
    });
  
    // 6. Добавляем, если есть что
    if (toAdd.length > 0) {
      onChange([...value, ...toAdd]);
      setInput('');
    }
  
    // 7. Собираем все сообщения
    const messages = [];
  
    if (duplicatesInPaste > 0) {
      messages.push(`в пачке ${duplicatesInPaste} дубл${duplicatesInPaste === 1 ? 'ь' : 'ей'}`);
    }
  
    if (duplicatesWithExisting.length > 0) {
      messages.push(`уже есть ${duplicatesWithExisting.length}`);
    }
  
    if (tooLong.length > 0) {
      messages.push(`слишком длинные — ${tooLong.length}`);
    }
  
    if (messages.length > 0) {
      setFeedback(`Пропущено: ${messages.join(', ')}`);
      setTimeout(() => setFeedback(''), 6000);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      if (input.trim()?.toUpperCase()) {
        addTags([input]);
      }
    }
    if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const items = paste.split(/[\s,;\n\t]+/).filter(Boolean);
    addTags(items);
  };

  const removeTag = (indexToRemove) => {
    onChange(value.filter((_, i) => i !== indexToRemove));
  };

  const truncate = (str) => {
    if (!str) return '';
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - 3) + '…';
  };

  return (
    <Form.Group className="mb-2">
      <div
        className="tagsInput form-control d-flex flex-wrap gap-1 p-2"
        style={{
          minHeight: '38px',
          cursor: 'text',
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {value.map((tag, index) => (
          <div
            key={index}
            className="d-flex align-items-center gap-1 px-2 py-1 rounded bg-light border"
            style={{
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
              maxWidth: '280px',          // можно подстроить под maxLength
              overflow: 'hidden',
            }}
            title={tag}                   // полный текст при наведении
          >
            {truncate(tag)}
            <button
              type="button"
              className="btn btn-sm p-0 border-0"
              onClick={() => removeTag(index)}
              aria-label="Удалить"
            >
              <X size={14} />
            </button>
          </div>
        ))}

        <input
          ref={inputRef}
          type="text"
          className="inputTagsInput flex-grow-1 border-0 outline-0 bg-transparent"
          style={{ minWidth: '130px' }}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={value.length === 0 ? placeholder : ''}
        />
      </div>
      {feedback && (
        <div className="text-muted small mt-1">
          {feedback}
        </div>
      )}
    </Form.Group>
  );
}