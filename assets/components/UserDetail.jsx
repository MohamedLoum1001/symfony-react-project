import React, { useEffect, useState } from 'react';

const UserDetail = ({ userId, onBack }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await fetch(`/api/users/${userId}`);
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Erreur lors du chargement des détails :', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [userId]);

    if (loading) {
        return <p style={{ textAlign: 'center', color: '#666' }}>Chargement des informations...</p>;
    }

    if (!user) {
        return <p style={{ textAlign: 'center', color: '#e53e3e' }}>Utilisateur introuvable.</p>;
    }

    return (
        <div style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <button
                onClick={onBack}
                style={{
                    backgroundColor: '#4a5568',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginBottom: '20px'
                }}
            >
                ← Retour à la liste
            </button>

            <h2>Détails de l'utilisateur #{user.id}</h2>
            <p><strong>Date de naissance :</strong> {user.birthDate || 'Non renseignée'}</p>

            <h3 style={{ marginTop: '24px' }}>Possessions</h3>
            {user.possessions.length === 0 ? (
                <p style={{ color: '#718096' }}>Aucune possession enregistrée pour cet utilisateur.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#edf2f7', borderBottom: '2px solid #cbd5e0' }}>
                            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #cbd5e0' }}>ID</th>
                            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #cbd5e0' }}>Nom</th>
                            <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #cbd5e0' }}>Type</th>
                            <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #cbd5e0' }}>Valeur (€)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.possessions.map((p) => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                <td style={{ padding: '8px 10px', border: '1px solid #cbd5e0' }}>{p.id}</td>
                                <td style={{ padding: '8px 10px', border: '1px solid #cbd5e0' }}>{p.nom}</td>
                                <td style={{ padding: '8px 10px', border: '1px solid #cbd5e0' }}>{p.type}</td>
                                <td style={{ padding: '8px 10px', border: '1px solid #cbd5e0', textAlign: 'right' }}>{p.valeur} €</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserDetail;