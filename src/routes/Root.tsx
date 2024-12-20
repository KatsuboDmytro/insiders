import { Route, Routes } from 'react-router-dom';
import { AllTodos, ListOfTodos, Login, Main, NotFound, Signup } from '../pages';
import App from '../App';


export const Root = () => {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Main />} />
        <Route path="login" element={<Login />} />
        <Route path="list" element={<ListOfTodos />} />
        <Route path="list/:todoListId" element={<AllTodos />} />
        <Route path="signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
