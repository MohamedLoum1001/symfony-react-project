import React, { useEffect, useState } from 'react';
import UserTable from './components/UserTable';
import UserDetail from './components/UserDetail';
import AddUserModal from './components/AddUserModal';

// Récupère l'URL de l'API depuis les variables d'environnement (Vite ou standard)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Charger la liste des utilisateurs
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
      if (!response.ok) {
        throw new Error('Erreur réseau lors de la récupération des données');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs :', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Supprimer un utilisateur
  const handleDelete = async (id) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      } else {
        console.error('Erreur lors de la suppression de l’utilisateur');
      }
    } catch (error) {
      console.error('Erreur réseau :', error);
    }
  };

  // Mettre à jour la liste après ajout via la modale
  const handleUserAdded = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  return (
    <main style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'sans-serif', padding: '0 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>Gestion des Utilisateurs</h1>

      {selectedUserId ? (
        <UserDetail
          userId={selectedUserId}
          apiBaseUrl={API_BASE_URL}
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
                fontWeight: 'bold',
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
            apiBaseUrl={API_BASE_URL}
            onClose={() => setIsModalOpen(false)}
            onUserAdded={handleUserAdded}
          />
        </>
      )}
    </main>
  );
}

export default App;