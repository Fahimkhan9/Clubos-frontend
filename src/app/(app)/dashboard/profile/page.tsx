import  CreateClub  from '@/components/club/CreateClub'
import UpdateProfile from '@/components/profile/UpdateProfile'
import React from 'react'

function ProfilePage() {
  return (
    <div>
       <div className="bg-muted/50 rounded-lg p-8 text-center shadow-md">
        <h2 className="text-2xl font-bold mb-4">Start Your Own Club</h2>
        <p className="text-muted-foreground mb-6">
          Take the lead and create a club that aligns with your passions. Invite others, host events, and manage everything in one place.
        </p>
        <div className="flex justify-center">
          <CreateClub />
        </div>
      </div>
        <UpdateProfile/>
        
      
    </div>
  )
}

export default ProfilePage