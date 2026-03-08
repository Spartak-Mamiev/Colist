import { useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';

// Custom hook for managing list members with real-time sync
export default function useListMembers(listId) {
  const [members, setMembers] = useState([]); // Array of members with profile info
  const [loading, setLoading] = useState(true); // True while fetching members

  useEffect(() => {
    if (!listId) return;

    // Merge real-time INSERT/UPDATE/DELETE events into local state
    function handleRealtimeChange(payload) {
      const { eventType, old: oldRecord } = payload;

      if (eventType === 'INSERT') {
        // Refetch to get the joined profile data (real-time payload doesn't include joins)
        fetchMembers();
      } else if (eventType === 'DELETE') {
        // Remove the member from local state
        setMembers((prev) => prev.filter((m) => m.id !== oldRecord.id));
      }
    }

    // Fetch all members of this list, joined with their profile info
    async function fetchMembers() {
      const { data, error } = await supabase
        .from('list_members')
        .select('*, profiles(name, email)')
        .eq('list_id', listId);

      if (error) {
        console.error('Error fetching members:', error.message);
      } else {
        setMembers(data);
      }

      setLoading(false);
    }

    fetchMembers();

    // Subscribe to real-time changes on list_members for this list
    const channel = supabase
      .channel(`members:${listId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'list_members',
          filter: `list_id=eq.${listId}`,
        },
        (payload) => {
          handleRealtimeChange(payload);
        },
      )
      .subscribe();

    // Cleanup: unsubscribe when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, [listId]);

  // Invite a member by email — looks up the user in profiles first
  async function inviteMember(email) {
    // 1. Look up the user by email in the profiles table
    const { data: profile, error: lookupError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (lookupError || !profile) {
      // User not found — they need to sign up first
      return {
        error: { message: 'User not found — they need to sign up first' },
      };
    }

    // 2. Check if the user is already a member of this list
    const alreadyMember = members.some((m) => m.user_id === profile.id);
    if (alreadyMember) {
      return {
        error: { message: 'This user is already a member of this list' },
      };
    }

    // 3. Insert into list_members with role 'member'
    const { error: insertError } = await supabase
      .from('list_members')
      .insert({ list_id: listId, user_id: profile.id, role: 'member' });

    if (insertError) {
      console.error('Error inviting member:', insertError.message);
      return { error: insertError };
    }

    return { error: null };
  }

  // Remove a member from the list
  async function removeMember(userId) {
    const { error } = await supabase
      .from('list_members')
      .delete()
      .eq('list_id', listId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error removing member:', error.message);
      return { error };
    }

    return { error: null };
  }

  return { members, loading, inviteMember, removeMember };
}
