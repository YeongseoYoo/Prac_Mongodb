import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from "./Login";

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [comments, setComments] = useState([]);
  const [display, setDisplay] = useState("none");
  const [display2, setDisplay2] = useState("");
  const [input, setInput] = useState({
    title: '',
    content: '',
    author: '',
  });

  const onChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };
  const fetchBoards = async () => {
    try {
      const response = await axios.get("http://localhost:3333/board", { withCredentials: true });
      const data = response.data;
      console.log(data);
      setBoards(data);
    } catch (err) {
      console.error('Error fetching boards:', err);
    }
  };
  

  const fetchComments = async () => {
    try {
      const response = await axios.get('http://localhost:3333/comments', { withCredentials: true });
      const data = response.data;
      setComments(data);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };


  useEffect(() => {
    fetchBoards();
    fetchComments();
  }, []);

  const addComment = async (boardId, title, content, author) => {
    try {
      const response = await fetch(`http://localhost:3333/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: boardId,
          title: title,
          content: content,
          author: author,
          createdAt: Date.now()
        }),
      });
      const data = await response.json();
      setComments(prevComments => [...prevComments, data]);
      setInput({
        title: '',
        content: '',
        author: ''
      });
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const deleteComment = async(commentId) => {
    try {
      const response = await fetch(`http://localhost:3333/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
      } else {
        console.error('Failed to delete comment');
      }
    } catch(error) {
      console.error('Error deleting comment:', error);
    }
  };


  const login = async (id, pw, next) => {
    await axios.post("http://localhost:3333/users/login",
      { email: id, password: pw }, { withCredentials: true } ) // 이 옵션을 통해 쿠키를 요청에 포함)
    .then((response) => {
      fetchBoards();
        setDisplay("");
        setDisplay2("none");
    })
    .catch((err) => {
        console.log("login fail");
        next(err);
    });
  };
  
  return (
    <div>
      <div style={{display: display2}}>
        <Login login={login} />
      </div>
      <div style={{display: display}}>
        <h2>Board List</h2>
        <ul>
          {boards.map(board => (
            <li key={board._id}>
              <h3>{board.title}</h3>
              <p>{board.content}</p>
              <p>Author: {board.author}</p>
              <p>Created At: {new Date(board.createdAt).toLocaleString()}</p>
              {/* Input fields for adding a comment */}
              <input
                type="text"
                name="title"
                placeholder="Comment Title"
                value={input.title}
                onChange={onChange}
              />
              <input
                type="text"
                name="content"
                placeholder="Comment Content"
                value={input.content}
                onChange={onChange}
              />
              <input
                type="text"
                name="author"
                placeholder="Your Name"
                value={input.author}
                onChange={onChange}
              />
              <button onClick={() => addComment(board._id, input.title, input.content, input.author)}>Add Comment</button>

              {/* Display comments for this board */}
              <ul>
                {comments.filter(comment => comment.boardId === board._id).map(comment => (
                  <li key={comment._id}>
                    <h3>{comment.author}</h3>
                    <p>{comment.content}</p>
                    <button onClick={() => deleteComment(comment._id)}>delete</button>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BoardList;
