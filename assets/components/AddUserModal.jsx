import React, { useState } from 'react';

const AddUserModal = ({ isOpen, onClose, onUserAdded, apiBaseUrl = 'http://127.0.0.1:8000' }) => {
    const [birthDate, setBirthDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const baseUrl = apiBaseUrl || 'http://127.0.0.1:8000';
            const response = await fetch(`${baseUrl}/api/users`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
                body: JSON.stringify({ birthDate }),
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Erreur ${response.status} : ${text}`);
            }

            const newUser = await response.json();
            onUserAdded(newUser);
            setBirthDate('');
            onClose();
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                padding: '24px',
                width: '100%',
                maxWidth: '420px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Ajouter un utilisateur</h3>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#718096' }}
                    >
                        ×
                    </button>
                </div>

                {error && (
                    <div style={{ backgroundColor: '#fed7d7', color: '#c53030', padding: '8px 12px', borderRadius: '4px', marginBottom: '16px', fontSize: '0.875rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#4a5568' }}>
                            Date de naissance
                        </label>
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '8px 12px',
                                borderRadius: '4px',
                                border: '1px solid #cbd5e0',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                backgroundColor: '#edf2f7',
                                color: '#4a5568',
                                border: '1px solid #cbd5e0',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                            }}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                backgroundColor: '#3182ce',
                                color: '#fff',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                cursor: isSubmitting ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isSubmitting ? 'Enregistrement...' : 'Ajouter'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserModal;