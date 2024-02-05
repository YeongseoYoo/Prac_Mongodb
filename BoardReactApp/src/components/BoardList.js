import { useState, useEffect } from 'react';

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [comments, setComments] = useState([]);
  const [input, setInput] = useState({
    title: '',
    content: '',
    author: ''
  });

  const onChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const response = await fetch('http://localhost:3333/board');
        const data = await response.json();
        setBoards(data);
      } catch (err) {
        console.error('Error fetching boards:', err);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch('http://localhost:3333/comments');
        const data = await response.json();
        setComments(data);
      } catch (err) {
        console.error('Error fetching comments:', err);
      }
    };

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
      // Update the state with the new comment
      setComments(prevComments => [...prevComments, data]);
      // Clear the input fields
      setInput({
        title: '',
        content: '',
        author: ''
      });
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };
  const deleteComment = async(commentId) =>{
    try{
      const response = await fetch(`http://localhost:3333/comments/${commentId}`,{
        method: 'DELETE',
      });
      if(response.ok){
        setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
      } else {
        console.error('Failed to delete comment');
      }
    } catch(error) {
      console.error('Error deleting comment:', error);
      // 오류 처리를 수행합니다.
    }
  };
  
  
  return (
    <div>
      <h2>Board List</h2>
      <ul>
        {boards.map((board, index) => (
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
              {comments.filter(comment => comment.id === board._id).map(comment => (
                <li key={comment._id}>
                  <h3>{comment.author}</h3>
                  <p3>{comment.content}</p3>
                  <button onClick={() => deleteComment(comments._id)}>delete</button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BoardList;
