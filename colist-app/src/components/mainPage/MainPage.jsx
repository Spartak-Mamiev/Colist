import { useState } from 'react';
import styles from './MainPage.module.css';
import Button from '../ui/button/Button';
import Input from '../ui/input/Input';
import Header from '../ui/header/Header';
import List from '../ui/list/List';
import { useLists } from '../../context/ListsContext';

export default function MainPage() {
  const { lists, loading, createList, deleteList } = useLists();
  const [newListName, setNewListName] = useState(''); // Input value for new list name
  const [error, setError] = useState(null); // Error message for CRUD failures

  // Handle creating a new list from the input
  async function handleAddList() {
    if (!newListName.trim()) return; // Don't create empty lists
    setError(null);
    const { error: createError } = await createList(newListName.trim());
    if (createError) {
      setError(createError.message);
      return;
    }
    setNewListName(''); // Clear input after creating
  }

  // Handle delete — stop event propagation so the Link doesn't navigate
  async function handleDelete(e, listId) {
    e.preventDefault(); // Prevent the Link from navigating
    e.stopPropagation();
    setError(null);
    const { error: delError } = await deleteList(listId);
    if (delError) {
      setError(delError.message);
    }
  }

  return (
    <main className={styles.mainPage}>
      <Header showMenu={false}>Your Lists</Header>
      <section
        className={styles.listsSection}
        aria-label="Your lists"
      >
        {/* Show loading state while fetching lists */}
        {loading && <p>Loading your lists...</p>}

        {/* Display error if a CRUD operation fails */}
        {error && <p className={styles.error}>{error}</p>}

        {/* Show empty state when user has no lists */}
        {!loading && lists.length === 0 && (
          <p>No lists yet. Create one below!</p>
        )}

        {/* Render list cards from real data */}
        {!loading && lists.length > 0 && (
          <div className={styles.listGrid}>
            {lists.map((list) => (
              <List
                key={list.id}
                list={list}
                onDelete={(e) => handleDelete(e, list.id)}
              />
            ))}
          </div>
        )}
      </section>
      <div
        className={styles.footer}
        role="toolbar"
      >
        <Input
          type="text"
          placeholder="New list name..."
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddList()}
        />
        <Button
          aria-label="Add list"
          onClick={handleAddList}
        >
          +
        </Button>
      </div>
    </main>
  );
}
