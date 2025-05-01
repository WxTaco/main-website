import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Terms from './pages/Terms';
import ReactionRoles from './pages/ReactionRoles';
import Welcomer from './pages/Welcomer';
import Tickets from './pages/Tickets';
import Gemini from './pages/Gemini';
import Dictionary from './pages/Dictionary';
import Moderation from './pages/Moderation';
import RoleCommands from './pages/RoleCommands';
import ServerCommands from './pages/ServerCommands';
import ChannelCommands from './pages/ChannelCommands';
import UserCommands from './pages/UserCommands';
import ImageGen from './pages/ImageGen';
import Utility from './pages/Utility';
import ModerationOverview from './pages/ModerationOverview';
import RolesOverview from './pages/RolesOverview';
import ServerOverview from './pages/ServerOverview';
import ChannelsOverview from './pages/ChannelsOverview';
import UsersOverview from './pages/UsersOverview';
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'terms',
        element: <Terms />,
      },
      {
        path: 'utility',
        element: <Utility />,
      },
      {
        path: 'moderation',
        element: <ModerationOverview />,
      },
      {
        path: 'roles',
        element: <RolesOverview />,
      },
      {
        path: 'server',
        element: <ServerOverview />,
      },
      {
        path: 'channels',
        element: <ChannelsOverview />,
      },
      {
        path: 'users',
        element: <UsersOverview />,
      },
      {
        path: 'utility/tickets',
        element: <Tickets />,
      },
      {
        path: 'utility/reaction-roles',
        element: <ReactionRoles />,
      },
      {
        path: 'utility/welcomer',
        element: <Welcomer />,
      },
      {
        path: 'utility/gemini',
        element: <Gemini />,
      },
      {
        path: 'utility/dictionary',
        element: <Dictionary />,
      },
      {
        path: 'utility/image-gen',
        element: <ImageGen />,
      },
      {
        path: 'moderation/tools',
        element: <Moderation />,
      },
      {
        path: 'roles/commands',
        element: <RoleCommands />,
      },
      {
        path: 'server/commands',
        element: <ServerCommands />,
      },
      {
        path: 'channels/commands',
        element: <ChannelCommands />,
      },
      {
        path: 'users/commands',
        element: <UserCommands />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App; 