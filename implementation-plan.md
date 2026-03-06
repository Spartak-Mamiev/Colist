cat > /Users/spartaksmacmini/Documents/Colist/implementation-plan.md << 'PLAN_EOF'

# Plan: Full Supabase Integration for CoList

**TL;DR** — Wire up the entire CoList app to Supabase in 8 steps: install the SDK, configure the client, set up database tables with Row Level Security (RLS), implement auth (login/signup/session), build React Context for global state, implement CRUD for lists/items/members, add real-time subscriptions, and protect routes. All data is currently hardcoded — every component will be refactored to fetch/mutate real data.

---

## Step 1 — Install Supabase & set up the client

- Run `npm install @supabase/supabase-js` in the `colist-app/` directory
- Create a new file `src/lib/supabaseClient.js` that exports a configured Supabase client:
  - Import `createClient` from `@supabase/supabase-js`
  - Use your Supabase project URL and anon key (store them in a `.env` file as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — Vite exposes `import.meta.env.VITE_*` variables)
  - Add `.env` to `.gitignore`
  - _Supabase 101:_ The "anon key" is safe to expose in the browser — security comes from Row Level Security (RLS) policies on your tables, not from hiding this key

## Step 2 — Create the database schema (in Supabase Dashboard)

Go to your Supabase project → **SQL Editor** → run a migration script to create these tables:

- **`profiles`** — extends Supabase Auth's built-in `auth.users` table
  - `id` (UUID, PK, references `auth.users.id`), `name` (text), `email` (text), `avatar_url` (text, nullable), `created_at` (timestamptz)
  - _Supabase 101:_ Supabase Auth stores email/password in a hidden `auth.users` table; `profiles` is _your_ public table to store extra user info like display name

- **`lists`** — grocery lists
  - `id` (UUID, PK, default `gen_random_uuid()`), `name` (text), `created_by` (UUID, references `profiles.id`), `created_at` (timestamptz)

- **`list_members`** — join table for shared access
  - `id` (UUID, PK), `list_id` (UUID, references `lists.id` ON DELETE CASCADE), `user_id` (UUID, references `profiles.id`), `role` (text: `'owner'` or `'member'`), `joined_at` (timestamptz)
  - Unique constraint on `(list_id, user_id)`

- **`items`** — grocery items within a list
  - `id` (UUID, PK), `list_id` (UUID, references `lists.id` ON DELETE CASCADE), `name` (text), `is_completed` (boolean, default `false`), `added_by` (UUID, references `profiles.id`), `created_at` (timestamptz)

- A **trigger** on `auth.users` INSERT to auto-create a row in `profiles` (standard Supabase pattern — so signup automatically populates the profiles table)

- **Row Level Security (RLS)** policies on every table:
  - _Supabase 101:_ RLS means the database itself enforces permissions — even if someone has your anon key, they can only read/write rows the policies allow. You **must** enable RLS on every table, or data is publicly accessible.
  - `profiles`: users can read any profile, update only their own
  - `lists`: users can read/update/delete lists they're a member of (via `list_members`); insert if they're the creator
  - `list_members`: users can read members of lists they belong to; owners can insert/delete members
  - `items`: users can CRUD items in lists they belong to

- Enable **Realtime** on the `items`, `lists`, and `list_members` tables (Supabase Dashboard → Database → Replication → toggle the tables on)
  - _Supabase 101:_ Supabase Realtime uses PostgreSQL's built-in change notification system. You enable it per-table in the dashboard, then subscribe in your JS code

## Step 3 — Implement authentication

- Create `src/context/AuthContext.jsx`:
  - Provides `user`, `loading`, `signUp()`, `signIn()`, `signOut()`
  - On mount, call `supabase.auth.getSession()` to restore session from localStorage (Supabase does this automatically)
  - Subscribe to `supabase.auth.onAuthStateChange()` to keep `user` in sync across tabs
  - _Supabase 101:_ Supabase Auth stores the session token in localStorage automatically — you don't handle tokens manually. `onAuthStateChange` fires when the user logs in, logs out, or the token refreshes

- Refactor `src/components/login/LoginPage.jsx`:
  - Replace the `handleLogIn` function: call `supabase.auth.signInWithPassword({ email, password })` instead of just navigating
  - Add error state to display login failures (wrong password, etc.)
  - Add a loading state while the request is in flight
  - On success, navigate to `/`

- Refactor `src/components/signUpPage/SignUpPage.jsx`:
  - Call `supabase.auth.signUp({ email, password, options: { data: { name } } })` — the `name` goes into the user's metadata and also into `profiles` via the trigger
  - Add password confirmation validation (compare the two password fields)
  - Show error/success feedback

- Refactor `src/components/settings/Settings.jsx`:
  - The "Log Out" button should call `supabase.auth.signOut()` then navigate to `/login`
  - Profile form should load the user's `profiles` row and update it via `supabase.from('profiles').update()`

