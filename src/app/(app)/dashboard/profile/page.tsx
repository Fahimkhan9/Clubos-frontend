import  CreateClub  from '@/components/club/CreateClub'
import UpdateProfile from '@/components/profile/UpdateProfile'
import React from 'react'

function ProfilePage() {
  return (
    <div>
        <UpdateProfile/>
        <CreateClub/>
    </div>
  )
}

export default ProfilePage