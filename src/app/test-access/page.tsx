export default function TestAccessPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Test Access Page</h1>
        <p className="mb-4">This page is publicly accessible for testing.</p>
        
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded">
            <h2 className="font-bold mb-2">Login Methods:</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Admin Code: <code className="bg-background px-2 py-1 rounded">admin123</code></li>
              <li>Email: <code className="bg-background px-2 py-1 rounded">admin@beta.test</code> / Password: <code className="bg-background px-2 py-1 rounded">betaadmin123</code></li>
            </ol>
          </div>
          
          <div className="p-4 bg-muted rounded">
            <h2 className="font-bold mb-2">Direct Links:</h2>
            <ul className="space-y-2">
              <li><a href="/tools" className="text-blue-500 hover:underline">/tools - YouTube Analyzer</a></li>
              <li><a href="/analyze" className="text-blue-500 hover:underline">/analyze - Channel Analysis</a></li>
              <li><a href="/dashboard" className="text-blue-500 hover:underline">/dashboard - Main Dashboard</a></li>
              <li><a href="/auth/signin" className="text-blue-500 hover:underline">/auth/signin - Login Page</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}