import "./App.css";
import React, { useEffect, useState } from "react";

const App = () => {
  const [todoList, setTodoList] = useState([]);
  const [activeItem, setActiveItem] = useState({
    id: null,
    title: "",
    completed: false,
  });
  const [editing, setEditing] = useState(false);

  const fetchTasks = () => {
    fetch("http://127.0.0.1:8000/api/task-list/")
      .then((response) => response.json())
      .then((data) => setTodoList(data));
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const handleChange = (e) => {
    let value = e.target.value;
    setActiveItem({ ...activeItem, title: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let url = "http://127.0.0.1:8000/api/task-create/";
    //updating todo
    if (editing) {
      url = `http://127.0.0.1:8000/api/task-update/${activeItem.id}`
      setEditing(false)
    }
    let csrftoken = getCookie("csrftoken");
    //adding todo
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(activeItem),
    })
      .then((response) => {
        fetchTasks();
        setActiveItem({
          id: null,
          title: "",
          completed: false,
        });
      })
      .catch(function (error) {
        console.log("ERROR:", error);
      })
      .then((document.getElementById("title").value = ""));
  };

  const startEdit = (todo) => {
    setActiveItem(todo);
    setEditing(true);
    document.getElementById("title").value = todo.title;
  };

  const deleteItem = (todo) => {
    const csrftoken = getCookie('csrftoken')
    const url = `http://127.0.0.1:8000/api/task-delete/${todo.id}`
    fetch (url, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      }
    }).then((response) => {
      fetchTasks()
    })
  }

  const setCompleted = (todo) => {
    todo.completed = !todo.completed
    const csrftoken = getCookie('csrftoken')
    const url = `http://127.0.0.1:8000/api/task-update/${todo.id}`
    fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(todo),
    }).then((response) => {
      fetchTasks()
    })
  }

  return (
    <div className="container">
      <div id="task-container">
        <div id="form-wrapper">
          <form id="form" onSubmit={handleSubmit}>
            <div className="flex-wrapper">
              <br />
              <div style={{ flex: 6 }}>
                <input
                  onChange={handleChange}
                  type="text"
                  placeholder="Add task..."
                  className="form-control"
                  id="title"
                  name="title"
                />
              </div>
              <br />
              <div style={{ flex: 1 }}>
                <input
                  type="submit"
                  className="btn btn-primary"
                  id="submit"
                  value="Add"
                />
              </div>
            </div>
          </form>
        </div>
        <div id="list-wrapper">
          {todoList.map((todo, index) => {
            return (
              <div key={index} className="task-wrapper flex-wrapper">
                <div onClick={() => setCompleted(todo)} style={{ flex: 7 }}>
                  {todo.completed == false ? (
                    <span>{todo.title}</span>
                  ): (
                    <s>{todo.title}</s>
                  )} 
                </div>
                <div style={{ flex: 1 }}>
                  <button
                    onClick={() => startEdit(todo)}
                    className="btn btn-sm btn-outline-info"
                  >
                    Edit
                  </button>
                </div>
                <div style={{ flex: 1 }}>
                  <button onClick={() => deleteItem(todo)} className="btn btn-sm btn-outline-dark delete">
                    -
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
