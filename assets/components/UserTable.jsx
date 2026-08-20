import React from 'react';

const UserTable = ({ users, loading, onDeleteUser, onSelectUser }) => {
    if (loading) {
        return <p style={{ textAlign: 'center', color: '#666' }}>Chargement des données...</p>;
    }

    if (users.length === 0) {
        return <p style={{ textAlign: 'center', color: '#666' }}>Aucun utilisateur trouvé dans la base de données.</p>;
    }

    return (
        <div style={{ overflowX: 'auto', marginTop: '20px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4', borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Identifiant (ID)</th>
                        <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Date de naissance</th>
                        <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Âge</th>
                        <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={{ padding: '10px 12px', border: '1px solid #ddd' }}>
                                <button
                                    onClick={() => onSelectUser(user.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#3182ce',
                                        cursor: 'pointer',
                                        textDecoration: 'underline',
                                        fontSize: '1rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Utilisateur #{user.id}
                                </button>
                            </td>
                            <td style={{ padding: '10px 12px', border: '1px solid #ddd' }}>{user.birthDate}</td>
                            <td style={{ padding: '10px 12px', border: '1px solid #ddd', textAlign: 'center' }}>
                                {user.age !== null ? `${user.age} ans` : '-'}
                            </td>
                            <td style={{ padding: '10px 12px', border: '1px solid #ddd', textAlign: 'center' }}>
                                <button
                                    onClick={() => onDeleteUser(user.id)}
                                    style={{
                                        backgroundColor: '#e53e3e',
                                        color: '#fff',
                                        border: 'none',
                                        padding: '6px 12px',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserTable;