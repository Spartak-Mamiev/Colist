import { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';
import { useAuth } from './AuthContext';

const ListsContext = createContext();

export function ListsProvider({ children }) {
  const { user } = useAuth();
  const [lists, setLists] = useState([]); // Array of the user's grocery lists
  const [loading, setLoading] = useState(true); // True while fetching lists

  // Fetch all lists the current user is a member of
  useEffect(() => {
    if (!user) return;

    async function fetchLists() {
      // Join through list_members to get the lists this user belongs to
      // The select('list_id, lists(*)') syntax does a join via the foreign key
      const { data, error } = await supabase
        .from('list_members')
        .select('list_id, lists(*)')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching lists:', error.message);
      } else {
        // Extract the nested lists object from each row
        setLists(data.map((row) => row.lists));
      }

      setLoading(false);
    }

    fetchLists();
  }, [user]);

  // Create a new list and add the current user as owner
  async function createList(name) {
    // 1. Insert the new list
    const { data: newList, error: listError } = await supabase
      .from('lists')
      .insert({ name, created_by: user.id })
      .select()
      .single();

    if (listError) {
      console.error('Error creating list:', listError.message);
      return { error: listError };
    }

    // 2. Add the creator as an owner in list_members
    const { error: memberError } = await supabase
      .from('list_members')
      .insert({ list_id: newList.id, user_id: user.id, role: 'owner' });

    if (memberError) {
      console.error('Error adding owner:', memberError.message);
      return { error: memberError };
    }

    // 3. Update local state so the UI reflects the new list immediately
    setLists((prev) => [...prev, newList]);
    return { data: newList };
  }

  // Delete a list — CASCADE will remove its members and items in the database
  async function deleteList(id) {
    const { error } = await supabase.from('lists').delete().eq('id', id);

    if (error) {
      console.error('Error deleting list:', error.message);
      return { error };
    }

    // Remove from local state
    setLists((prev) => prev.filter((list) => list.id !== id));
    return { error: null };
  }

  return (
    <ListsContext.Provider value={{ lists, loading, createList, deleteList }}>
      {children}
    </ListsContext.Provider>
  );
}

// Custom hook to access lists context from any component
export function useLists() {
  return useContext(ListsContext);
}
