import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Privacy from './pages/Privacy';
import Layout from './components/Layout';
import Home from './pages/Home';
import Terms from './pages/Terms';
import CookiePolicy from './pages/CookiePolicy';
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
import Partnerships from './pages/Partnerships';
import Settings from './pages/Settings';
import NewSettings from './pages/NewSettings';
import NotFound from './pages/NotFound';
import Tools from './pages/Tools';
import JSONDebugger from './pages/JSONDebugger';
import ColorPaletteGenerator from './pages/ColorPaletteGenerator';
import DiscordEmbedBuilder from './pages/DiscordEmbedBuilder';
import TextCaseConverter from './pages/TextCaseConverter';
import CSSGenerator from './pages/CSSGenerator';
import MarkdownEditor from './pages/MarkdownEditor';
import ImageOptimizer from './pages/ImageOptimizer';
import APITester from './pages/APITester';

// Import accessibility styles
import './styles/accessibility.css';

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
        path: '/about',
        element: <About />,
      },
      {
        path: '/privacy',
        element: <Privacy />,
      },
      {
        path: '/partnerships',
        element: <Partnerships />,
      },
      {
        path: '/terms',
        element: <Terms />,
      },
      {
        path: '/cookie-policy',
        element: <CookiePolicy />,
      },
      {
        path: '/utility',
        element: <Utility />,
      },
      {
        path: '/moderation',
        element: <ModerationOverview />,
      },
      {
        path: '/roles',
        element: <RolesOverview />,
      },
      {
        path: '/server',
        element: <ServerOverview />,
      },
      {
        path: '/channels',
        element: <ChannelsOverview />,
      },
      {
        path: '/users',
        element: <UsersOverview />,
      },
      {
        path: '/fun',
        element: <FunOverview />,
      },
      {
        path: '/tickets',
        element: <TicketsOverview />,
      },
      {
        path: '/utility/tickets',
        element: <Tickets />,
      },
      {
        path: '/utility/reaction-roles',
        element: <ReactionRoles />,
      },
      {
        path: '/utility/welcomer',
        element: <Welcomer />,
      },
      {
        path: '/utility/gemini',
        element: <Gemini />,
      },
      {
        path: '/utility/dictionary',
        element: <Dictionary />,
      },
      {
        path: '/utility/image-gen',
        element: <ImageGen />,
      },
      {
        path: '/moderation/tools',
        element: <Moderation />,
      },
      {
        path: '/roles/commands',
        element: <RoleCommands />,
      },
      {
        path: '/server/commands',
        element: <ServerCommands />,
      },
      {
        path: '/channels/commands',
        element: <ChannelCommands />,
      },
      {
        path: '/users/commands',
        element: <UserCommands />,
      },
      {
        path: '/fun/commands',
        element: <FunCommands />,
      },
      {
        path: '/settings',
        element: <NewSettings />,
      },
      {
        path: '/old-settings',
        element: <Settings />,
      },
      {
        path: '/tools',
        element: <Tools />,
      },
      {
        path: '/tools/json-debugger',
        element: <JSONDebugger />,
      },
      {
        path: '/tools/color-palette-generator',
        element: <ColorPaletteGenerator />,
      },
      {
        path: '/tools/discord-embed-builder',
        element: <DiscordEmbedBuilder />,
      },
      {
        path: '/tools/text-case-converter',
        element: <TextCaseConverter />,
      },
      {
        path: '/tools/css-generator',
        element: <CSSGenerator />,
      },
      {
        path: '/tools/markdown-editor',
        element: <MarkdownEditor />,
      },
      {
        path: '/tools/image-optimizer',
        element: <ImageOptimizer />,
      },
      {
        path: '/tools/api-tester',
        element: <APITester />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      {/* SVG filters for color blindness simulation */}
      <svg id="accessibility-filters" aria-hidden="true">
        <defs>
          {/* Protanopia (red-blind) filter */}
          <filter id="protanopia-filter">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.567, 0.433, 0,     0, 0
                      0.558, 0.442, 0,     0, 0
                      0,     0.242, 0.758, 0, 0
                      0,     0,     0,     1, 0"
            />
          </filter>

          {/* Deuteranopia (green-blind) filter */}
          <filter id="deuteranopia-filter">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.625, 0.375, 0,   0, 0
                      0.7,   0.3,   0,   0, 0
                      0,     0.3,   0.7, 0, 0
                      0,     0,     0,   1, 0"
            />
          </filter>

          {/* Tritanopia (blue-blind) filter */}
          <filter id="tritanopia-filter">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0.95, 0.05,  0,     0, 0
                      0,    0.433, 0.567, 0, 0
                      0,    0.475, 0.525, 0, 0
                      0,    0,     0,     1, 0"
            />
          </filter>
        </defs>
      </svg>

      <RouterProvider router={router} />
    </>
  );
}

export default App;
