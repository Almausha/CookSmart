import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

function App() {
  return (
    // ভবিষ্যতে এখানে AuthProvider বা ThemeProvider যোগ করা যাবে
    <RouterProvider router={router} />
  );
}

export default App;