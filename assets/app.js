import './styles/app.css';
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import UserTable from './components/UserTable';
import UserDetail from './components/UserDetail';
import AddUserModal from './components/AddUserModal';

const App = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs :', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
            return;
        }

        try {
            const response = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
            }
        } catch (error) {
            console.error('Erreur lors de la suppression :', error);
        }
    };

    const handleUserAdded = (newUser) => {
        setUsers((prevUsers) => [...prevUsers, newUser]);
    };

    return (
        <main style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>Gestion des Utilisateurs</h1>

            {selectedUserId ? (
                <UserDetail
                    userId={selectedUserId}
                    onBack={() => setSelectedUserId(null)}
                />
            ) : (
                <>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            style={{
                                backgroundColor: '#38a169',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 18px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            + Nouvel utilisateur
                        </button>
                    </div>

                    <UserTable
                        users={users}
                        loading={loading}
                        onDeleteUser={handleDelete}
                        onSelectUser={(id) => setSelectedUserId(id)}
                    />

                    <AddUserModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onUserAdded={handleUserAdded}
                    />
                </>
            )}
        </main>
    );
};

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
}