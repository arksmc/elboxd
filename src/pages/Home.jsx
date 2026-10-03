import { useEffect, useState } from 'react';
import { getEateries } from '../lib/api';
import EateryCard from '../components/EateryCard';
import SearchBar from '../components/SearchBar';
import Meta from '../components/Meta';
import useUser from "../lib/useUser";
import { signOut } from "../lib/api";

const { user } = useUser();

{user && <button onClick={signOut}>Sign out</button>}

export default function Home() {
  const [eateries, setEateries] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    getEateries().then(setEateries);
  }, []);

  const filtered = eateries.filter((e) => 
    `${e.name} ${e.branch} ${e.area} ${e.category}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <main>
      <Meta />
      <h1>Elboxd</h1>
      <SearchBar value={query} onChange={setQuery} />
      {filtered.map((e) => (
        <EateryCard key={e.id} eatery={e} />
      ))}
    </main>
  );
}
