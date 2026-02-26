import { Link } from 'react-router-dom';
import styles from './ListPage.module.css';

export default function ListPage() {
  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerTopPart}>
          <Link
            to="/"
            className={styles.backBtn}
          >
            Back
          </Link>
          <h1 className={styles.listTitle}>List Name</h1>
          <Link
            to="/settings"
            className={styles.settingsBtn}
          >
            Settings
          </Link>
        </div>
        <div className={styles.collaboratorsBar}>
          <ul
            aria-label="Collaborators"
            className={styles.collaboratorsList}
          >
            <li className={styles.collaborator}>John</li>
            <li className={styles.collaborator}>Jane</li>
          </ul>
          <button
            className={styles.inviteBtn}
            aria-label="Invite collaborator"
          >
            +
          </button>
        </div>
      </header>
      <main className={styles.groceryList}>
        <section
          aria-label="Active items"
          className={styles.activeSection}
        >
          <h2 className={styles.sectionTitle}>Active</h2>
          <ul className={styles.activeItems}>
            <li className={styles.groceryItem}>
              <label className={styles.itemLabel}>
                <input
                  type="checkbox"
                  className={styles.itemCheckbox}
                />
                <span className={styles.itemName}>Milk</span>
              </label>
              <small className={styles.itemMeta}>Added by You</small>
            </li>
            <li className={styles.groceryItem}>
              <label className={styles.itemLabel}>
                <input
                  type="checkbox"
                  className={styles.itemCheckbox}
                />
                <span className={styles.itemName}>Milk</span>
              </label>
              <small className={styles.itemMeta}>Added by You</small>
            </li>
          </ul>
        </section>
        <section
          aria-label="Completed items"
          className={styles.completedSection}
        >
          <h2 className={styles.sectionTitle}>Completed</h2>
          <ul className={styles.completedItems}>
            <li className={styles.groceryItem}>
              <label className={styles.itemLabel}>
                <input
                  type="checkbox"
                  defaultChecked
                  className={styles.itemCheckbox}
                />
                <span className={styles.itemName}>Milk</span>
              </label>
              <small className={styles.itemMeta}>Added by You</small>
            </li>
            <li className={styles.groceryItem}>
              <label className={styles.itemLabel}>
                <input
                  type="checkbox"
                  defaultChecked
                  className={styles.itemCheckbox}
                />
                <span className={styles.itemName}>Milk</span>
              </label>
              <small className={styles.itemMeta}>Added by You</small>
            </li>
          </ul>
        </section>
      </main>
    </>
  );
}
