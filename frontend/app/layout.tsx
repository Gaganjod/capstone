import type { Metadata } from 'next';
import './globals.css';
import { AccessibilityProvider } from '../context/AccessibilityContext';

export const metadata: Metadata = {
  title: 'AdaptLearn AI | Learning That Adapts to You',
  description:
    'Dynamic learner modeling for multimodal adaptive learning of dyslexic students using Explainable AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AccessibilityProvider>{children}</AccessibilityProvider>
      </body>
    </html>
  );
}
