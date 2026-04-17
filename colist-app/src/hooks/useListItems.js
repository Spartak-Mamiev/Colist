import { useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

// Custom hook for CRUD operations and real-time sync on items within a list
export default function useListItems(listId) {
  const { user } = useAuth();
  const [items, setItems] = useState([]); // All items in this list
  const [loading, setLoading] = useState(true); // True while fetching items

  useEffect(() => {
    if (!listId) return;

    // Merge real-time INSERT/UPDATE/DELETE events into local state
    function handleRealtimeChange(payload) {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      if (eventType === 'INSERT') {
        // Real-time payloads don't include joined data (profiles),
        // so we refetch the single item with the join to get "added by" name
        fetchSingleItem(newRecord.id);
      } else if (eventType === 'UPDATE') {
        // Replace the updated item in local state (preserve existing profile join)
        setItems((prev) =>
          prev.map((item) =>
            item.id === newRecord.id ? { ...item, ...newRecord } : item,
          ),
        );
      } else if (eventType === 'DELETE') {
        // Remove the deleted item from local state
        setItems((prev) => prev.filter((item) => item.id !== oldRecord.id));
      }
    }

    // Fetch a single item with its profile join (used after real-time INSERT)
    async function fetchSingleItem(itemId) {
      const { data, error } = await supabase
        .from('items')
        .select('*, profiles(name)')
        .eq('id', itemId)
        .single();

      if (error) {
        console.error('Error fetching new item:', error.message);
        return;
      }

      // Add the item if it doesn't already exist, or update it if it does
      setItems((prev) => {
        if (prev.some((item) => item.id === data.id)) {
          return prev.map((item) => (item.id === data.id ? data : item));
        }
        return [...prev, data];
      });
    }

    // Fetch all items for this list, joined with the profile of who added them
    async function fetchItems() {
      const { data, error } = await supabase
        .from('items')
        .select('*, profiles(name)')
        .eq('list_id', listId)
        .order('created_at');

      if (error) {
        console.error('Error fetching items:', error.message);
      } else {
        setItems(data);
      }

      setLoading(false);
    }

    fetchItems();

    // Subscribe to real-time changes on items for this specific list.
    // When any user inserts, updates, or deletes an item, the callback fires
    // and we merge the change into local state — no polling needed.
    const channel = supabase
      .channel(`items:${listId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'items',
          filter: `list_id=eq.${listId}`,
        },
        (payload) => {
          handleRealtimeChange(payload);
        },
      )
      .subscribe();

    // Cleanup: unsubscribe from the channel when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [listId]);

  // Add a new item to this list
  async function addItem(name) {
    const { data, error } = await supabase
      .from('items')
      .insert({ list_id: listId, name, added_by: user.id })
      .select()
      .single();

    if (error) {
      console.error('Error adding item:', error.message);
      return { error };
    }

    return { data };
  }

  // Toggle an item's completed state — uses optimistic update for snappy UI.
  // Updates local state immediately, then sends the change to Supabase.
  // If the server call fails, reverts the local state.
  async function toggleItem(id, currentState) {
    // Optimistic update: flip the state in the UI right away
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_completed: !currentState } : item,
      ),
    );

    const { error } = await supabase
      .from('items')
      .update({ is_completed: !currentState })
      .eq('id', id);

    if (error) {
      console.error('Error toggling item:', error.message);
      // Revert: flip back to the original state since the server call failed
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_completed: currentState } : item,
        ),
      );
      return { error };
    }

    return { error: null };
  }

  // Delete an item
  async function deleteItem(id) {
    const { error } = await supabase.from('items').delete().eq('id', id);

    if (error) {
      console.error('Error deleting item:', error.message);
      return { error };
    }

    return { error: null };
  }

  // Update an item (e.g. rename). Uses optimistic UI update and reverts on error.
  async function updateItem(id, updates) {
    // Capture the previous state so we can revert on failure
    let previous;
    setItems((prev) => {
      previous = prev.find((item) => item.id === id);
      return prev.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      );
    });

    const { error } = await supabase.from('items').update(updates).eq('id', id);

    if (error) {
      console.error('Error updating item:', error.message);
      // Revert to previous state
      setItems((prev) =>
        prev.map((item) => (item.id === id ? previous : item)),
      );
      return { error };
    }

    return { error: null };
  }

  return { items, loading, addItem, toggleItem, deleteItem, updateItem };
}
