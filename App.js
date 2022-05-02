import AuthProvider from "./AuthProvider";
import Index from "./Index";

export default function App() {
  return (
    <AuthProvider>
      <Index />
    </AuthProvider>
  );
}
