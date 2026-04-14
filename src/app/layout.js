import './globals.css';
import '../styles/fonts.css';
// import GlobalLoader from '@/components/GlobalLoader';
// import ClientLayout from '@/components/ClientLayout';
import RouteLoader from '@/components/RouteLoader';

export const metadata = {
    title: "Magic Stamp",
    description: "Developed by AntiGRVTY",
  };

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <RouteLoader />
        {children}
      </body>
    </html>
  );
}
