import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './Members.module.css';
import Button from '../ui/button/Button';
import Member from '../ui/member/Member';
import Modal from '../ui/modal/Modal';
import { FaArrowLeft } from 'react-icons/fa';
import { LuSend } from 'react-icons/lu';
import useListMembers from '../../hooks/useListMembers';
import { useAuth } from '../../context/AuthContext';

export default function Members() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteError, setInviteError] = useState(null); // Error message for invite failures
  const navigate = useNavigate();

  // Get listId from URL params (e.g. /members/abc-123)
  const { listId } = useParams();
  const { user } = useAuth();

  // Get members and CRUD functions from the real-time hook
  const { members, loading, inviteMember, removeMember } =
    useListMembers(listId);

  // Handle invite form submission from the modal
  async function handleInvite(email) {
    setInviteError(null);
    const { error } = await inviteMember(email);
    if (error) {
      setInviteError(error.message);
      return;
    }
    // Close modal on success
    setIsModalOpen(false);
  }

  return (
    <div className={styles.membersPage}>
      <header className={styles.pageHeader}>
        <div className={styles.headerTopRow}>
          <Button
            variant="transparent"
            aria-label="Go back"
            onClick={() => navigate(`/list/${listId}`)}
          >
            <FaArrowLeft />
          </Button>
          <h1>Members</h1>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <LuSend stroke="white" />
          Invite Member
        </Button>
      </header>
      <main className={styles.mainContent}>
        {/* Invite modal — passes the email to handleInvite on submit */}
        {isModalOpen && (
          <Modal
            listName="Invite Member"
            cta="Send an invitation to collaborate on this list"
            variant="enabled"
            type="email"
            placeholder="Enter Users Email"
            error={inviteError}
            mainBtnName={
              <>
                <LuSend stroke="white" />
                Send Invite
              </>
            }
            onClose={() => {
              setIsModalOpen(false);
              setInviteError(null);
            }}
            onSubmit={handleInvite}
          />
        )}

        {/* Loading state */}
        {loading && <p>Loading members...</p>}

        {/* Render each member with their profile data */}
        {!loading &&
          members.map((member) => (
            <Member
              key={member.id}
              name={member.profiles?.name || 'Unknown'}
              email={member.profiles?.email || ''}
              isOwner={member.role === 'owner'}
              isCurrentUser={member.user_id === user?.id}
              onRemove={() => removeMember(member.user_id)}
            />
          ))}

        {/* Empty state */}
        {!loading && members.length === 0 && <p>No members found.</p>}
      </main>
    </div>
  );
}
