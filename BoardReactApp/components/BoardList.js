// React component

import { useState, useEffect } from 'react';

const BoardList = () => {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch('http://localhost:3000/board');

        const data = await response.json();
        setBoards(data);
      } catch (err) {
        console.error('Error fetching boards:', err);
      }
    };

    fetchBoards();
  }, []);

  return (
    <div>
      <h2>Board List</h2>
      <ul>
        {boards.map(board => (
          <li key={board._id}>
            <h3>{board.title}</h3>
            <p>{board.content}</p>
            <p>Author: {board.author}</p>
            <p>Created At: {new Date(board.createdAt).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoardList;
