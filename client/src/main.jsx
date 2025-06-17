import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignIn, SignUp, RedirectToSignIn } from '@clerk/clerk-react';

import App from './App.jsx';
import './index.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={clerkPubKey}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/sign-in"
          element={
            <SignIn
              path="/sign-in"
              routing="path"
              signUpUrl="/sign-up"
              afterSignInUrl="/"
            />
          }
        />
        <Route
          path="/sign-up"
          element={
            <SignUp
              path="/sign-up"
              routing="path"
              signInUrl="/sign-in"
              afterSignUpUrl="/"
            />
          }
        />
        <Route path="*" element={<RedirectToSignIn />} />
      </Routes>
    </BrowserRouter>
  </ClerkProvider>
);