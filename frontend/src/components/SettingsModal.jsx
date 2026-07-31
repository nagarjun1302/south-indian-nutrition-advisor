import React, { useState } from 'react';
import { X, Server, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { getApiBaseUrl, setApiBaseUrl, checkBackendHealth } from '../services/api';

export const SettingsModal = ({
  isOpen,
  onClose,
  onRefreshHealth,
}) => {
  const [url, setUrl] = useState(getApiBaseUrl());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    setApiBaseUrl(url);
    const result = await checkBackendHealth();
    setTestResult(result);
    setTesting(false);
    onRefreshHealth();
  };

  const handleSave = () => {
    setApiBaseUrl(url);
    onRefreshHealth();
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(6px)',
        display: 'grid',
        placeItems: 'center',
        padding: '20px',
      }}
    >
      <div
        className="glass-card animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '24px',
          borderRadius: '16px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Server size={20} color="var(--accent-orange)" />
            <h3 style={{ fontSize: '18px', fontWeight: '800' }}>Backend API Settings</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
            FastAPI Server Base URL
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="http://localhost:8000"
          />
          <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginTop: '6px' }}>
            Endpoint where your <code>backend/api.py</code> server is running.
          </p>
        </div>

        {testResult && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              marginBottom: '20px',
              background: testResult.ok ? 'var(--accent-green-light)' : 'var(--accent-red-light)',
              border: `1px solid ${testResult.ok ? 'var(--accent-green-border)' : 'rgba(239, 68, 68, 0.3)'}`,
              color: testResult.ok ? 'var(--accent-green)' : 'var(--accent-red)',
              fontSize: '12px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            {testResult.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{testResult.message}</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button className="btn btn-outline btn-sm" onClick={handleTestConnection} disabled={testing}>
            <RefreshCw size={14} className={testing ? 'animate-spin' : ''} />
            <span>{testing ? 'Testing...' : 'Test Connection'}</span>
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
