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
import FunOverview from './pages/FunOverview';
import FunCommands from './pages/FunCommands';
import TicketsOverview from './pages/TicketsOverview';
import About from './pages/About';
import NotFound from './pages/NotFound';
import BotBuilder from './pages/BotBuilder';
import BotBuilderEditor from './pages/BotBuilderEditor';
import BotBuilderImport from './pages/BotBuilderImport';

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
        path: 'about',
        element: <About />,
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
        path: 'fun',
        element: <FunOverview />,
      },
      {
        path: 'tickets',
        element: <TicketsOverview />,
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
        path: 'fun/commands',
        element: <FunCommands />,
      },
      {
        path: 'bot-builder',
        element: <BotBuilder />,
      },
      {
        path: 'bot-builder/editor',
        element: <BotBuilderEditor />,
      },
      {
        path: 'bot-builder/import',
        element: <BotBuilderImport />,
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