## Step 4 — Create a ProtectedRoute wrapper

- Create `src/components/ProtectedRoute.jsx`:
  - Reads the `user` and `loading` from `AuthContext`
  - If `loading`, show a spinner/skeleton
  - If no `user`, redirect to `/login`
  - Otherwise render children
- Wrap the `/`, `/list/:listId`, `/members/:listId`, and `/settings` routes in `src/App.jsx` with `<ProtectedRoute>`
- Update the `/list` route to `/list/:listId` (dynamic segment) so each list gets its own URL

## Step 5 — Build the Lists context & CRUD

- Create `src/context/ListsContext.jsx`:
  - Provides `lists`, `loading`, `createList()`, `deleteList()`
  - Fetches lists the current user is a member of:
    ```
    supabase.from('list_members').select('list_id, lists(*)').eq('user_id', user.id)
    ```
    _Supabase 101:_ The `select('list_id, lists(*)')` syntax does a **join** — it fetches related data from the `lists` table through the foreign key, all in one query. No REST endpoint setup needed.
  - `createList(name)` → inserts into `lists`, then inserts into `list_members` with `role: 'owner'`
  - `deleteList(id)` → deletes from `lists` (CASCADE removes members and items)

- Refactor `src/components/mainPage/MainPage.jsx`:
  - Remove hardcoded `<List>` components
  - Use `lists` from context, map over them to render `<List>` cards
  - Wire up the add-list input + button to call `createList()`
  - Wire up each list's delete button
  - Show loading/empty states

- Refactor `src/components/ui/list/List.jsx`:
  - Accept a `list` object prop (with `id`, `name`, `created_by`)
  - The link should navigate to `/list/${list.id}` instead of static `/list`

## Step 6 — Build Items CRUD + real-time

- Create `src/hooks/useListItems.js`:
  - Fetches items for the current list: `supabase.from('items').select('*, profiles(name)').eq('list_id', listId).order('created_at')`
  - `addItem(name)` → inserts into `items` with `list_id` and `added_by`
  - `toggleItem(id, currentState)` → updates `is_completed`
  - `deleteItem(id)` → deletes from `items`
  - **Real-time subscription**: subscribe to changes on the `items` table filtered by `list_id`:
    ```
    supabase.channel(`items:${listId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'items', filter: `list_id=eq.${listId}` }, handleChange)
      .subscribe()
    ```
    _Supabase 101:_ This creates a WebSocket connection. When _any user_ inserts, updates, or deletes an item in this list, your `handleChange` callback fires automatically. You update local state there — no polling needed. Remember to **unsubscribe** on cleanup (return the cleanup function from `useEffect`).
  - The `handleChange` callback should merge INSERT/UPDATE/DELETE events into the local `items` state

- Refactor `src/components/listPage/ListPage.jsx`:
  - Read `listId` from `useParams()`
  - Use the items hook to get items, split into active (`is_completed === false`) and completed
  - Wire up the add-item input to `addItem()`
  - Wire up the checkbox on `<Item>` to `toggleItem()`
  - Wire up the delete button on `<Item>` to `deleteItem()`
  - Replace hardcoded collaborator avatars with real member data

- Refactor `src/components/ui/item/Item.jsx`:
  - Accept `onToggle` and `onDelete` callback props
  - Wire the checkbox and delete button to those callbacks

## Step 7 — Members management + invitations

- Create `src/hooks/useListMembers.js`:
  - Fetch members: `supabase.from('list_members').select('*, profiles(name, email)').eq('list_id', listId)`
  - `inviteMember(email)` → look up the email in `profiles`, if found insert into `list_members`. If not found, show an error ("User not found — they need to sign up first"). A more advanced flow (email invitations) can come later.
  - `removeMember(userId)` → delete from `list_members`
  - Subscribe to real-time changes on `list_members` filtered by `list_id`

- Refactor `src/components/members/Members.jsx`:
  - Accept `listId` from route params (update route to `/members/:listId`)
  - Replace hardcoded member with real data from the hook
  - Wire the invite modal's submit to `inviteMember()`
  - Wire the remove button on `<Member>` to `removeMember()`

## Step 8 — Polish & edge cases

- **Error handling**: Create a reusable error toast/banner component. Wrap all Supabase calls in try/catch or check the `{ error }` return value.
  - _Supabase 101:_ Supabase client methods return `{ data, error }` — they don't throw. Always check `if (error)` after every call.
- **Loading states**: Add skeleton/spinner UI while data fetches
- **Empty states**: Show helpful messages when a user has no lists, a list has no items, etc.
- **Optimistic updates**: For toggling items, update local state immediately and revert if the server call fails (makes the app feel snappy)
- **Form validation**: Validate email format, password length (Supabase requires minimum 6 chars by default), empty list/item names
- Wrap the app in context providers in `src/main.jsx`: `<AuthProvider>` → `<ListsProvider>` → `<App />`

---

## New file structure after implementation
