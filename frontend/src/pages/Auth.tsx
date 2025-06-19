
import React, { useState } from 'react'
import VendorSignup from '@/components/VendorSignup'
import VendorLogin from '@/components/VendorLogin'
import PasswordReset from '@/components/PasswordReset'

type AuthView = 'login' | 'signup' | 'reset'

const Auth = () => {
  const [currentView, setCurrentView] = useState<AuthView>('login')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {currentView === 'login' && (
          <VendorLogin
            onSwitchToSignup={() => setCurrentView('signup')}
            onSwitchToForgotPassword={() => setCurrentView('reset')}
          />
        )}
        
        {currentView === 'signup' && (
          <VendorSignup
            onSwitchToLogin={() => setCurrentView('login')}
          />
        )}
        
        {currentView === 'reset' && (
          <PasswordReset
            onBack={() => setCurrentView('login')}
          />
        )}
      </div>
    </div>
  )
}

export default Auth
