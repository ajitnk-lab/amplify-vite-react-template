import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { Authenticator, Button, View, Heading } from "@aws-amplify/ui-react";

//import amplify style
import "@aws-amplify/ui-react/styles.css";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: ({ items }: { items: Schema["Todo"]["type"][] }) => setTodos([...items]),
    });

    return () => subscription.unsubscribe();
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }

  async function deleteTodo(id: string) {
    try {
      console.log('Attempting to delete todo with id:', id);
      const deleted = await client.models.Todo.delete({ id: id });
      console.log('Delete response:', deleted);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <main>
          <View padding="1rem">
            <Heading level={1}>Welcome, {user?.username}!</Heading>
            <Button onClick={signOut} variation="primary">
              Sign Out
            </Button>
          </View>

          <h1>My todos</h1>
          <button onClick={createTodo}>+ new</button>
          <ul>
            {todos.map((todo) => (
              <li key={todo.id}>
                {todo.content}
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </li>
            ))}
          </ul>
          <div>
            🥳 App successfully hosted. Try creating a new todo.
          </div>
        </main>
      )}
    </Authenticator>
  );
}

export default App;
