import AcceptInvitation from '@/components/club/AcceptInvitation'
import React, { Suspense } from 'react'

function AcceptInvitationPage() {
  return (
    
      <Suspense fallback={<p className="text-center mt-10">Loading...</p>}>
      <AcceptInvitation/>
      </Suspense>
        

  )
}

export default AcceptInvitationPage