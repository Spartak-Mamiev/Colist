import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ListPage.module.css';
import Button from '../ui/button/Button';
import Header from '../ui/header/Header';
import Avatar from '../ui/avatar/Avatar';
import Item from '../ui/item/Item';
import Input from '../ui/input/Input';
import useListItems from '../../hooks/useListItems';
import useListMembers from '../../hooks/useListMembers';
import { useLists } from '../../context/ListsContext';

import { HiOutlineUserAdd } from 'react-icons/hi';

export default function ListPage() {
  // Get the listId from the URL (e.g. /list/abc-123)
  const { listId } = useParams();
  const navigate = useNavigate();

  // Get items and CRUD functions from the real-time hook
  const { items, loading, addItem, toggleItem, deleteItem } =
    useListItems(listId);

  // Get members for this list to display collaborator avatars
  const { members } = useListMembers(listId);

  // Get lists from context to display the list name in the header
  const { lists } = useLists();
  const currentList = lists.find((l) => l.id === listId);

  const [newItemName, setNewItemName] = useState(''); // Input for adding a new item
  const [error, setError] = useState(null); // Error message for CRUD failures

  // Split items into active and completed for separate sections
  const activeItems = items.filter((item) => !item.is_completed);
  const completedItems = items.filter((item) => item.is_completed);

  // Handle adding a new item
  async function handleAddItem() {
    if (!newItemName.trim()) return;
    setError(null);
    const { error: addError } = await addItem(newItemName.trim());
    if (addError) {
      setError(addError.message);
      return;
    }
    setNewItemName('');
  }

  return (
    <>
      <div className={styles.header}>
        {/* Show the list name from the database, fallback to "List" */}
        <Header>{currentList?.name || 'List'}</Header>

        <div className={styles.collaboratorsBar}>
          <div className={styles.collaboratorsList}>
            {members.map((member) => (
              <Avatar
                key={member.id}
                variant="collaborator"
              >
                {member.profiles?.name?.charAt(0).toUpperCase() || '?'}
              </Avatar>
            ))}
          </div>
          <Button
            variant="transparent"
            onClick={() => navigate(`/members/${listId}`)}
          >
            <HiOutlineUserAdd />
            Invite
          </Button>
        </div>
      </div>
      <main className={styles.groceryList}>
        {/* Loading state */}
        {loading && <p>Loading items...</p>}

        {/* Display error if a CRUD operation fails */}
        {error && <p className={styles.error}>{error}</p>}

        {/* Active items section */}
        {!loading && (
          <section
            aria-label="Active items"
            className={styles.activeSection}
          >
            {activeItems.length === 0 && <p>No items yet. Add one below!</p>}
            <ul className={styles.activeItems}>
              {activeItems.map((item) => (
                <Item
                  key={item.id}
                  name={item.name}
                  addedBy={`Added by ${item.profiles?.name || 'unknown'}`}
                  isCompleted={item.is_completed}
                  onToggle={() => toggleItem(item.id, item.is_completed)}
                  onDelete={() => deleteItem(item.id)}
                />
              ))}
            </ul>
          </section>
        )}

        {/* Completed items section — only show if there are completed items */}
        {!loading && completedItems.length > 0 && (
          <section
            aria-label="Completed items"
            className={styles.completedSection}
          >
            <p className={styles.sectionTitle}>Completed</p>
            <ul className={styles.completedItems}>
              {completedItems.map((item) => (
                <Item
                  key={item.id}
                  name={item.name}
                  addedBy={`Added by ${item.profiles?.name || 'unknown'}`}
                  isCompleted={item.is_completed}
                  onToggle={() => toggleItem(item.id, item.is_completed)}
                  onDelete={() => deleteItem(item.id)}
                />
              ))}
            </ul>
          </section>
        )}

        {/* Add item input at the bottom */}
        <div className={styles.addItemBar}>
          <Input
            type="text"
            placeholder="Add an item..."
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
          />
          <Button onClick={handleAddItem}>+</Button>
        </div>
      </main>
    </>
  );
}
