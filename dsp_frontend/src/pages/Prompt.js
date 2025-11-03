import React, { useState } from 'react';
import { apiRequest } from '../api/client';

/**
 * PUBLIC_INTERFACE
 * Prompt
 * Main prompt UI to submit natural language queries to backend and show result.
 */
function Prompt() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult('');

    // Backend DSP proxy endpoint, adjust if different
    const res = await apiRequest('/dsp/query', {
      method: 'POST',
      body: { prompt },
    });

    setLoading(false);

    if (!res.ok) {
      setError(res.error || 'Query failed');
      return;
    }

    // Display result (string or JSON)
    const data = res.data;
    if (typeof data === 'string') {
      setResult(data);
    } else if (data?.result) {
      setResult(data.result);
    } else {
      setResult(JSON.stringify(data, null, 2));
    }
  };

  return (
    <div className="card">
      <h1 className="title">Prompt</h1>
      <p className="subtitle">Ask anything in natural language. We will process it via the DSP backend.</p>

      <form className="form prompt-area" onSubmit={onSubmit}>
        <textarea
          className="textarea"
          placeholder="Type your question here..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />
        <div className="row">
          <button className="btn btn-primary" type="submit" disabled={loading || !prompt.trim()}>
            {loading ? 'Processing…' : 'Run query'}
          </button>
        </div>
      </form>

      {error && <div className="error" style={{ marginTop: 10 }}>{error}</div>}

      {result && (
        <div className="results" aria-live="polite">
          {result}
        </div>
      )}
    </div>
  );
}

export default Prompt;
